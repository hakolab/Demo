import React, { useState, useReducer, useRef, useEffect } from "react";
import * as Tone from "tone";
import { Grid, Box, Button, Drawer, IconButton, SwipeableDrawer } from "@material-ui/core";
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ReorderIcon from '@material-ui/icons/Reorder';
import * as AppData from "./AppData";
import './styles.css'
import './styles.scss'
import { copy, copyArray, deepCopy, clone } from './recursiveCopy'
import SelectButton from "./components/SelectButton";
import ControlButton from "./components/ControlButton";
import ControlSlider from "./components/ControlSlider";
import { BrowserView, MobileView, isIOS, isMobile } from "react-device-detect";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { useButtonStyles } from "./hooks/useButtonStyles";
import AlertDialog from "./components/AlertDialog";

const initialState = {
  numberOfBars: 4,
  beat: clone(AppData.fourFour),
  noteCount: 32,
  keyboard: clone(AppData.oneOctave),
  notes: AppData.oneOctave.data.map(octaveObj => octaveObj.tones.map(_ =>  new Array(32).fill(false)))
}

function reducer(state, action){
  switch(action.type){
    case "changeNumberOfBars": {
      const newNoteCount = state.beat.numberOfNotesInBar * action.payload
      const newNotes = copyArray(state.notes, state.keyboard.data.map(octaveObj => octaveObj.tones.map(_ =>  new Array(newNoteCount).fill(false))))
      return {...state, numberOfBars: action.payload, noteCount: newNoteCount, notes: newNotes}
    }
    case "changeBeat": {
      const newBeat = AppData.getBeat(action.payload)
      const newNoteCount = newBeat.numberOfNotesInBar * state.numberOfBars
      const newNotes = copyArray(state.notes, state.keyboard.data.map(octaveObj => octaveObj.tones.map(_ =>  new Array(newNoteCount).fill(false))))
      return {...state, beat: newBeat, noteCount: newNoteCount, notes: newNotes}
    }
    case "changeKeyboard": {
      const newKeyboard = AppData.getKeyboard(action.payload);
      const toNotes = copy(
        state.notes,
        newKeyboard.data.map(octaveObj => octaveObj.tones.map(_ =>  new Array(state.noteCount).fill(false))),
        state.keyboard.data,
        newKeyboard.data)

      return {
        ...state,
        keyboard: newKeyboard,
        notes: toNotes
      }
    }
    case "toggleActivationOfNote": {
      const newNotes = deepCopy(state.notes);
      const current = newNotes[action.payload.octave][action.payload.row][action.payload.col];
      newNotes[action.payload.octave][action.payload.row][action.payload.col] = !current;
      return {...state}
    }
    case "clearConfig": {
      return {...initialState}
    }
    case "clearNotes": {
      return {...state, notes: state.keyboard.data.map(octaveObj => octaveObj.tones.map(_ =>  new Array(state.noteCount).fill(false)))}
    }
    default:

  }
}

