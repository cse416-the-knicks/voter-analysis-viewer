Just here so we have a consistent directory to place everything in.

Raw data and preprocessed data can go in this folder, can go with something
like:

raw/
processed/
geospatial-raw/
geospatial-processed/

To reconstruct `US_County_Boundaries.geojson` run the following command when in `geospatial_raw`: `cat US_County_Boundaries_part_* > US_County_Boundaries.geojson`

# run_loaders.py script
To run the all the database population scripts you can just use the run_loaders.py script

First set up the virtual environment as the following after changing directory to `scripts/`
```
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
If on windows run `.venv\Scripts\activate` instead of `source .venv/bin/activate`

Then just run `python run_loaders.py` to load the database
