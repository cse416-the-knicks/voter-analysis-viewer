interface GradientMap {
  [key: number]: string
};

const gradientMapPoints = (x: GradientMap) => Object.keys(x).map(Number);
const gradientMapColors = (x: GradientMap) => Object.values(x);

function gradientMapNearest(
  x: number,
  gradientBreakpoints: GradientMap): string {
  let i = 0;
  const breakpoints = gradientMapPoints(gradientBreakpoints);
  const colors = gradientMapColors(gradientBreakpoints);
  let result = colors[i];

  for (i = 0; i < breakpoints.length; ++i) {
    if (x >= breakpoints[i]) {
      result = colors[i];
    }
  }

  return result;
}

export {
    gradientMapNearest,
    gradientMapPoints,
    gradientMapColors,
};

export type {
    GradientMap,
};
