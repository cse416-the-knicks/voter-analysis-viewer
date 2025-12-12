function titleCaseWord(word: string) {
  if (word === null) {
    return word;
  }
  const lowercased = word.toLowerCase();
  return lowercased.charAt(0).toUpperCase() + lowercased.slice(1);
}

function titleCaseString(value: string) {
  if (value === null) {
    return value;
  }
  const split = value.split(" ");
  return split.map(titleCaseWord).join(" ");
}

export default titleCaseString;
