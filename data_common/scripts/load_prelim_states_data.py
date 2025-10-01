import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os

# Loading the .env and its values
load_dotenv()
user = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")
host = os.getenv("DB_HOST")
port = os.getenv("DB_PORT")
database = os.getenv("DB_NAME")

FIPS_TO_STATES_MAP = {
    "01": "Alabama",
    "02": "Alaska",
    "04": "Arizona",
    "05": "Arkansas",
    "06": "California",
    "08": "Colorado",
    "09": "Connecticut",
    "10": "Delaware",
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
}

STATE_TO_POSTAL = {
    "Alabama": "AL",
    "Alaska": "AK",
    "Arizona": "AZ",
    "Arkansas": "AR",
    "California": "CA",
    "Colorado": "CO",
    "Connecticut": "CT",
    "Delaware": "DE",
    "Florida": "FL",
    "Georgia": "GA",
    "Hawaii": "HI",
    "Idaho": "ID",
    "Illinois": "IL",
    "Indiana": "IN",
    "Iowa": "IA",
    "Kansas": "KS",
    "Kentucky": "KY",
    "Louisiana": "LA",
    "Maine": "ME",
    "Maryland": "MD",
    "Massachusetts": "MA",
    "Michigan": "MI",
    "Minnesota": "MN",
    "Mississippi": "MS",
    "Missouri": "MO",
    "Montana": "MT",
    "Nebraska": "NE",
    "Nevada": "NV",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New Mexico": "NM",
    "New York": "NY",
    "North Carolina": "NC",
    "North Dakota": "ND",
    "Ohio": "OH",
    "Oklahoma": "OK",
    "Oregon": "OR",
    "Pennsylvania": "PA",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "South Dakota": "SD",
    "Tennessee": "TN",
    "Texas": "TX",
    "Utah": "UT",
    "Vermont": "VT",
    "Virginia": "VA",
    "Washington": "WA",
    "West Virginia": "WV",
    "Wisconsin": "WI",
    "Wyoming": "WY",
}

df = pd.DataFrame([
    {"state_id": fips, "name": name, "code": STATE_TO_POSTAL.get(name, "??")}
    for fips, name in FIPS_TO_STATES_MAP.items()
])

df["map_zoom_level"] = 0
df["registration_method"] = None
df["same_day_registration"] = None
df["felony_disenfranchisement"] = None

# Source: https://www.ncsl.org/elections-and-campaigns/automatic-voter-registration
REG_METHOD = {
    "AL": "opt-out",  # Alabama
    "AK": "opt-in",  # Alaska
    "AZ": "opt-in",  # Arizona
    "AR": "opt-in",  # Arkansas
    "CA": "opt-out",  # California
    "CO": "opt-out",  # Colorado
    "CT": "opt-out",  # Connecticut
    "DE": "opt-out",  # Delaware
    "FL": "opt-in",  # Florida
    "GA": "opt-out",  # Georgia
    "HI": "opt-out",  # Hawaii
    "ID": "opt-in",  # Idaho
    "IL": "opt-out",  # Illinois
    "IN": "opt-in",  # Indiana
    "IA": "opt-in",  # Iowa
    "KS": "opt-in",  # Kansas
    "KY": "opt-in",  # Kentucky
    "LA": "opt-in",  # Louisiana
    "ME": "opt-out",  # Maine
    "MD": "opt-out",  # Maryland
    "MA": "opt-out",  # Massachusetts
    "MI": "opt-out",  # Michigan
    "MN": "opt-out",  # Minnesota
    "MS": "opt-in",  # Mississippi
    "MO": "opt-in",  # Missouri
    "MT": "opt-in",  # Montana
    "NE": "opt-in",  # Nebraska
    "NV": "opt-out",  # Nevada
    "NH": "opt-in",  # New Hampshire
    "NJ": "opt-out",  # New Jersey
    "NM": "opt-out",  # New Mexico
    "NY": "opt-in",  # New York
    "NC": "opt-in",  # North Carolina
    "ND": "opt-in",  # North Dakota
    "OH": "opt-in",  # Ohio
    "OK": "opt-in",  # Oklahoma
    "OR": "opt-out",  # Oregon
    "PA": "opt-out",  # Pennsylvania
    "RI": "opt-out",  # Rhode Island
    "SC": "opt-in",  # South Carolina
    "SD": "opt-in",  # South Dakota
    "TN": "opt-in",  # Tennessee
    "TX": "opt-in",  # Texas
    "UT": "opt-in",  # Utah
    "VT": "opt-out",  # Vermont
    "VA": "opt-out",  # Virginia
    "WA": "opt-out",  # Washington
    "WV": "opt-out",  # West Virginia
    "WI": "opt-in",  # Wisconsin
    "WY": "opt-in",  # Wyoming
}

