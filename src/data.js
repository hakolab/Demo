const config = {
  octave: 1,
  noteCount: 8
};

export const toyPiano = [
  {
    mode: "toyPiano",
    octave: 8,
    bKeyIndex: [],
    tones: [
      { pitchName: "C" }
    ]
  },
  {
    octave: 7,
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
    bKeyIndex: [1, 3, 5, 8, 10],
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

export const oneOctave = [
  {
    mode: "oneOctave",
    octave: 5,
    bKeyIndex: [],
    tones: [
      { pitchName: "C" }
    ]
  },
  {
    octave: 4,
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
];

export const keyboard76 = [
  {
    mode: "keyboard76",
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

/* const oneOctave = [
  { pitchName: "B", octave: 4 },
  { pitchName: "Bb", octave: 4 },
  { pitchName: "A", octave: 4 },
  { pitchName: "Ab", octave: 4 },
  { pitchName: "G", octave: 4 },
  { pitchName: "Gb", octave: 4 },
  { pitchName: "F", octave: 4 },
  { pitchName: "E", octave: 4 },
  { pitchName: "Eb", octave: 4 },
  { pitchName: "D", octave: 4 },
  { pitchName: "Db", octave: 4 },
  { pitchName: "C", octave: 4 }
]; */

/* export function getInitialPlayNotes(keyboardType) {
  console.log(keyboardType);
  switch (keyboardType) {
    case "oneOctave":
      return {
        type: "oneOctave",
        notes: oneOctave.map((_) => new Array(config.noteCount).fill(false)),
        tones: oneOctave
      };
    default:
  }
}
 */