function isObject(value) {
  const valueType = typeof value;
  return value !== null && (valueType === "object" || valueType === "function");
}

function deepCopy(originValue, selfMap = new WeakMap()) {
  if (typeof originValue === "symbol") return Symbol(originValue.description);

  if (!isObject(originValue)) return originValue;

  if (originValue instanceof Set) {
    const newSet = new Set();
    for (const setItem of originValue) {
      newSet.add(deepCopy(setItem));
    }
    return newSet;
  }
  if (originValue instanceof Map) {
    const newMap = new Map();
    for (const mapItem of originValue) {
      newMap.set(mapItem[0], mapItem[1]);
    }
    return newMap;
  }

  if (typeof originValue === "function") return originValue;

  if (selfMap.get(originValue)) return selfMap.get(originValue);

  const newObj = Array.isArray(originValue) ? [] : {};
  selfMap.set(originValue, newObj);
  // 遍历普通的key
  for (const key in originValue) {
    newObj[key] = deepCopy(originValue[key], selfMap);
  }
  // 单独遍历symbol的key
  const symbolKeys = Object.getOwnPropertySymbols(originValue);
  for (const symbolKey of symbolKeys) {
    newObj[Symbol(symbolKey.description)] = deepCopy(
      originValue[symbolKey],
      selfMap
    );
  }

  return newObj;
}

export default deepCopy;
