function titleCaseString(value: string) {
  if (value === null) {
    return value;
  }
  const lowercased = value.toLowerCase();
  return lowercased.charAt(0).toUpperCase() + lowercased.slice(1);
}

export default titleCaseString;
