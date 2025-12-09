import geopandas as gpd
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os
import json
from shapely.geometry import mapping

# Loading the .env and its values
load_dotenv()
user = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")
host = os.getenv("DB_HOST")
port = os.getenv("DB_PORT")
database = os.getenv("DB_NAME")

geojson_path = "../geospatial_processed/filtered_county_boundaries.geojson"
county_boundaries_gdf = gpd.read_file(geojson_path)

# Re projecting to a projected CRS (NAD83 / Conus Albers) for accurate centroid
gdf_proj = county_boundaries_gdf.to_crs(epsg=5070)

# Computing centroids in meters then converting back to lat long
centroids = gdf_proj.geometry.centroid.to_crs(epsg=4326)

records = []
for idx, row in county_boundaries_gdf.iterrows():
    state_id = row["STATEFP"]
    county_id = row["COUNTYFP"]

    region_id = (state_id + county_id).ljust(10, "0")

    # Taking the boundary geometry of the current county
    boundary_geojson = json.dumps(mapping(row["geometry"]))

    # Turning the centroid into a Point coordinate
    centroid_geom = centroids.iloc[idx]
    centroid_geojson = json.dumps({
        "type": "Point",
        "coordinates": [centroid_geom.x, centroid_geom.y]
    })

    records.append({
        "region_id": region_id,
        "state_id": int(state_id),
        "geom_boundary": boundary_geojson,
        "geom_center": centroid_geojson
    })

county_geojsons_df = pd.DataFrame(records)

# Connecting to db
engine = create_engine(
    f"postgresql://{user}:{password}@{host}:{port}/{database}"
)

# Inserting into db
county_geojsons_df.to_sql(
    "region_boundary",
    engine,
    schema="app",
    if_exists="append",
    index=False
)

print("Finished inserting detailed states county boundary data into the database")
