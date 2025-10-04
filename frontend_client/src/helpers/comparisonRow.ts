interface StateSummaryComparisonRow {
  id: string,
  metricName: string,
  [key: string]: any,
};

/**
 * NOTE(jerry):
 * not super hard to understand, but also not something that I think is worth
 * explaining.
 * 
 * This helper function exists to make life easier for these weird vertical transposed
 * tables that MaterialUI DataGrid seems to love making difficult to make.
*/
function comparisonRow(name: string, ...values: any[]): StateSummaryComparisonRow {
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result: StateSummaryComparisonRow = { id: name, metricName: name };
  for (let i = 0; i < alphabet.length; ++i) {
    result[alphabet[i]] = values[i];
  }
  return result;
}

export type {
  StateSummaryComparisonRow
};

export {
  comparisonRow
};