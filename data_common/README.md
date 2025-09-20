Just here so we have a consistent directory to place everything in.

Raw data and preprocessed data can go in this folder, can go with something
like:

raw/
processed/
geospatial-raw/
geospatial-processed/

To reconstruct `US_County_Boundaries.geojson` run the following command when in `geospatial_raw`: `cat US_County_Boundaries_part_* > US_County_Boundaries.geojson`
