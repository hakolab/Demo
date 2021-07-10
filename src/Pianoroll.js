import React, { useState, useReducer, useRef } from "react";
import * as Tone from "tone";
import { Grid, Box, Slider } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import AddIcon from '@material-ui/icons/Add';
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import * as AppData from "./AppData";
import './styles.css'
import './styles.scss'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { copy, copyArray, deepCopy, clone } from './recursiveCopy'

/*

controllerを
Grid レイアウトに変更
overflow設定

 */


const initialState = {
  numberOfBars: 4,
  beatIndex: 2,
  noteCount: 32,
  keyboardType: clone(AppData.toyPiano),
  notes: AppData.toyPiano.data.map(octaveObj => octaveObj.tones.map(_ =>  new Array(32).fill(false)))
}

function reducer(state, action){
  switch(action.type){
    case "changeNumberOfBars": {
      const newNoteCount = AppData.beatOptions[state.beatIndex].numberOfNotesInBar * action.payload
      const newNotes = copyArray(state.notes, state.keyboardType.data.map(octaveObj => octaveObj.tones.map(_ =>  new Array(newNoteCount).fill(false))))
      return {...state, numberOfBars: action.payload, noteCount: newNoteCount, notes: newNotes}
    }
    case "changeBeat": {
      const newNoteCount = AppData.beatOptions[action.payload].numberOfNotesInBar * state.numberOfBars
      const newNotes = copyArray(state.notes, state.keyboardType.data.map(octaveObj => octaveObj.tones.map(_ =>  new Array(newNoteCount).fill(false))))
      return {...state, beatIndex: action.payload, noteCount: newNoteCount, notes: newNotes}
    }
    case "changeKeyboard": {
      console.log("state")
      console.log(state)
      const toNotes = copy(
        state.notes,
        action.payload.data.map(octaveObj => octaveObj.tones.map(_ =>  new Array(state.noteCount).fill(false))),
        state.keyboardType.data,
        action.payload.data)

      return {...state,
        keyboardType: action.payload,
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
      return {
        ...state,
        numberOfBars: 4,
        beatIndex: 2,
        noteCount: 32,
        keyboardType: AppData.oneOctave
      }
    }
    case "clearNotes": {
      return {...state, notes: state.keyboardType.data.map(octaveObj => octaveObj.tones.map(_ =>  new Array(state.noteCount).fill(false)))}
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

  /** プルダウンボタン開閉フラグ */
  const [open, setOpen] = useState(false);
  /** プルダウンボタン用Ref */
  const anchorRef = useRef(null);

  function handleMouseDown(event, octave, row, col) {
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
          playNotes.push(`${state.keyboardType.data[octaveIndex].tones[toneIndex].pitchName}${state.keyboardType.data[octaveIndex].octave}`);
        }
      })
    });
    return playNotes;
  }
  /** time signature */
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

  /** time signature */
  const handleMenuItemClick = (event, index) => {
    setOpen(false);
    dispatch({type: "changeBeat", payload: index})
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };
  /** time signature end */

  return (
    <div id="container">
      <Grid id="controller" container spacing={1}>
        <Grid container item xs={12}>
          <Box m={1}>
            <ButtonGroup color="primary" aria-label="outlined primary button group">
              <Button onClick={() => dispatch({type: "changeKeyboard", payload: AppData.oneOctave})} className="btn-w-130" disabled={transportState === "started"}>one octave</Button>
              <Button onClick={() => dispatch({type: "changeKeyboard", payload: AppData.toyPiano})} className="btn-w-130" disabled={transportState === "started"}>toy piano</Button>
              <Button onClick={() => dispatch({type: "changeKeyboard", payload: AppData.keyboard76})} className="btn-w-130" disabled={transportState === "started"}>keyboard 76</Button>
            </ButtonGroup>
          </Box>  
          <Box m={1}>
            <ButtonGroup color="primary" aria-label="outlined primary button group">
              {
                transportState === "stopped"
                && <Button type="button" onClick={start} className="btn-w-120">
                    start
                  </Button>
              }
              {
                transportState === "started"
                && <Button id="stop" type="button" onClick={stop} className="btn-w-120">
                    stop
                  </Button>
              }        
              <Button id="clear" type="button" onClick={clearNotes} className="btn-w-120"  disabled={transportState === "started"}>
                clear
              </Button>
              <Button id="clear-all" type="button" onClick={clearAll} className="btn-w-120"  disabled={transportState === "started"}>
                all clear
              </Button>
            </ButtonGroup>
          </Box>
          <Box m={1}>
            <ButtonGroup variant="contained" color="primary" ref={anchorRef} aria-label="split button" variant="outlined" disableRipple  disabled={transportState === "started"}>
              <Button>{AppData.beatOptions[state.beatIndex].value}</Button>
              <Button
                color="primary"
                size="small"
                aria-controls={open ? 'split-button-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-label="select merge strategy"
                aria-haspopup="menu"
                onClick={handleToggle}
              >
                <ArrowDropDownIcon />
              </Button>
            </ButtonGroup>
            <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList id="split-button-menu">
                        {AppData.beatOptions.map((option, index) => (
                          <MenuItem
                            key={option.key}
                            selected={index === state.beatIndex}
                            onClick={(event) => handleMenuItemClick(event, index)}
                          >
                            {option.value}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </Box>
        </Grid>
        <Grid container spacing={2}item xs={12}>
          <Grid item xs={12} sm={6}/*  sm={12} md={6} */>
            <Box>
              <Grid container spacing={1}>
                <Grid item>
                  <ViewColumnIcon />
                  {/* <RemoveIcon /> */}
                </Grid>
                <Grid item xs>
                  <Slider
                    value={state.numberOfBars}
                    onChange={handleChangeBars}
                    min={2}
                    max={16}
                    onMouseDown={() => setIsChanging(true)}
                    onChangeCommitted={() => setIsChanging(false)}
                    disabled={transportState === "started"}
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item>
                  <AddIcon />
                  {/* <span>{state.numberOfBars} bars</span> */}
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} /*  md={6} */>
            <Box>
              <Grid container spacing={1}>
                <Grid item>
                  <DirectionsWalkIcon/>
                </Grid>
                <Grid item xs>
                    <Slider
                      value={bpm}
                      onChange={handleChange}
                      min={40}
                      max={200}
                      onMouseDown={() => setIsChanging(true)}
                      onChangeCommitted={() => setIsChanging(false)}
                      valueLabelDisplay="auto"
                    />
                </Grid>
                <Grid item>
                  <DirectionsRunIcon />
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <div id="piano-roll">
      {
        state.keyboardType.data.map((octaveObj, octaveIndex) => {
          return (
            <div className="octave">
              <div className={`keyboard ${state.keyboardType.mode}`}>
                {
                  octaveObj.tones.map((tone, toneIndex) => {
                    let rowClassName = octaveObj.bKeyIndex.indexOf(toneIndex) >= 0 ? "black-key" : "white-key";
                    // 最高音域の場合は .top を設定
                    if(octaveIndex === 0){
                      rowClassName += ' top'
                    }
                    // 最低音域の場合は、 .bottom を設定
                    if((state.keyboardType.data.length - 1) === octaveIndex){
                      rowClassName += ' bottom'
                    }
                    return (
                      <div className={`${rowClassName} ${tone.pitchName}`}></div>
                    )
                  })
                }
              </div>
              <div className={`grid ${AppData.beatOptions[state.beatIndex].key}`}>
                {
                  octaveObj.tones.map((tone, toneIndex) => {
                    let rowClassName =octaveObj.bKeyIndex.indexOf(toneIndex) >= 0 ? "b-key" : "w-key";
                    return (
                      <div className={`row ${rowClassName} ${tone.pitchName}`}>
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
                                key={`${tone.pitchName}${tone.octave}${noteIndex}`}
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