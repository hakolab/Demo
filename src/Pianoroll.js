import React, { useState, useEffect } from "react";
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

export default function Pianoroll() {
  const [noteCount, setNoteCount] = useState(32);
  const [tones, setTones] = useState(AppData.keyboard76);
  const [notes, setNotes] = useState(
    tones.data.map(octaveObj => octaveObj.tones.map(_ =>  new Array(noteCount).fill(false)))
  );
  //console.log(notes)
  const [isPlaying, setIsPlaying] = useState(Tone.Transport.state);
  //console.log(`state is ${isPlaying}`);
  const [currentStep, setCurrentStep] = useState();
  const steps = new Array(noteCount).fill(null).map((_, i) => i);
  const [bpm, setBpm] = useState(Tone.Transport.bpm.value);
  const [isChanging, setIsChanging] = useState(false);
  const [bars, setBars] = useState(4);

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  function handleMouseDown(event, octave, row, col) {
    // 要素をドラッグしようとするのを防ぐ
    event.preventDefault();

    console.log(`mouse down on ${row}:${col} of ${octave}`);

    const newNotes = notes.slice();
    const current = newNotes[octave][row][col];
    newNotes[octave][row][col] = !current;
    setNotes(newNotes);
  }

  function handleMouseEnter(event, octaveIndex, toneIndex, noteIndex) {
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
    const newNotes = notes.slice();
    const current = newNotes[octaveIndex][toneIndex][noteIndex];
    newNotes[octaveIndex][toneIndex][noteIndex] = !current;
    setNotes(newNotes);
  }

  useEffect(() => {
    if(Tone.Transport.state === "stopped"){

    }
  },[Tone.Transport.state])

  function start() {
    const synth = new Tone.PolySynth().toDestination()
    const seq = new Tone.Sequence((time, step) => {
      const playNotes = getPlayNotes(step);
      synth.triggerAttackRelease(playNotes, "8t", time);
      setCurrentStep(step);
    }, steps).start(0);
    Tone.Transport.start();
    setIsPlaying(Tone.Transport.state);

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
    setIsPlaying(Tone.Transport.state);
  }

  function getPlayNotes(step) {
    let playNotes = [];
    notes.forEach((octave, octaveIndex) => {
      octave.forEach((tone, toneIndex) => {
        if(tone[step]){
          playNotes.push(`${tones.data[octaveIndex].tones[toneIndex].pitchName}${tones.data[octaveIndex].octave}`);
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
    setBars(newValue);
  }

  function reset() {
    stop();
    setNotes(
      tones.data.map(octaveObj => octaveObj.tones.map(_ =>  new Array(noteCount).fill(false)))
    );
    setBpm(120);

    Tone.Transport.bpm.value = 120;
  }

  /* const handleClick = () => {
    console.info(`You clicked ${options[selectedIndex]}`);
  }; */

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
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
            <Button onClick={() => setTones(AppData.oneOctave)}>one octave</Button>
            <Button onClick={() => setTones(AppData.toyPiano)}>toy piano</Button>
            <Button onClick={() => setTones(AppData.keyboard76)}>keyboard 76</Button>
          </ButtonGroup>
        </div>
        <div id="control-buttons">
          <ButtonGroup color="primary" aria-label="outlined primary button group">
            {
              isPlaying === "stopped"
              && <Button type="button" onClick={start} className="btn-w-80">
                  start
                </Button>
            }
            {
              isPlaying === "started"
              && <Button id="stop" type="button" onClick={stop} className="btn-w-80">
                  stop
                </Button>
            }        
            <Button id="reset" type="button" onClick={reset} className="btn-w-80">
              reset
            </Button>
          </ButtonGroup>
        </div>
        <div id="time-signature-buttons">
          <ButtonGroup variant="contained" color="primary" ref={anchorRef} aria-label="split button" variant="outlined" disableRipple>
            <Button>{AppData.beatOptions[selectedIndex].value}</Button>
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
                          selected={index === selectedIndex}
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
              value={bars}
              onChange={handleChangeBars}
              min={2}
              max={16}
              onMouseDown={() => setIsChanging(true)}
              onChangeCommitted={() => setIsChanging(false)}
            />
          </div>
          <span>{bars} bars</span>
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
        tones.data.map((octaveObj, octaveIndex) => {
          return (
            <div className="octave">
              <div className={`keyboard ${tones.mode}`}>
                {
                  octaveObj.tones.map((tone, toneIndex) => {
                    let rowClassName = octaveObj.bKeyIndex.indexOf(toneIndex) >= 0 ? "black-key" : "white-key";
                    // 最高音域の場合は .top を設定
                    if(octaveIndex === 0){
                      rowClassName += ' top'
                    }
                    // 最低音域の場合は、 .bottom を設定
                    if((tones.data.length - 1) === octaveIndex){
                      rowClassName += ' bottom'
                    }
                    return (
                      <div className={`${rowClassName} ${tone.pitchName}`}></div>
                    )
                  })
                }
              </div>
              <div className={`grid ${AppData.beatOptions[selectedIndex].key}`}>
                {
                  octaveObj.tones.map((tone, toneIndex) => {
                    let rowClassName =octaveObj.bKeyIndex.indexOf(toneIndex) >= 0 ? "b-key" : "w-key";
                    return (
                      <div className={`row ${rowClassName} ${tone.pitchName}`}>
                        {
                          notes[octaveIndex][toneIndex].map((note, noteIndex) => {
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