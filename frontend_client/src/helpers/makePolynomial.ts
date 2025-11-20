type PolynomialFunction = (x: number) => number;

/*
    Returns a valid polynomial javascript function given
    a list of coefficients, this is generic so it's not optimized
    as a special case, but it's easy to use.

    Coefficients are ordered from greatest to least,
    IE:

    coefficients = [1, 2, 3, 4]
    corresponds to a cubic function where:
    a = 1
    b = 2
    c = 3
    d = 4

    ax^3 + bx^2 + cx + d
*/
function makePolynomial(coefficients: number[]): PolynomialFunction {
  function f(x: number) {
    const maxDegree = (coefficients.length-1);
    let result = 0;
    for (let degree = maxDegree; degree >= 0; --degree) {
      result += coefficients[degree] * Math.pow(x, degree);
    }
    return result;
  }
  return f;
}

export default makePolynomial;
export type {
  PolynomialFunction
};
