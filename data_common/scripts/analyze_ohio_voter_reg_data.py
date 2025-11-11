import pandas as pd

files = [
    "../raw/ohio_voter_files/SWVF_1_22.csv",
    "../raw/ohio_voter_files/SWVF_23_44.csv",
    "../raw/ohio_voter_files/SWVF_45_66.csv",
    "../raw/ohio_voter_files/SWVF_67_88.csv",
]

cols = ["VOTER_STATUS", "PARTY_AFFILIATION"]

total_voters = 0
republican_voters = 0
democratic_voters = 0
unaffiliated_voters = 0

for file in files:
    print(f"Processing {file}")
    df = pd.read_csv(file, usecols=cols, encoding="cp1252", dtype=str)

    # Normalize PARTY_AFFILIATION to uppercase and replace NaN with empty string
    df["PARTY_AFFILIATION"] = df["PARTY_AFFILIATION"].fillna("").str.upper().str.strip()

    total_voters += len(df)

    republican_voters += (df["PARTY_AFFILIATION"].str.upper() == "R").sum()
    democratic_voters += (df["PARTY_AFFILIATION"].str.upper() == "D").sum()

affiliated_voters = republican_voters + democratic_voters
unaffiliated_voters = total_voters - affiliated_voters

print("\n============== Ohio Voter Registration Summary ==============")
print(f"Total registered voters:                {total_voters:,d}")
print(f"Voters with designated political party: {affiliated_voters:,d}")
print(f"Republican voters (R):                  {republican_voters:,d}")
print(f"Democratic voters (D):                  {democratic_voters:,d}")
print(f"Unaffiliated / Other voters:            {unaffiliated_voters:,d}")
print("=============================================================")
