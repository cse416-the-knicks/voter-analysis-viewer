import geopandas as gpd

TARGET_STATES = ["Georgia", "Michigan", "Texas", "New York", "Oklahoma", "Ohio"]

county_boundaries_gdf = gpd.read_file("../geospatial_raw/US_County_Boundaries.geojson")

# Filter by the states we need
target_county_boundaries_gdf = county_boundaries_gdf[county_boundaries_gdf["STATE_NAME"].isin(TARGET_STATES)].copy()

# Multiply GEOID by 100000 to match FIPS
target_county_boundaries_gdf["GEOID"] = (target_county_boundaries_gdf["GEOID"].astype(int) * 100000).astype(str)

# Saving to new geojson
target_county_boundaries_gdf.to_file("../geospatial_processed/filtered_county_boundaries.geojson", driver="GeoJSON")
