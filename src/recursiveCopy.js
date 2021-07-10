import "./styles.css";

/**
 *
 * @param {*} fromTones コピー元音符
 * @param {*} toTones コピー先音符
 * @param {*} fromData コピー元音定義データ
 * @param {*} toData コピー先音定義データ
 */
function copy(fromTones, toTones, fromData, toData) {
  let newFromData = clone(fromData);
  // from の最低音と一致する音を to から探す
  const result = find(newFromData, toData);

  // 探索終了（コピー後の配列を返す）
  if (newFromData.length === 0) {
    //console.log("process end");
    return toTones;
  }

  // 一致した音があるかどうか
  if (result.toOctaveIndex !== -1 && result.toToneIndex !== -1) {
    //console.log("copy");

    toTones[result.toOctaveIndex][result.toToneIndex] = copyArray(
      fromTones[result.fromOctaveIndex][result.fromToneIndex],
      toTones[result.toOctaveIndex][result.toToneIndex]
    );
  }

  // fromData の最低音を削除して再帰処理
  newFromData[newFromData.length - 1].tones.pop();
  //console.log("recursive");
  return copy(fromTones, toTones, newFromData, toData);
}

function find(fromData, toData) {
  //console.log('fromData')
  //console.log(fromData)
  let fromOctaveIndex = -1;
  let fromToneIndex = -1;
  let toOctaveIndex = -1;
  let toToneIndex = -1;
  
  // fromData 探索終了
  if (fromData.length === 0) {
    //console.log("fromData.length === 0")
    return { fromOctaveIndex, fromToneIndex, toOctaveIndex, toToneIndex };
  }

  // from の最低音を取得
  //console.log(Array.isArray(fromData))
  fromOctaveIndex = fromData.length - 1;
  fromToneIndex = fromData[fromOctaveIndex].tones.length - 1;

  if (fromData[fromOctaveIndex].tones.length === 0) {
    //console.log("tones 探索終了");
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
    //console.log("not found");
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

  return { fromOctaveIndex, fromToneIndex, toOctaveIndex, toToneIndex };
}

function copyArray(fromTone, toTone, index = 0) {
  //console.log(toTone);
  if (fromTone.length === index || toTone.length === index) {
    return toTone;
  }
  
  const newToTone = toTone.slice();
  if (Array.isArray(fromTone[index])){
    newToTone[index] = copyArray(fromTone[index], newToTone[index]);
  } else {
    newToTone[index] = fromTone[index];
  }
  

  return copyArray(fromTone, newToTone, index + 1);
}

function deepCopy(from) {
  const result = [];
  for (let item in from) {
    if (Array.isArray(from[item])){
      let array = from[item].slice()
      result[item] = array.slice()
    } else if (typeof from[item] === "object") {
      result[item] = deepCopy(from[item]);
    } else {
      //console.log(from[item])
      result[item] = from[item];
    }
  }
  return result;
}

function clone(from) {
  if (Array.isArray(from)) {
    return cloneArray(from);
  }

  if (typeof from === "object") {
    return cloneObject(from);
  }
}

function cloneArray(array) {
  let result = [];
  for (let item in array) {
    if (Array.isArray(array[item])) {
      result[item] = cloneArray(array[item]);
    } else if (typeof array[item] === "object") {
      result[item] = cloneObject(array[item]);
    } else {
      result[item] = array[item];
    }
  }
  return result;
}

function cloneObject(object) {
  let result = {};
  for (let item in object) {
    if (Array.isArray(object[item])) {
      result[item] = cloneArray(object[item]);
    } else if (typeof object[item] === "object") {
      result[item] = cloneObject(object[item]);
    } else {
      result[item] = object[item];
    }
  }
  return result;
}


export {
  copy,
  find,
  copyArray,
  deepCopy,
  clone
}