export default function Pianoroll() {
  const [state, dispatch] = useReducer(reducer, initialState);

  /** state トランスポートの状態 started/stopped */
  const [transportState, setTransportState] = useState(Tone.Transport.state);
  /** state シーケンサーの現在値 */
  const [currentStep, setCurrentStep] = useState();
  /** シーケンサー配列 */
  const steps = new Array(state.noteCount).fill(null).map((_, i) => i);
  /** BPM */
  const [bpm, setBpm] = useState(Tone.Transport.bpm.value);
  /** スライダー操作中フラグ */
  const [isChanging, setIsChanging] = useState(false);

  const classes = useButtonStyles();

  function handleMouseDown(event, octave, row, col) {
    console.log('mouse')
    // 要素をドラッグしようとするのを防ぐ
    event.preventDefault();
    dispatch({type: "toggleActivationOfNote", payload: {octave, row, col}})
  }

  function handleMouseEnter(event, octave, row, col) {
    // 左クリックされていなければ return
    if (event.buttons !== 1) {
      return;
    }
    console.log('enter')
    // テンポ変更中のときは return
    if (isChanging) {
      return;
    }

    event.preventDefault();
    dispatch({type: "toggleActivationOfNote", payload: {octave, row, col}})
  }

  function start() {
    const synth = new Tone.PolySynth().toDestination()
    const seq = new Tone.Sequence((time, step) => {
      const playNotes = getPlayNotes(step);
      synth.triggerAttackRelease(playNotes, "8t", time);
      setCurrentStep(step);
    }, steps).start(0);

    Tone.Transport.start();
    setTransportState(Tone.Transport.state);

    function dispose() {
      console.log('dispose')
      seq.dispose();
      Tone.Transport.off('stop', dispose)
    }

    Tone.Transport.on('stop', dispose)
  }

  function stop() {
    Tone.Transport.stop();
    setCurrentStep(null);
    setTransportState(Tone.Transport.state);
  }

  function getPlayNotes(step) {
    let playNotes = [];
    state.notes.forEach((octave, octaveIndex) => {
      octave.forEach((tone, toneIndex) => {
        if(tone[step]){
          playNotes.push(`${state.keyboard.data[octaveIndex].tones[toneIndex].pitchName}${state.keyboard.data[octaveIndex].octave}`);
        }
      })
    });
    return playNotes;
  }

  function handleChange(event, newValue) {
    setBpm(newValue);
    Tone.Transport.bpm.value = newValue;
  }

  function handleChangeBars(event, newValue) {
    dispatch({type: "changeNumberOfBars", payload: newValue})
  }

  function clearNotes() {
    stop();
    dispatch({type: "clearNotes"})
  }

  function clearAll() {
    dispatch({type: "clearConfig"})
    clearNotes();
    setBpm(120);
    Tone.Transport.bpm.value = 120;
  }

  const [openDrawer, setOpenDrawer] = useState(false)
  function toggleDrawer(openDrawer){
    setOpenDrawer(openDrawer)
  }

  const [targetNoteId, setTargetNoteId] = useState(null)

  const [openDialog, setOpenDialog] = useState(false);

  function handleClickOk(){
    setOpenDialog(false)
  }

  useEffect(() => {
    if(isMobile){
      setOpenDialog(true)
      window.addEventListener('touchstart', handleTouchStart, { passive: false })

      function handleTouchStart(event){
        const pageX = event.touches[0].pageX
        const pageY = event.touches[0].pageY
        const element = document.elementFromPoint(pageX,pageY)

        // 要素が取得できなかったら何もしない
        if(element === null){
          return
        }
        // セルがクリックされていたら音を更新して終了
        if(element.id.startsWith('note[')){
          setTargetNoteId(element.id)
          dispatch({type: "toggleActivationOfNote", payload: {octave: element.dataset.octave, row: element.dataset.tone, col: element.dataset.note}})
          console.log('start')

          function handleTouchMove(e){
            console.log('move')
            const pageX = e.touches[0].pageX
            const pageY = e.touches[0].pageY
            const element = document.elementFromPoint(pageX,pageY)
            if(element === null || element.id.startsWith('note[') === false){
              return
            }
            if(targetNoteId !== element.id){
              setTargetNoteId(element.id)
              dispatch({type: "toggleActivationOfNote", payload: {octave: element.dataset.octave, row: element.dataset.tone, col: element.dataset.note}})
            }
          }
  
          function handleTouchEnd(){
            console.log('end')
            window.removeEventListener('touchmove', handleTouchMove, { passive: false })
            window.removeEventListener('touchend', handleTouchEnd, { passive: false })
          }

          window.addEventListener('touchmove', handleTouchMove, { passive: false })
          window.addEventListener('touchend', handleTouchEnd, { passive: false })

          event.preventDefault()
        }
      }
    }
  },[])

  return (
    <div id="container">
      <BrowserView>
        <Grid id="controller" container spacing={1}>
          <Grid container item xs={12}>
            <Box m={1}>
              <SelectButton
                data={AppData.getKeyboardsName()}
                onClick={dispatch}
                action="changeKeyboard"
                disabled={transportState === "started"}
                />
            </Box>
            <Box m={1}>
              <SelectButton
                data={AppData.getBeatsName()}
                onClick={dispatch}
                action="changeBeat"
                disabled={transportState === "started"}
                size="small"
                />
            </Box>
            <Box m={1}>
              <ControlButton
                start={start}
                stop={stop}
                clear={clearNotes}
                allClear={clearAll}
                isPlaying={transportState === "started"}
                />
            </Box>
          </Grid>
          <Grid container spacing={2}item xs={12}>
            <Grid item xs={12} sm={6}>
              <ControlSlider
                value={state.numberOfBars}
                onChange={handleChangeBars}
                min={2}
                max={16}
                onMouseDown={() => setIsChanging(true)}
                onChangeCommitted={() => setIsChanging(false)}
                disabled={transportState === "started"}
                iconRotate={true}
                IconLeft={DragHandleIcon}
                IconRight={ReorderIcon}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ControlSlider
                  value={bpm}
                  onChange={handleChange}
                  min={40}
                  max={200}
                  onMouseDown={() => setIsChanging(true)}
                  onChangeCommitted={() => setIsChanging(false)}
                  disabled={false}
                  valueLabelDisplay="auto"
                  iconRotate={false}
                  IconLeft={DirectionsWalkIcon}
                  IconRight={DirectionsRunIcon}
                  />
            </Grid>
          </Grid>
        </Grid>
      </BrowserView>
      <MobileView>
        <AlertDialog
          open={openDialog}
          title={"WELCOME"}
          text={"ピアノロールは横画面にのみ対応しています！"}
          confirm={false}
          onClickOk={handleClickOk}
        />
        <Box display="flex">
          <Box m={1}>
            <ControlButton
              start={start}
              stop={stop}
              clear={clearNotes}
              allClear={clearAll}
              isPlaying={transportState === "started"}
              />
          </Box>
          <Box m={1} flexGrow={1}>
            <ControlSlider
              value={bpm}
              onChange={handleChange}
              min={40}
              max={200}
              onMouseDown={() => setIsChanging(true)}
              onChangeCommitted={() => setIsChanging(false)}
              disabled={false}
              valueLabelDisplay="auto"
              iconRotate={false}
              IconLeft={DirectionsWalkIcon}
              IconRight={DirectionsRunIcon}
              />
          </Box>
          <Box my={1} mx={3}>
            <Button color="primary" variant="outlined" className={classes.common} onClick={() => toggleDrawer(true)}>
              <FontAwesomeIcon icon={faCog}/>
            </Button>
            <SwipeableDrawer
              anchor="top"
              open={openDrawer}
              onOpen={() => toggleDrawer(false)}
              onClose={() => toggleDrawer(false)}
              disableBackdropTransition={!isIOS}
              disableDiscovery={isIOS}
              >
              <Box display="flex">
                <Box m={1}>
                  <SelectButton
                    data={AppData.getKeyboardsName()}
                    onClick={dispatch}
                    action="changeKeyboard"
                    disabled={transportState === "started"}
                    />
                </Box>
                <Box m={1}>
                  <SelectButton
                    data={AppData.getBeatsName()}
                    onClick={dispatch}
                    action="changeBeat"
                    disabled={transportState === "started"}
                    size="small"
                    />
                </Box>
              </Box>
              <ControlSlider
                value={state.numberOfBars}
                onChange={handleChangeBars}
                min={2}
                max={16}
                onMouseDown={() => setIsChanging(true)}
                onChangeCommitted={() => setIsChanging(false)}
                disabled={transportState === "started"}
                iconRotate={true}
                IconLeft={DragHandleIcon}
                IconRight={ReorderIcon}
                />
              <Box m={1} textAlign="center">
                <IconButton className={classes.common} onClick={() => toggleDrawer(false)}>
                  <ExpandLessIcon />
                </IconButton>
              </Box>
            </SwipeableDrawer>
          </Box>
        </Box>
      </MobileView>
      <div id="piano-roll">
      {
        state.keyboard.data.map((octaveObj, octaveIndex) => {
          return (
            <div id={`octave:${octaveObj.octave}`} key={`octave:${octaveObj.octave}`} className="octave">
              <div className={`keyboard ${state.keyboard.mode}`}>
                {
                  octaveObj.tones.map((tone, toneIndex) => {
                    let rowClassName = octaveObj.bKeyIndex.indexOf(toneIndex) >= 0 ? "black-key" : "white-key";
                    // 最高音域の場合は .top を設定
                    if(octaveIndex === 0){
                      rowClassName += ' top'
                    }
                    // 最低音域の場合は、 .bottom を設定
                    if((state.keyboard.data.length - 1) === octaveIndex){
                      rowClassName += ' bottom'
                    }
                    return (
                      <div
                        id={`key:${tone.pitchName}${octaveObj.octave}`}
                        key={`key:${tone.pitchName}${octaveObj.octave}`}
                        className={`${rowClassName} ${tone.pitchName}`}
                        >
                        </div>
                    )
                  })
                }
              </div>
              <div id="grid-roll" className={`grid ${state.beat.mode}`}>
                {
                  octaveObj.tones.map((tone, toneIndex) => {
                    let rowClassName =octaveObj.bKeyIndex.indexOf(toneIndex) >= 0 ? "b-key" : "w-key";
                    return (
                      <div id={`tone:${tone.pitchName}`} key={`tone:${tone.pitchName}`} className={`row ${rowClassName} ${tone.pitchName}`}>
                        {
                          state.notes[octaveIndex][toneIndex].map((note, noteIndex) => {
                            // 選択されているか
                            let cellClassName = note ? "active" : "";
                            // シーケンサーがいまのステップか
                            if (currentStep === noteIndex) {
                              cellClassName = cellClassName + " now";
                            }
                            return (
                              <div
                                id={`note[${tone.pitchName}${octaveObj.octave}]:${noteIndex}`}
                                key={`note[${tone.pitchName}${octaveObj.octave}]:${noteIndex}`}
                                data-octave={octaveIndex}
                                data-tone={toneIndex}
                                data-note={noteIndex}
                                onMouseDown={(event) =>
                                  handleMouseDown(event, octaveIndex, toneIndex, noteIndex)
                                }
                                onMouseEnter={(event) =>
                                  handleMouseEnter(event, octaveIndex, toneIndex, noteIndex)
                                }
                                className={cellClassName}
                              ></div>
                            )
                          })
                        }
                      </div>
                    )
                  })
                }
              </div>
            </div>
          )
        })
      }
      </div>
    </div>
  );
}