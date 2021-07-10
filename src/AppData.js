import { clone } from './recursiveCopy'

const twoFour = {
  mode: 'two-four',
  viewName: '2/4',
  numberOfNotesInBar: 4
}

const threeFour = {
  mode: 'three-four',
  viewName: '3/4',
  numberOfNotesInBar: 6
}

const fourFour = {
  mode: 'four-four',
  viewName: '4/4',
  numberOfNotesInBar: 8
}

const sixEight = {
  mode: 'six-eight',
  viewName: '6/8',
  numberOfNotesInBar: 6
}

const oneOctave = {
  mode: "oneOctave",
  viewName: "one octave",
  data: [
    {
      octave: 5,
      bKeyIndex: [],
      tones: [
        { pitchName: "C" }
      ]
    },
    {
      octave: 4,
      bKeyIndex: [1, 3, 5, 8, 10],
      tones: [
        { pitchName: "B" },
        { pitchName: "Bb" },
        { pitchName: "A" },
        { pitchName: "Ab" },
        { pitchName: "G" },
        { pitchName: "Gb" },
        { pitchName: "F" },
        { pitchName: "E" },
        { pitchName: "Eb" },
        { pitchName: "D" },
        { pitchName: "Db" },
        { pitchName: "C" }
      ]
    }
  ]
}

const toyPiano = {
  mode: "toyPiano",
  viewName: "toy piano",
  data: [
  {
    octave: 8,
    bKeyIndex: [],
    tones: [
      { pitchName: "C" }
    ]
  },
  {
    octave: 7,
    bKeyIndex: [1, 3, 5, 8, 10],
    tones: [
      { pitchName: "B" },
      { pitchName: "Bb" },
      { pitchName: "A" },
      { pitchName: "Ab" },
      { pitchName: "G" },
      { pitchName: "Gb" },
      { pitchName: "F" },
      { pitchName: "E" },
      { pitchName: "Eb" },
      { pitchName: "D" },
      { pitchName: "Db" },
      { pitchName: "C" }
    ]
  },
  {
    octave: 6,
    bKeyIndex: [1, 3, 5, 8, 10],
    tones: [
      { pitchName: "B" },
      { pitchName: "Bb" },
      { pitchName: "A" },
      { pitchName: "Ab" },
      { pitchName: "G" },
      { pitchName: "Gb" },
      { pitchName: "F" },
      { pitchName: "E" },
      { pitchName: "Eb" },
      { pitchName: "D" },
      { pitchName: "Db" },
      { pitchName: "C" }
    ]
  },
  {
    octave: 5,
    bKeyIndex: [1, 3, 5],
    tones: [
      { pitchName: "B" },
      { pitchName: "Bb" },
      { pitchName: "A" },
      { pitchName: "Ab" },
      { pitchName: "G" },
      { pitchName: "Gb" },
      { pitchName: "F" }
    ]
  },
]
}

