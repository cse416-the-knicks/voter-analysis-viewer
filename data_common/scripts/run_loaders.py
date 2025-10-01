# Master script to run all database population scripts

import subprocess

scripts = [
    "./load_prelim_states_data.py",
    "./load_2024_eavs_data.py"
]

print("Starting database population")
for script in scripts:
    print(f"Running {script}")
    try:
        subprocess.run(["python", script], check=True)
    except subprocess.CalledProcessError as e:
        print("Error:", e)
print("Finished database population")
