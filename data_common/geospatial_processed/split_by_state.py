# $File: split_by_state.py
# $Author: Jerry Zhu
# $Date: <2025-09-19 Fri>
# $Description:
# Split massive GeoJSON file into multiple state json collections
import json;
import os;
import sys;
import itertools;
from typing import Iterable;

GEN_DETAIL_STATES = True;
GEN_GENERAL_STATES = True;

# Index by FIPS-Code. 
counties_by_state: dict[str, list[object]] = {};
detailed_states: dict[str, bool] = {};

# source: https://transition.fcc.gov/oet/info/maps/census/fips/fips.txt
FIPS_TO_STATES_MAP = {
    "01": "Alabama",
    "02": "Alaska",
    "04": "Arizona",
    "05": "Arkansas",
    "06": "California",
    "08": "Colorado",
    "09": "Connecticut",
    "10": "Delaware",
    "11": "District Of Columbia",
    "12": "Florida",
    "13": "Georgia",
    "15": "Hawaii",
    "16": "Idaho",
    "17": "Illinois",
    "18": "Indiana",
    "19": "Iowa",
    "20": "Kansas",
    "21": "Kentucky",
    "22": "Louisiana",
    "23": "Maine",
    "24": "Maryland",
    "25": "Massachusetts",
    "26": "Michigan",
    "27": "Minnesota",
    "28": "Mississippi",
    "29": "Missouri",
    "30": "Montana",
    "31": "Nebraska",
    "32": "Nevada",
    "33": "New Hampshire",
    "34": "New Jersey",
    "35": "New Mexico",
    "36": "New York",
    "37": "North Carolina",
    "38": "North Dakota",
    "39": "Ohio",
    "40": "Oklahoma",
    "41": "Oregon",
    "42": "Pennsylvania",
    "44": "Rhode Island",
    "45": "South Carolina",
    "46": "South Dakota",
    "47": "Tennessee",
    "48": "Texas",
    "49": "Utah",
    "50": "Vermont",
    "51": "Virginia",
    "53": "Washington",
    "54": "West Virginia",
    "55": "Wisconsin",
    "56": "Wyoming",
};

def add_county_to_state(fips_code: str, county_data: object):
    if fips_code not in counties_by_state:
        counties_by_state[fips_code] = [];
    counties_by_state[fips_code].append(county_data);

# NOTE(jerry):
# For some reason, why does no one store bounding box data???
# It's not hard to calculate, but it's pretty useful...
#
# I wish this would be fast, but the truth is this might be slow
# without numpy.
def calc_bbox(xs: Iterable[float], ys: Iterable[float]):
    # This is just cause of how generators work :|
    a,b,c = itertools.tee(xs, 3);
    x_min, x_max = min(a), max(b);
    a,b,c = itertools.tee(ys, 3);
    y_min, y_max = min(a), max(b);
    return x_min, y_min, x_max, y_max;

def collect_all_dimensions_of_feature(feature, idx):
    # NOTE(jerry):
    # Why is it a list of one list with stuff?
    coordinates = feature["geometry"]["coordinates"][0];

    # NOTE(jerry):
    # for whatever reason, there's some weird data irregularity that I can't determine?
    #
    # Regardless, given for detail states there are so many points, it should be totally
    # acceptable to do this, and it won't significantly break the bounding-boxes.
    return (coordinate[idx] if not isinstance(coordinate[idx],list) else coordinate[0][idx] for coordinate in coordinates);
    
def calc_bbox_for_feature_collection(features: list[object]):
    xs = itertools.chain.from_iterable(
        (collect_all_dimensions_of_feature(feature, 0) for feature in features));
    ys = itertools.chain.from_iterable(
        (collect_all_dimensions_of_feature(feature, 1) for feature in features));
    return calc_bbox(xs, ys);

def create_feature_collection_for_county(fips_code: str):
    state_name = FIPS_TO_STATES_MAP[fips_code];
    if fips_code not in counties_by_state:
        print(f'WARN: Missing information for {state_name}');
        return None;
    counties = counties_by_state[fips_code];
    print(f'INFO: Generating collection for: {state_name}');
    (x_min, y_min, x_max, y_max) = calc_bbox_for_feature_collection(counties);
    collection = {
        "type": "FeatureCollection", # we know the id is the fips-code, so
        # we'll just use state name.
        "id": state_name,
        "bbox": [ x_min, y_min, x_max, y_max ],
        "features": counties,
    };
    return collection;

if GEN_DETAIL_STATES:
    # Do detailed states first...
    print("Parsing detailed states.");
    try:
        with open('filtered_county_boundaries.geojson', 'r') as county_boundaries:
            feature_collection = json.load(county_boundaries);
            for feature in feature_collection["features"]:
                feature_fips = feature["properties"]["STATEFP"];
                detailed_states[feature_fips] = True;
                add_county_to_state(feature_fips, feature);
    except FileNotFoundError:
        print("Error, the detailed states geojson master file doesn't exist?");
        sys.exit();
    except json.JSONDecodeError:
        print("Error, the detailed states geojson master file isn't valid json.");
        sys.exit();

# Do every other state second... The detailed states will supersede
# the undetailed general map here.
if GEN_GENERAL_STATES:
    try:
        with open('general_states.geojson', 'r') as state_boundaries:
            feature_collection = json.load(state_boundaries);
            for feature in feature_collection["features"]:
                # this data set uses the fips as the id
                feature_fips = feature["id"];
                if feature_fips not in detailed_states:
                    add_county_to_state(feature_fips, feature);
    except FileNotFoundError:
        print("Error, the general states geojson master file doesn't exist?");
        sys.exit();
    except json.JSONDecodeError:
        print("Error, the general states geojson master file isn't valid json.");
        sys.exit();

# Export state geometry with bounding box.
try:
    os.mkdir('stateByFips');
except FileExistsError:
    pass;
except FileNotFoundError:
    print("Error, could not make subdirectory.");
    sys.exit();

for fips in FIPS_TO_STATES_MAP.keys():
    state_feature_collection = create_feature_collection_for_county(fips);
    if state_feature_collection == None:
        continue;

    try:
        with open(f'stateByFips/{fips}.json', 'w') as output:
            json_result = json.dump(
                state_feature_collection, fp=output);
    except:
        print(f"failed to write {fips}.json");
