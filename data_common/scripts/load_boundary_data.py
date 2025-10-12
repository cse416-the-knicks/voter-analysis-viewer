import geopandas as gpd
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os
import json
from shapely.geometry import mapping
from fips_utils import FIPS_TO_STATES_MAP

# Loading the .env and its values
load_dotenv()
user = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")
host = os.getenv("DB_HOST")
port = os.getenv("DB_PORT")
database = os.getenv("DB_NAME")

geojson_path = "../geospatial_processed/general_states.geojson"
gdf = gpd.read_file(geojson_path)

# Re projecting to a projected CRS (NAD83 / Conus Albers) for accurate centroid
gdf_proj = gdf.to_crs(epsg=5070)

# Computing centroids in meters then converting back to lat long
centroids = gdf_proj.geometry.centroid.to_crs(epsg=4326)

records = []
for idx, row in gdf.iterrows():
    fips = row["id"]

    # Skipping DC
    if fips == "11":
        continue

    region_id = fips.ljust(10, "0")
    state_name = FIPS_TO_STATES_MAP.get(fips, "Unknown")

    # Turning the centroid into a Point coordinate
    centroid_geom = centroids.iloc[idx]
    centroid_geojson = json.dumps({
        "type": "Point",
        "coordinates": [centroid_geom.x, centroid_geom.y]
    })

    # Taking the geometry of the current state
    boundary_geojson = json.dumps(mapping(row["geometry"]))

    records.append({
        "region_id": region_id,
        "state_id": int(fips),
        "name": state_name,
        "geom_boundary": boundary_geojson,
        "geom_center": centroid_geojson
    })

df = pd.DataFrame(records)

print(df)

# Connecting to db
engine = create_engine(
    f"postgresql://{user}:{password}@{host}:{port}/{database}"
)

# Inserting into db
df.to_sql(
    "region_boundary",
    engine,
    schema="app",
    if_exists="append",
    index=False
)

print("Finished inserting boundary data into the database")
