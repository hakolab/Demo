import React, { useState, useEffect } from "react";
import * as Tone from "tone";
import { Slider } from "@material-ui/core";
import { getInitialPlayNotes } from "./data";
import './styles.css'
import './styles.scss'

const config = {
  octave: 1,
  noteCount: 8
};

const initialNoteData = getInitialPlayNotes("oneOctave");

function getNotes(noteCount) {
  let notes = [];
  let i = 0;
  while (i < noteCount) {
    notes.push(false);
    i++;
  }
  return notes.slice();
}

const steps = new Array(config.noteCount).fill(null).map((_, i) => i);

/*
コントローラーを作成

・Resetボタン
・play, stop を交互に表示

動的に鍵盤を表示
・てっぺんのド
・鍵盤数を選べるように
  ８８鍵
  キーボード（49~61）
  トイピアノ

全体のレイアウト

*/

const sequencer = new Tone.Sequence();

export default function Pianoroll() {
  const [tones, setTones] = useState(initialNoteData.tones);
  const [notes, setNotes] = useState(
    initialNoteData.tones.map((_) => new Array(config.noteCount).fill(false))
  );
  const [isPlaying, setIsPlaying] = useState(Tone.Transport.state);
  //console.log(`state is ${isPlaying}`);
  const [currentStep, setCurrentStep] = useState();
  const steps = new Array(config.noteCount).fill(null).map((_, i) => i);
  const [bpm, setBpm] = useState(Tone.Transport.bpm.value);
  const [isChanging, setIsChanging] = useState(false);

  function handleMouseDown(event, row, col) {
    // 要素をドラッグしようとするのを防ぐ
    event.preventDefault();

    //console.log(`mouse down on ${row}:${col}`);

    const newNotes = notes.slice();
    const current = newNotes[row][col];
    newNotes[row][col] = !current;
    setNotes(newNotes);
  }

  function handleMouseEnter(event, row, col) {
    //console.log(`mouse enter on ${row}:${col}`);
    // 左クリックされていなければ return
    if (event.buttons !== 1) {
      return;
    }
    // テンポ変更中のときは return
    if (isChanging) {
      return;
    }

    event.preventDefault();
    const newNotes = notes.slice();
    const current = newNotes[row][col];
    newNotes[row][col] = !current;
    setNotes(newNotes);
  }

  //console.log("test");
  /* sequencer.callback = (time, step) => {
    const synth = new Tone.PolySynth().toDestination();
    const playNotes = getPlayNotes(step);
    //console.log(step);
    synth.triggerAttackRelease(playNotes, "8t", time);
    setCurrentStep(step);
  };
  sequencer.events = steps;
  sequencer.start(0);

  function start() {
    Tone.start()
    Tone.Transport.start();
    setIsPlaying(Tone.Transport.state);
  } */

  useEffect(() => {
    console.log(Tone.Transport.state)
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
      seq.dispose();
      document.getElementById("stop").removeEventListener("click", dispose);
      document.getElementById("reset").removeEventListener("click", dispose);
    }

    document.getElementById("stop").addEventListener("click", dispose);
    document.getElementById("reset").addEventListener("click", dispose);
  }

  function stop() {
    Tone.Transport.stop();
    setCurrentStep(null);
  }

  function getPlayNotes(step) {
    let playNotes = [];

    notes.forEach((data, index) => {
      if (data[step]) {
        //console.log(`${tones[index].pitchName}${tones[index].octave}`);
        playNotes.push(`${tones[index].pitchName}${tones[index].octave}`);
      }
    });
    return playNotes;
  }

  function handleChange(event, newValue) {
    setBpm(newValue);
    Tone.Transport.bpm.value = newValue;
  }

  function reset() {
    stop();
    setNotes(
      initialNoteData.tones.map((_) => new Array(config.noteCount).fill(false))
    );
    setBpm(120);

    Tone.Transport.bpm.value = 120;
  }

  function show() {
    console.log(Tone.getContext());
  }

  return (
    <div id="piano-roll">
      <div id="controller">
        <button type="button" style={{ margin: "5px" }} onClick={start}>
          start
        </button>
        <button id="stop" type="button" style={{ margin: "5px" }} onClick={stop}>
          stop
        </button>
        <button id="reset" type="button" style={{ margin: "5px" }} onClick={reset}>
          reset
        </button>
        <button type="button" style={{ margin: "5px" }} onClick={show}>
          show
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
      </div>
    </div>
  );
}

/**
const data = [
  { pitchName: "B", octave: 4, notes: getNotes(config.noteCount) },
  { pitchName: "Bb", octave: 4, notes: getNotes(config.noteCount) },
  { pitchName: "A", octave: 4, notes: getNotes(config.noteCount) },
  { pitchName: "Ab", octave: 4, notes: getNotes(config.noteCount) },
  { pitchName: "G", octave: 4, notes: getNotes(config.noteCount) },
  { pitchName: "Gb", octave: 4, notes: getNotes(config.noteCount) },
  { pitchName: "F", octave: 4, notes: getNotes(config.noteCount) },
  { pitchName: "E", octave: 4, notes: getNotes(config.noteCount) },
  { pitchName: "Eb", octave: 4, notes: getNotes(config.noteCount) },
  { pitchName: "D", octave: 4, notes: getNotes(config.noteCount) },
  { pitchName: "Db", octave: 4, notes: getNotes(config.noteCount) },
  { pitchName: "C", octave: 4, notes: getNotes(config.noteCount) }
];
 */

/* 
  useEffect(() => {
    const synth = new Tone.PolySynth().toDestination();
    const seq = new Tone.Sequence((time, step) => {
      const playNotes = getPlayNotes(step);
      console.log(playNotes);
      synth.triggerAttackRelease(playNotes, "8t", time);
      setCurrentStep(step);
    }, steps).start(0);

   document.getElementById("stop").addEventListener("click", seqClear);

    function seqClear() {
      seq.stop();
      seq.clear();
      seq.dispose();
    } 
  }, []); */
