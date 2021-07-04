const beatOptions = [
  {
    key: 'two-four',
    value: '2/4',
    numberOfNotesInBar: 4
  },
  {
    key: 'three-four',
    value: '3/4',
    numberOfNotesInBar: 6
  },
  {
    key: 'four-four',
    value: '4/4',
    numberOfNotesInBar: 8
  },
  {
    key: 'six-eight',
    value: '6/8',
    numberOfNotesInBar: 6
  }
];

const oneOctave = {
  mode: "oneOctave",
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

export {
  beatOptions,
  oneOctave,
  toyPiano,
  keyboard76
}