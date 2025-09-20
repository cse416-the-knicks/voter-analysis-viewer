# $File: split_by_state.py
# $Author: Jerry Zhu
# $Date: <2025-09-19 Fri>
# $Description:
# Split massive GeoJSON file into multiple state json collections
import json;
import os;
import itertools;
from typing import Iterable;

# Index by FIPS-Code. 
counties_by_state: dict[str, list[object]] = {};
fips_code_to_state_name: dict[str, str] = {};
detailed_states: dict[str, bool] = {};

def add_county_to_state(fips_code: str, county_data: object):
    if fips_code not in counties_by_state:
        state_name = county_data["properties"]["STATE_NAME"];
        counties_by_state[fips_code] = [];
        fips_code_to_state_name[fips_code] = state_name;
    counties_by_state[fips_code].append(county_data);

# NOTE(jerry):
# For some reason, why does no one store bounding box data???
# It's not hard to calculate, but it's pretty useful...
#
# I wish this would be fast, but the truth is this might be slow
# without numpy.
def calc_bbox(xs: Iterable[float], ys: Iterable[float]):
    x_min, x_max = min(xs), max(xs);
    y_min, y_max = min(ys), max(ys);
    return x_min, y_min, x_max, y_max;

def collect_all_dimensions_of_feature(feature, idx):
    # NOTE(jerry):
    # Why is it a list of one list with stuff?
    coordinates = feature["geometry"]["coordinates"][0];
    return (coordinate[idx] for coordinate in coordinates);
    
def calc_bbox_for_feature_collection(features: list[object]):
    xs = itertools.chain.from_iterable(
        (collect_all_dimensions_of_feature(feature, 0) for feature in features));
    ys = itertools.chain.from_iterable(
        (collect_all_dimensions_of_feature(feature, 1) for feature in features));
    return calc_bbox(xs, ys);

def create_feature_collection_for_county(fips_code: str):
    state_name = fips_code_to_state_name[fips_code];
    counties = counties_by_state[fips_code];
    (x_min, y_min, x_max, y_max) = calc_bbox_for_feature_collection(counties);
    collection = {
        "type": "FeatureCollection", # we know the id is the fips-code, so
        # we'll just use state name.
        "id": state_name,
        "features": counties,
        "bbox": [ [x_min, y_min], [x_max, y_max] ],
    };
    return collection;

try:
    # Do detailed states first...
    with open('filtered_county_boundaries.geojson', 'r') as county_boundaries:
        feature_collection = json.load(county_boundaries);
        for feature in feature_collection["features"]:
            feature_fips = feature["properties"]["STATEFP"];
            detailed_states[feature_fips] = True;
            add_county_to_state(feature_fips, feature);

    # Do every other state second... The detailed states will supersede
    # the undetailed general map here.

    # Export state geometry with bounding box.
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
