# $File: generate_mock.py
# $Date: 10/09/2025
# $Author: Jerry Zhu
# $Description: A script that uses OpenAI to
# generate and upload mock-data directly to the
# DB.
#
# Takes two arguments, a schema layout file, and
# an N count.
#
# The schema layout file should come from the 'sql' folder.
#
# EX Usage:
# python generate_mock.py  sql/schema/001_create_states.sql 1000 *context*

import sys;
import pandas as pd;
import io;
import os;
from dotenv import load_dotenv
from openai import OpenAI, AsyncOpenAI;
from sqlalchemy import create_engine

load_dotenv()
user = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")
host = os.getenv("DB_HOST")
port = os.getenv("DB_PORT")
database = os.getenv("DB_NAME")
API_KEY = os.getenv("OPENAI_API_KEY");

def read_entire_file(filename):
    with open(filename, "rb") as f:
        return f.read().decode();

if len(sys.argv) < 3:
    print("Please provide create-schema-file N context");
    exit();

filename = sys.argv[1];
N = int(sys.argv[2]);
if (len(sys.argv) == 4):
    context = sys.argv[3];
else:
    context = "No additional context.";


PROMPT=f"""
Given that your input is an SQL schema script, read this schema and generate text in the format of a CSV file, matching the format in the input. The first row of input must be the labels of the columns.

CREATE TABLE app.states (
    state_id SERIAL PRIMARY KEY,                 -- Unique state key
    name VARCHAR(50) NOT NULL,                   -- Full state name
    code CHAR(2) NOT NULL UNIQUE,                -- USPS code (NY, RI, CA, etc.)

    -- Replace with placeholders or JSON if PostGIS unavailable.
    geom_boundary TEXT,                          -- Store WKT or GeoJSON string if no PostGIS
    geom_center   TEXT,                          -- Same as above

    map_zoom_level INT NOT NULL,                 -- Zoom level for maps

    -- Registration policies
    registration_method VARCHAR(7) NOT NULL CHECK (
        registration_method IN ('opt-in','opt-out')
    ),
    same_day_registration BOOLEAN NOT NULL,
    felony_disenfranchisement SMALLINT NOT NULL CHECK (
        felony_disenfranchisement BETWEEN 1 AND 4
    ),

    -- Population + political stats
    population_total INT,
    citizens_of_voting_age_population INT,
    house_seats_rep INT,
    house_seats_dem INT,
    redistricting_control VARCHAR(20),
    dominant_party CHAR(1) CHECK (dominant_party IN ('R','D'))
);

For example if this is what you're reading, then do:

state_id,name,code,geom_boundary,geom_center,...
123,"State Name",492

and so on.

Try VERY hard to respect the type definitions of any of the SQL objects.

If there is 'state_id', the field is that of a StateFIPSCode, and if there is a 'region_id', then
it is a FIPSCode for a county.

If we have 'state_id', try to generate for as many states as you possibly can, and try to keep the amount
of county distributions diverse.

If there is a 'region_id', please use REAL Fips codes for the regions/counties of a state. Please be consistent!

For instance if we picked New York, then please only use fips code for valid counties / regions of New York like
Suffolk or Queens (the fips codes obviously. Feel free to look them up if it helps.)

Essentially, try to be as realistic as possible and avoid placeholdery seeming things.

Again, your input is the actual schema we want (the thing you are receiving as text input)

Please output CSV as "plaintext", without any markdown such as ```csv ```, just plain text in the CSV format.

I want about {N} rows to be generated (not including the column header row.)

Try to be diverse in states / counties (although give a reasonable distribution for each state you generate.)
""";
PROMPT2="""
Given that your input is an SQL schema script, please tell me what table this is in. Say nothing else except for the table, without quotes.

CREATE TABLE app.states (
    state_id SERIAL PRIMARY KEY,                 -- Unique state key
        name VARCHAR(50) NOT NULL,                   -- Full state name
            code CHAR(2) NOT NULL UNIQUE,                -- USPS code (NY, RI, CA, etc.)

    -- Replace with placeholders or JSON if PostGIS unavailable.
        geom_boundary TEXT,                          -- Store WKT or GeoJSON string if no PostGIS
            geom_center   TEXT,                          -- Same as above

    map_zoom_level INT NOT NULL,                 -- Zoom level for maps

    -- Registration policies
        registration_method VARCHAR(7) NOT NULL CHECK (
                    registration_method IN ('opt-in','opt-out')
                ),
            same_day_registration BOOLEAN NOT NULL,
                felony_disenfranchisement SMALLINT NOT NULL CHECK (
                            felony_disenfranchisement BETWEEN 1 AND 4
                        ),

    -- Population + political stats
        population_total INT,
            citizens_of_voting_age_population INT,
                house_seats_rep INT,
                    house_seats_dem INT,
                        redistricting_control VARCHAR(20),
                            dominant_party CHAR(1) CHECK (dominant_party IN ('R','D'))
                            );

For example if this is what you're reading, then just return:

states

That is, return 'states' without the 'app', we assume that all tables are in the 'app' schema.

Again, your input is the actual schema we want.
""";

client = OpenAI(api_key=API_KEY);
response = client.responses.create(
    model = "gpt-4o",
    instructions = PROMPT,
    input = read_entire_file(filename) + "\nAdditional Context: " + context,
    temperature = 1.00,
)

print(response.output_text);
model_output = io.StringIO(response.output_text);

response = client.responses.create(
    model = "gpt-4o",
    instructions = PROMPT2,
    input = read_entire_file(filename) + "\nAdditional Context: " + context,
    temperature = 1.00,
)
appropriate_collection_name = response.output_text;

df = pd.read_csv(model_output);
engine = create_engine(
    f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}",
    echo=True
)

df.to_sql(
    appropriate_collection_name,
    engine,
    schema="app",
    if_exists="append",
    index=False
)

print("Finished generating mock-data based on specified schema.");
