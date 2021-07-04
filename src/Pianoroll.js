import React, { useState, useEffect, useReducer, useRef } from "react";
import * as Tone from "tone";
import { Slider } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
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

/*

clear, all clear ボタンを実装
RESETボタン押したとき、notes をリセット
2回目のリセットが効かない

TODO
鍵盤タイプを更新したら対応する音のアクティベーションを保持できたらいいな

overflow設定

 */


const initialState = {
  numberOfBars: 4,
  beatIndex: 2,
  noteCount: 32,
  keyboardType: AppData.keyboard76,
  notes: AppData.keyboard76.data.map(octaveObj => octaveObj.tones.map(_ =>  new Array(32).fill(false)))
}

function reducer(state, action){
  switch(action.type){
    case "changeNumberOfBars": {
      const newNoteCount = AppData.beatOptions[state.beatIndex].numberOfNotesInBar * action.payload
      const newNotes = state.keyboardType.data.map(octaveObj => octaveObj.tones.map(_ =>  new Array(newNoteCount).fill(false)))
      return {...state, numberOfBars: action.payload, noteCount: newNoteCount, notes: newNotes}
    }
    case "changeBeat": {
      const newNoteCount = AppData.beatOptions[action.payload].numberOfNotesInBar * state.numberOfBars
      const newNotes = state.keyboardType.data.map(octaveObj => octaveObj.tones.map(_ =>  new Array(newNoteCount).fill(false)))
      return {...state, beatIndex: action.payload, noteCount: newNoteCount, notes: newNotes}
    }
    case "changeKeyboard": {
      const newNotes = action.payload.data.map(octaveObj => octaveObj.tones.map(_ =>  new Array(state.noteCount).fill(false)))
      return {...state, keyboardType: action.payload, notes: newNotes}
    }
    case "toggleActivationOfNote": {
      console.log(action)
      const newNotes = state.notes.slice();
      const current = newNotes[action.payload.octave][action.payload.row][action.payload.col];
      newNotes[action.payload.octave][action.payload.row][action.payload.col] = !current;
      return {...state}
    }
    case "reset": {
      return {...initialState}
    }
    default:

  }
}

export default function Pianoroll() {
  const [state, dispatch] = useReducer(reducer, initialState);

  /** state 小節数 */
  //const [numberOfBars, setNumberOfBars] = useState(4);
  /** state 拍子インデックス */
  //const [beatIndex, setBeatIndex] = useState(2);
  /** state 総音符数 */
  //const [noteCount, setNoteCount] = useState(() => getNumberOfNotesInBar());

  function getNumberOfNotesInBar(){
    const noteCount = AppData.beatOptions[state.beatIndex].numberOfNotesInBar * state.numberOfBars
    return noteCount;
  }

  /** state 鍵盤タイプ */
  //const [keyboardType, setKeyboardType] = useState(AppData.keyboard76);
  /** state 音符 */
  /* const [notes, setNotes] = useState(
    state.keyboardType.data.map(octaveObj => octaveObj.tones.map(_ =>  new Array(state.noteCount).fill(false)))
  ); */
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

  /**
   * 総音符数更新
   * -----
   * 小節数、拍子が変更されたら総音符数を更新
   */
  /* useEffect(() => {
    setNoteCount(getNumberOfNotesInBar())
  },[state.numberOfBars, beatIndex]) */

  /**
   * 音符更新
   * -----
   * 総音符数、鍵盤タイプが変更されたら音符を更新
   */
  /* useEffect(() => {
    setNotes(keyboardType.data.map(octaveObj => octaveObj.tones.map(_ =>  new Array(noteCount).fill(false))))
  },[noteCount]) */
  

  function handleMouseDown(event, octave, row, col) {
    // 要素をドラッグしようとするのを防ぐ
    event.preventDefault();
    dispatch({type: "toggleActivationOfNote", payload: {octave, row, col}})
    //console.log(`mouse down on ${row}:${col} of ${octave}`);

    /* const newNotes = state.notes.slice();
    const current = newNotes[octave][row][col];
    newNotes[octave][row][col] = !current;
    setNotes(newNotes); */
  }

  function handleMouseEnter(event, octave, row, col) {
    //console.log(`mouse enter on ${row}:${col}`);
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
    /* const newNotes = state.notes.slice();
    const current = newNotes[octaveIndex][toneIndex][noteIndex];
    newNotes[octaveIndex][toneIndex][noteIndex] = !current;
    setNotes(newNotes); */
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
    //setNumberOfBars(newValue);
    dispatch({type: "changeNumberOfBars", payload: newValue})
  }

  function reset() {
    stop();
    /* setNotes(
      state.keyboardType.data.map(octaveObj => octaveObj.tones.map(_ =>  new Array(state.noteCount).fill(false)))
    ); */
    setBpm(120);
    Tone.Transport.bpm.value = 120;

    dispatch({type: "reset"})
  }

  /* const handleClick = () => {
    console.info(`You clicked ${options[selectedIndex]}`);
  }; */

  const handleMenuItemClick = (event, index) => {
    //setBeatIndex(index);
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
      <div id="controller" className="clearfix">
        <div id="select-buttons">
          <ButtonGroup color="primary" aria-label="outlined primary button group">
            <Button onClick={() => {
              //setKeyboardType(AppData.oneOctave)
              dispatch({type: "changeKeyboard", payload: AppData.oneOctave})
              }} disabled={transportState === "started"}>one octave</Button>
            <Button onClick={() => {
              //setKeyboardType(AppData.toyPiano)
              dispatch({type: "changeKeyboard", payload: AppData.toyPiano})
              }} disabled={transportState === "started"}>toy piano</Button>
            <Button onClick={() => {
              //setKeyboardType(AppData.keyboard76)
              dispatch({type: "changeKeyboard", payload: AppData.keyboard76})
              }} disabled={transportState === "started"}>keyboard 76</Button>
          </ButtonGroup>
        </div>
        <div id="control-buttons">
          <ButtonGroup color="primary" aria-label="outlined primary button group">
            {
              transportState === "stopped"
              && <Button type="button" onClick={start} className="btn-w-80">
                  start
                </Button>
            }
            {
              transportState === "started"
              && <Button id="stop" type="button" onClick={stop} className="btn-w-80">
                  stop
                </Button>
            }        
            <Button id="reset" type="button" onClick={reset} className="btn-w-80"  disabled={transportState === "started"}>
              reset
            </Button>
          </ButtonGroup>
        </div>
        <div id="time-signature-buttons">
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
                          //disabled={index === 2}
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
        </div>
        <div id="bars">
          <div className="slider">
            <Slider
              value={state.numberOfBars}
              onChange={handleChangeBars}
              min={2}
              max={16}
              onMouseDown={() => setIsChanging(true)}
              onChangeCommitted={() => setIsChanging(false)}
              disabled={transportState === "started"}
            />
          </div>
          <span>{state.numberOfBars} bars</span>
        </div>
        <div id="tempo">
          {/* <div className="label">BPM: {bpm}</div> */}
          <DirectionsWalkIcon/>
          <div className="slider">
            <Slider
              value={bpm}
              onChange={handleChange}
              min={40}
              max={200}
              onMouseDown={() => setIsChanging(true)}
              onChangeCommitted={() => setIsChanging(false)}
            />
          </div>
          <DirectionsRunIcon />
          <span>{bpm}</span>
        </div>
      </div>
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