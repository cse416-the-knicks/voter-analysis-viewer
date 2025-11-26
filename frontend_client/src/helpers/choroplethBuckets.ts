import { type GradientMap } from "./GradientMap";
import choroplethColorBuckets from "./choroplethColorBuckets";

const VOTING_EQUIPMENT_AGE_CHOROPLETH_BUCKETS: GradientMap = {
  0: choroplethColorBuckets[0],
  1: choroplethColorBuckets[1],
  2: choroplethColorBuckets[2],
  3: choroplethColorBuckets[3],
  4: choroplethColorBuckets[4],
  5: choroplethColorBuckets[5],
  6: choroplethColorBuckets[6],
  7: choroplethColorBuckets[7],
  8: choroplethColorBuckets[8],
  9: choroplethColorBuckets[9],
  10: choroplethColorBuckets[10],
};

const PERCENTAGE_CHOROPLETH_BUCKETS: GradientMap = {
  0: choroplethColorBuckets[0],
  10: choroplethColorBuckets[1],
  20: choroplethColorBuckets[2],
  30: choroplethColorBuckets[3],
  40: choroplethColorBuckets[4],
  50: choroplethColorBuckets[5],
  60: choroplethColorBuckets[6],
  70: choroplethColorBuckets[7],
  80: choroplethColorBuckets[8],
  90: choroplethColorBuckets[9],
  100: choroplethColorBuckets[10],
};

export {
    VOTING_EQUIPMENT_AGE_CHOROPLETH_BUCKETS,
    PERCENTAGE_CHOROPLETH_BUCKETS,
};
