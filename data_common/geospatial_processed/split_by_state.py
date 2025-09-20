# $File: split_by_state.py
# $Author: Jerry Zhu
# $Date: <2025-09-19 Fri>
# $Description:
# Split massive GeoJSON file into multiple state json collections
import json;
import os;

# Index by FIPS-Code. 
counties_by_state: dict[str, list[object]] = {};
fips_code_to_state_name: dict[str, str] = {};

def add_county_to_state(fips_code: str, county_data: object):
    if fips_code not in counties_by_state:
        state_name = county_data["properties"]["STATE_NAME"];
        counties_by_state[fips_code] = [];
        fips_code_to_state_name[fips_code] = state_name;
    counties_by_state[fips_code].append(county_data);

def create_feature_collection_for_county(fips_code: str):
    state_name = fips_code_to_state_name[fips_code];
    counties = counties_by_state[fips_code];

    collection = {
        "type": "FeatureCollection",
        # we know the id is the fips-code, so
        # we'll just use state name.
        "id": state_name,
        "features": counties
    }
    return collection;

print(os.getcwd());

try:
    with open('filtered_county_boundaries.geojson', 'r') as county_boundaries:
        feature_collection = json.load(county_boundaries);
        for feature in feature_collection["features"]:
            feature_fips = feature["properties"]["STATEFP"];
            add_county_to_state(feature_fips, feature);

        try:
            os.mkdir('stateByFips');
        except FileExistsError:
            pass;
        except FileNotFoundError:
            print("Error, could not make subdirectory.");
        for fips in fips_code_to_state_name.keys():
            state_feature_collection = create_feature_collection_for_county(fips);
            try:
                with open(f'stateByFips/{fips}.json', 'w') as output:
                    json_result = json.dump(
                        state_feature_collection, fp=output);
            except:
                print(f"failed to write {fips}.json");
except FileNotFoundError:
    print("Error, the geojson master file doesn't exist?");
except json.JSONDecodeError:
    print("Error, the geojson master file isn't valid json.");
