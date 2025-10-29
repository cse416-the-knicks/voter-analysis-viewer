// $File: prettier.config.js
// $Author: Jerry Zhu (jerry.zhu@stonybrook.edu)
// $Date: 10-28-2025 21:54:22
// $Updated: 10-28-2025 21:54:22
// $Description: Coding style configuration file for the Prettier codeformatter.

const config = {
  // Prefer trailing commas,
  // they make diffs less frequent on
  // lists or collection types.
  //
  // However do not use trailing commas *everywhere*
  // (the default for prettier is 'all'? which is stupid.)
  trailingComma: "es5",
  bracketSpacing: true,
  objectWrap: "preserve",
  bracketSameLine: false,
  arrowParens: "always",
  endOfLine: "lf",
  // This is a common spacing
  // convention.
  tabWidth: 2,
  // Automatic semi-colon insertion
  // is a terrible mistake.
  semi: true,
  singleQuote: false,
  // NOTE(jerry):
  // This is *my* personal preference,
  // and I dislike using TABS, and we have
  // the disk-space to support this.
  useTabs: false,
  // 160 columns, this is not 1971.
  printWidth: 160,
};

export default config;
