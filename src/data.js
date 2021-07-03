const config = {
  octave: 1,
  noteCount: 8
};

const oneOctave = [
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
];

export function getInitialPlayNotes(keyboardType) {
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