const keyboard76 = {
  mode: "keyboard76",
  viewName: "keyboard 76",
  data: [
    {
      octave: 7,
      bKeyIndex: [1, 4, 6],
      tones: [
        { pitchName: "G" },
        { pitchName: "Gb" },
        { pitchName: "F" },
        { pitchName: "E" },
        { pitchName: "Eb" },
        { pitchName: "D" },
        { pitchName: "Db" },
        { pitchName: "C" }
      ]
    },
    {
      octave: 6,
      bKeyIndex: [1, 3, 5, 8, 10],
      tones: [
        { pitchName: "B" },
        { pitchName: "Bb" },
        { pitchName: "A" },
        { pitchName: "Ab" },
        { pitchName: "G" },
        { pitchName: "Gb" },
        { pitchName: "F" },
        { pitchName: "E" },
        { pitchName: "Eb" },
        { pitchName: "D" },
        { pitchName: "Db" },
        { pitchName: "C" }
      ]
    },
    {
      octave: 5,
      bKeyIndex: [1, 3, 5, 8, 10],
      tones: [
        { pitchName: "B" },
        { pitchName: "Bb" },
        { pitchName: "A" },
        { pitchName: "Ab" },
        { pitchName: "G" },
        { pitchName: "Gb" },
        { pitchName: "F" },
        { pitchName: "E" },
        { pitchName: "Eb" },
        { pitchName: "D" },
        { pitchName: "Db" },
        { pitchName: "C" }
      ]
    },
    {
      octave: 4,
      bKeyIndex: [1, 3, 5, 8, 10],
      tones: [
        { pitchName: "B" },
        { pitchName: "Bb" },
        { pitchName: "A" },
        { pitchName: "Ab" },
        { pitchName: "G" },
        { pitchName: "Gb" },
        { pitchName: "F" },
        { pitchName: "E" },
        { pitchName: "Eb" },
        { pitchName: "D" },
        { pitchName: "Db" },
        { pitchName: "C" }
      ]
    },
    {
      octave: 3,
      bKeyIndex: [1, 3, 5, 8, 10],
      tones: [
        { pitchName: "B" },
        { pitchName: "Bb" },
        { pitchName: "A" },
        { pitchName: "Ab" },
        { pitchName: "G" },
        { pitchName: "Gb" },
        { pitchName: "F" },
        { pitchName: "E" },
        { pitchName: "Eb" },
        { pitchName: "D" },
        { pitchName: "Db" },
        { pitchName: "C" }
      ]
    },
    {
      octave: 2,
      bKeyIndex: [1, 3, 5, 8, 10],
      tones: [
        { pitchName: "B" },
        { pitchName: "Bb" },
        { pitchName: "A" },
        { pitchName: "Ab" },
        { pitchName: "G" },
        { pitchName: "Gb" },
        { pitchName: "F" },
        { pitchName: "E" },
        { pitchName: "Eb" },
        { pitchName: "D" },
        { pitchName: "Db" },
        { pitchName: "C" }
      ]
    },
    {
      octave: 1,
      bKeyIndex: [1, 3, 5],
      tones: [
        { pitchName: "B" },
        { pitchName: "Bb" },
        { pitchName: "A" },
        { pitchName: "Ab" },
        { pitchName: "G" },
        { pitchName: "Gb" },
        { pitchName: "F" },
        { pitchName: "E" }
      ]
    },
  ]
}

function getKeyboardsName(){
  return [
    { mode: oneOctave.mode, viewName: oneOctave.viewName },
    { mode: toyPiano.mode, viewName: toyPiano.viewName },
    { mode: keyboard76.mode, viewName: keyboard76.viewName }
  ]
}

function getBeatsName(){
  return [
    { mode: twoFour.mode, viewName: twoFour.viewName },
    { mode: threeFour.mode, viewName: threeFour.viewName },
    { mode: fourFour.mode, viewName: fourFour.viewName },
    { mode: sixEight.mode, viewName: sixEight.viewName }
  ]
}

function getNumberOfNotesInBar(mode){
  for(let beat of beatOptions){
    if(beat.mode === mode){
      return beat.numberOfNotesInBar
    }
  }
  return -1
}

function getBeat(mode){
  switch(mode){
    case "two-four":
      return clone(twoFour)
    case "three-four":
      return clone(threeFour)
    case "four-four":
      return clone(fourFour)
    case "six-eight":
      return clone(sixEight)
    default:
  }
}

function getKeyboard(mode){
  switch(mode){
    case "oneOctave":
      return clone(oneOctave)
    case "toyPiano":
      return clone(toyPiano)
    case "keyboard76":
      return clone(keyboard76)
    default:
  }
}

export {
  twoFour,
  threeFour,
  fourFour,
  sixEight,
  oneOctave,
  toyPiano,
  keyboard76,
  getBeat,
  getKeyboard,
  getKeyboardsName,
  getBeatsName,
  getNumberOfNotesInBar
}