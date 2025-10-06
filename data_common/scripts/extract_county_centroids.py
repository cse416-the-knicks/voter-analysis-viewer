import geopandas as gpd

geojson_path = "../geospatial_processed/filtered_county_boundaries.geojson"
gdf = gpd.read_file(geojson_path)

# Re projecting to a projected CRS (NAD83 / Conus Albers) for accurate centroid
gdf_proj = gdf.to_crs(epsg=5070)

# Computing centroids in meters then converting back to lat long
centroids = gdf_proj.geometry.centroid.to_crs(epsg=4326)

# Adding center coordinates
gdf["CenterX"] = centroids.x
gdf["CenterY"] = centroids.y

# Copying required columns
df = gdf[["STATEFP", "COUNTYFP", "CenterX", "CenterY"]].copy()
df.rename(columns={ "STATEFP": "STATE_FIPS", "COUNTYFP": "COUNTY_FIPS" }, inplace=True)

# Saving to CSV
output_csv = "../processed/county_centroids.csv"
df.to_csv(output_csv, index=False)
