function digitsInNumber(x: number): number {
  let digits = 0;
  if (x == 0) {
    return 1;
  } else if (x < 0) {
    x *= -1;
  }
  while (Math.round(x) > 0) {
    x /= 10;
    digits++;
  }
  return digits;
}

export default digitsInNumber;