import React, { useState, useEffect } from "react";
import * as Tone from "tone";
import { Slider } from "@material-ui/core";
import { keyboard76, oneOctave, toyPiano } from "./data";
import './styles.css'
import './styles.scss'

const config = {
  octave: 1,
  noteCount: 8
};

const steps = new Array(config.noteCount).fill(null).map((_, i) => i);

/*
コントローラーを作成

動的に鍵盤を表示
・てっぺんのド
・鍵盤数を選べるように
  ８８鍵
  キーボード（49~61）
  トイピアノ

全体のレイアウト

*/

const sequencer = new Tone.Sequence();

const bKeyIndex = [1, 3, 5, 8, 10];

export default function Pianoroll() {
  const [tones, setTones] = useState(keyboard76);
  const [notes, setNotes] = useState(
    tones.map(octave => octave.tones.map(tones =>  new Array(config.noteCount).fill(false)))
  );
  //console.log(notes)
  const [isPlaying, setIsPlaying] = useState(Tone.Transport.state);
  //console.log(`state is ${isPlaying}`);
  const [currentStep, setCurrentStep] = useState();
  const steps = new Array(config.noteCount).fill(null).map((_, i) => i);
  const [bpm, setBpm] = useState(Tone.Transport.bpm.value);
  const [isChanging, setIsChanging] = useState(false);

  function handleMouseDown(event, octave, row, col) {
    // 要素をドラッグしようとするのを防ぐ
    event.preventDefault();

    console.log(`mouse down on ${row}:${col} of ${octave}`);

    const newNotes = notes.slice()//JSON.parse(JSON.stringify(notes));
    const current = newNotes[octave][row][col];
    newNotes[octave][row][col] = !current;
    setNotes(newNotes);
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
    const newNotes = notes.slice()//JSON.parse(JSON.stringify(notes));
    const current = newNotes[octave][row][col];
    newNotes[octave][row][col] = !current;
    setNotes(newNotes);
  }

  useEffect(() => {
    if(Tone.Transport.state === "stopped"){

    }
  },[Tone.Transport.state])

  function start() {
    const synth = new Tone.PolySynth().toDestination();
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

    notes.forEach((octave, octIndex) => {
      octave.forEach((notes, rowIndex) => {
        if(notes[step]){
          console.log(notes[step])
          console.log(tones[octIndex].tones[step]);
          console.log(`${tones[octIndex].tones[rowIndex].pitchName}${tones[octIndex].octave}`);
          playNotes.push(`${tones[octIndex].tones[rowIndex].pitchName}${tones[octIndex].octave}`);
        }
      })
    })

/*     notes.forEach((octave, index) => octave.forEach(data => {
      console.log(data[step])
      if (data[step]) {
        //console.log(`${tones[index].pitchName}${tones[index].octave}`);
        //playNotes.push(`${tones[index].pitchName}${tones[index].octave}`);
      }
    })); */

    return playNotes;
  }

  function handleChange(event, newValue) {
    setBpm(newValue);
    Tone.Transport.bpm.value = newValue;
  }

  function reset() {
    stop();
    setNotes(
      tones.map(octave => octave.tones.map(tones =>  new Array(config.noteCount).fill(false)))
    );
    setBpm(120);

    Tone.Transport.bpm.value = 120;
  }

  return (
    <div id="piano-roll">
      <div id="controller">
        {
          isPlaying === "stopped"
          ? <button type="button" style={{ margin: "5px" }} onClick={start}>
              start
            </button>
          : <button id="stop" type="button" style={{ margin: "5px" }} onClick={stop}>
              stop
            </button>
        }
        
        
        <button id="reset" type="button" style={{ margin: "5px" }} onClick={reset}>
          reset
        </button>
        <div style={{ width: "200px", margin: "auto" }}>
          <Slider
            value={bpm}
            onChange={handleChange}
            min={40}
            max={200}
            onMouseDown={() => setIsChanging(true)}
            onChangeCommitted={() => setIsChanging(false)}
          />
          {bpm}
        </div>
      </div>
      {
        tones.map((octave, index) => {
          return (
            <div className="octave">
              <div className="keyboard">
                {
                  octave.tones.map((tone, rowIndex) => {
                    let rowClassName = octave.bKeyIndex.indexOf(rowIndex) >= 0 ? "black-key-common" : "white-key";
                    if(index === 0){
                      rowClassName += ' top'
                    }
                    if(octave.tones.length === 1){
                      rowClassName += ' only'
                    }
                    return (
                      <div className={`${rowClassName} ${tone.pitchName}`}></div>
                    )
                  })
                }
              </div>
              <div className="grid">
                {
                  octave.tones.map((tone, rowIndex) => {
                    let rowClassName =　octave.bKeyIndex.indexOf(rowIndex) >= 0 ? "b-key" : "w-key";
                    return (
                      <div className={`row ${rowClassName}`}>
                        {
                          notes[index][rowIndex].map((note, colIndex) => {
                            // 選択されているか
                            //console.log(note)
                            let cellClassName = note ? "active" : "";

                            // シーケンサーがいまのステップか
                            if (currentStep === colIndex) {
                              cellClassName = cellClassName + " now";
                            }
                            return (
                              <div
                                key={`${tone.pitchName}${tone.octave}${colIndex}`}
                                onMouseDown={(event) =>
                                  handleMouseDown(event, index, rowIndex, colIndex)
                                }
                                onMouseEnter={(event) =>
                                  handleMouseEnter(event, index, rowIndex, colIndex)
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


{/*       <div className="top-note">
        <div className="keyboard">
          <div className="white-key top"></div>
        </div>
        <div className="grid">
          <div className="row">
            <div className="w-key"></div>
            <div className="w-key"></div>
            <div className="w-key"></div>
            <div className="w-key"></div>
            <div className="w-key"></div>
            <div className="w-key"></div>
            <div className="w-key"></div>
            <div className="w-key"></div>
          </div>
        </div>
      </div>
      <div className="octave">
        <div className="keyboard">
          <div className="white-key"></div>
          <div className="b-key-common si-flat"></div>
          <div className="white-key"></div>
          <div className="b-key-common la-flat"></div>
          <div className="white-key"></div>
          <div className="b-key-common so-flat"></div>
          <div className="white-key"></div>
          <div className="white-key"></div>
          <div className="b-key-common mi-flat"></div>
          <div className="white-key"></div>
          <div className="b-key-common re-flat"></div>
          <div className="white-key"></div>
        </div>
        <div className="grid">
          {tones.map((tone, rowIndex) => {
            const bKeyIndex = [1, 3, 5, 8, 10];
            let rowClassName =
              bKeyIndex.indexOf(rowIndex) >= 0 ? "b-key" : "w-key";
            return (
              <div
                className={`row ${rowClassName}`}
                key={`${tone.pitchName}${tone.octave}`}
              >
                {notes[rowIndex].map((note, colIndex) => {
                  // 選択されているか
                  let cellClassName = note ? "active" : "";

                  // シーケンサーがいまのステップか
                  if (currentStep === colIndex) {
                    cellClassName = cellClassName + " now";
                  }
                  //console.log("render");
                  return (
                    <div
                      key={`${tone.pitchName}${tone.octave}${colIndex}`}
                      onMouseDown={(event) =>
                        handleMouseDown(event, rowIndex, colIndex)
                      }
                      onMouseEnter={(event) =>
                        handleMouseEnter(event, rowIndex, colIndex)
                      }
                      className={cellClassName}
                    ></div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div> */}
    </div>
  );
}