import "./styles.css";
import { oneOctave, toyPiano } from "./data";

const fromData = [
  {
    octave: 6,
    tones: [{ pitchName: "E" }, { pitchName: "D" }, { pitchName: "C" }]
  },
  {
    octave: 5,
    tones: [{ pitchName: "E" }, { pitchName: "D" }, { pitchName: "C" }]
  }
];

const toData = [
  {
    octave: 7,
    tones: [{ pitchName: "E" }, { pitchName: "D" }, { pitchName: "C" }]
  },
  {
    octave: 6,
    tones: [{ pitchName: "E" }, { pitchName: "D" }, { pitchName: "C" }]
  },
  {
    octave: 5,
    tones: [{ pitchName: "E" }, { pitchName: "D" }, { pitchName: "C" }]
  },
  {
    octave: 4,
    tones: [{ pitchName: "E" }, { pitchName: "D" }, { pitchName: "C" }]
  }
];

const fromTones = [
  [
    [true, false, false],
    [false, true, false],
    [false, false, true]
  ],
  [
    [false, false, true],
    [false, true, false],
    [true, false, false]
  ]
];

const toTones = [
  [
    [false, false, false],
    [false, false, false],
    [false, false, false]
  ],
  [
    [false, false, false],
    [false, false, false],
    [false, false, false]
  ],
  [
    [false, false, false],
    [false, false, false],
    [false, false, false]
  ],
  [
    [false, false, false],
    [false, false, false],
    [false, false, false]
  ]
];

const a = [1, 2, 3];
const b = [5, 5, 5, 5, 6];
function exec(fromTones, toTones, fromData, toData) {
  const result = copy(fromTones, toTones, fromData, toData);
  //const result = copyArray(a, b);
  console.log(result);
}

/**
 *
 * @param {*} fromTones コピー元音符
 * @param {*} toTones コピー先音符
 * @param {*} fromData コピー元音定義データ
 * @param {*} toData コピー先音定義データ
 */
function copy(fromTones, toTones, fromData, toData) {
  // from の最低音と一致する音を to から探す
  const result = find(fromData, toData);

  // 探索終了（コピー後の配列を返す）
  if (fromData.length === 0) {
    console.log("process end");
    return toTones;
  }

  // 一致した音があるかどうか
  if (result.toOctaveIndex !== -1 && result.toToneIndex !== -1) {
    console.log("copy");

    toTones[result.toOctaveIndex][result.toToneIndex] = copyArray(
      fromTones[result.fromOctaveIndex][result.fromToneIndex],
      toTones[result.toOctaveIndex][result.toToneIndex]
    );
  }

  // fromData の最低音を削除して再帰処理
  fromData[fromData.length - 1].tones.pop();
  console.log("recursive");
  return copy(fromTones, toTones, fromData, toData);
}

function find(fromData, toData) {
  let fromOctaveIndex = -1;
  let fromToneIndex = -1;
  let toOctaveIndex = -1;
  let toToneIndex = -1;

  // fromData 探索終了
  if (fromData.length === 0) {
    return { fromOctaveIndex, fromToneIndex, toOctaveIndex, toToneIndex };
  }

  // from の最低音を取得
  fromOctaveIndex = fromData.length - 1;
  fromToneIndex = fromData[fromOctaveIndex].tones.length - 1;

  if (fromData[fromOctaveIndex].tones.length === 0) {
    console.log("tones 探索終了");
    fromData.pop();
    return find(fromData, toData);
  }

  const lastItemOfFrom = fromData[fromOctaveIndex];
  // オクターブが一致すれば、octaveIndex をメモして、要素を抽出
  const filteredItemOfTo = toData.filter((obj, index) => {
    if (obj.octave === lastItemOfFrom.octave) {
      toOctaveIndex = index;
      return true;
    }
    return false;
  });

  if (filteredItemOfTo.length === 0) {
    console.log("not found");
    return { fromOctaveIndex, fromToneIndex, toOctaveIndex, toToneIndex };
  }

  if (filteredItemOfTo.length > 1) {
    throw new Error("illegal data");
  }

  const lastToneOfFrom = lastItemOfFrom.tones[fromToneIndex];

  // 同じオクターブで抽出した tones に同じ音があれば index をメモ
  filteredItemOfTo[0].tones.forEach((obj, index) => {
    if (obj.pitchName === lastToneOfFrom.pitchName) {
      toToneIndex = index;
    }
  });

  if (toToneIndex === -1) {
    //console.log("no same tone");
  }

  return { fromOctaveIndex, fromToneIndex, toOctaveIndex, toToneIndex };
}

function copyArray(fromTone, toTone, index = 0) {
  console.log(index);
  if (fromTone.length === index || toTone.length === index) {
    return toTone;
  }
  const newToTone = toTone.slice();
  newToTone[index] = fromTone[index];

  return copyArray(fromTone, newToTone, index + 1);
}

function deepCopy(from) {
  const result = {};
  for (let item in from) {
    if (typeof item === "object") {
      result[item] = deepCopy(from[item]);
    } else {
      result[item] = from[item];
    }
  }
  return result;
}

// prettier-ignore
export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Edit to see some magic happen!</h2>
      <button onClick={() => console.log(exec(fromTones ,toTones, fromData, toData))}>calc</button>
      <p></p>
    </div>
  );
}
