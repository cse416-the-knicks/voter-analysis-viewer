function zip<K,V>(keys: K[], values: V[]) {
    return Object.fromEntries(keys.map((key, index) => [key, values[index]]));
}

export default zip;