# Source: https://www.ncsl.org/elections-and-campaigns/same-day-voter-registration?utm_source=chatgpt.com
SAME_DAY = {
    "AL": False,  # Alabama
    "AK": False,  # Alaska
    "AZ": False,  # Arizona
    "AR": False,  # Arkansas
    "CA": True,  # California
    "CO": True,  # Colorado
    "CT": True,  # Connecticut
    "DE": False,  # Delaware
    "FL": False,  # Florida
    "GA": False,  # Georgia
    "HI": True,  # Hawaii
    "ID": True,  # Idaho
    "IL": True,  # Illinois
    "IN": False,  # Indiana
    "IA": True,  # Iowa
    "KS": False,  # Kansas
    "KY": False,  # Kentucky
    "LA": False,  # Louisiana
    "ME": True,  # Maine
    "MD": True,  # Maryland
    "MA": False,  # Massachusetts
    "MI": True,  # Michigan
    "MN": True,  # Minnesota
    "MS": False,  # Mississippi
    "MO": False,  # Missouri
    "MT": True,  # Montana
    "NE": False,  # Nebraska
    "NV": True,  # Nevada
    "NH": True,  # New Hampshire
    "NJ": False,  # New Jersey
    "NM": True,  # New Mexico
    "NY": False,  # New York
    "NC": True,  # North Carolina
    "ND": False,  # North Dakota
    "OH": False,  # Ohio
    "OK": False,  # Oklahoma
    "OR": False,  # Oregon
    "PA": False,  # Pennsylvania
    "RI": False,  # Rhode Island
    "SC": False,  # South Carolina
    "SD": False,  # South Dakota
    "TN": False,  # Tennessee
    "TX": False,  # Texas
    "UT": True,  # Utah
    "VT": True,  # Vermont
    "VA": True,  # Virginia
    "WA": True,  # Washington
    "WV": False,  # West Virginia
    "WI": True,  # Wisconsin
    "WY": True,  # Wyoming
}

# Source: https://www.ncsl.org/elections-and-campaigns/felon-voting-rights
FEL = {
    "AL": 4,  # Alabama
    "AK": 3,  # Alaska
    "AZ": 4,  # Arizona
    "AR": 3,  # Arkansas
    "CA": 2,  # California
    "CO": 2,  # Colorado
    "CT": 2,  # Connecticut
    "DE": 4,  # Delaware
    "FL": 4,  # Florida
    "GA": 3,  # Georgia
    "HI": 2,  # Hawaii
    "ID": 3,  # Idaho
    "IL": 2,  # Illinois
    "IN": 2,  # Indiana
    "IA": 4,  # Iowa
    "KS": 3,  # Kansas
    "KY": 4,  # Kentucky
    "LA": 3,  # Louisiana
    "ME": 1,  # Maine
    "MD": 2,  # Maryland
    "MA": 2,  # Massachusetts
    "MI": 2,  # Michigan
    "MN": 2,  # Minnesota
    "MS": 4,  # Mississippi
    "MO": 3,  # Missouri
    "MT": 2,  # Montana
    "NE": 3,  # Nebraska
    "NV": 4,  # Nevada
    "NH": 2,  # New Hampshire
    "NJ": 2,  # New Jersey
    "NM": 2,  # New Mexico
    "NY": 2,  # New York
    "NC": 3,  # North Carolina
    "ND": 2,  # North Dakota
    "OH": 2,  # Ohio
    "OK": 3,  # Oklahoma
    "OR": 2,  # Oregon
    "PA": 2,  # Pennsylvania
    "RI": 2,  # Rhode Island
    "SC": 3,  # South Carolina
    "SD": 3,  # South Dakota
    "TN": 4,  # Tennessee
    "TX": 3,  # Texas
    "UT": 2,  # Utah
    "VT": 1,  # Vermont
    "VA": 4,  # Virginia
    "WA": 2,  # Washington
    "WV": 3,  # West Virginia
    "WI": 3,  # Wisconsin
    "WY": 4,  # Wyoming
}

df["registration_method"] = df["code"].map(REG_METHOD)
df["same_day_registration"] = df["code"].map(SAME_DAY)
df["felony_disenfranchisement"] = df["code"].map(FEL)

# Connecting to db
engine = create_engine(
    f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}"
)

# Inserting into db
df.to_sql(
    "states",
    engine,
    schema="app",
    if_exists="append",
    index=False
)
