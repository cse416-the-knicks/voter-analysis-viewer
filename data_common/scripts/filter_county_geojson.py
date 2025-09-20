import geopandas as gpd

TARGET_STATES = ["Georgia", "Michigan", "Texas", "New York", "Oklahoma", "Indiana"]

gdf = gpd.read_file("../geospatial_raw/US_County_Boundaries.geojson")

# Filter by the states we need
filtered = gdf[gdf["STATE_NAME"].isin(TARGET_STATES)].copy()

# Multiply GEOID by 100000 to match FIPS
filtered["GEOID"] = (filtered["GEOID"].astype(int) * 100000).astype(str)

# Saving to new geojson
filtered.to_file("../geospatial_processed/filtered_county_boundaries.geojson", driver="GeoJSON")
