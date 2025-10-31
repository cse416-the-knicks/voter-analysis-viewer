#!env bash

# combine all parts together, then unzip if they do not already exist
# could probably be done as a for-loop, but I suck at bash so this is
# the best we're getting.

echo "Assembling Ohio Voter State Data"
if [ ! -f "./SWVF_1_22.csv" ]; then
  (echo "Assembling SWVF_1_22"; cat SWVF_1_22.txt.part.* > SWVF_1_22.txt.gz; echo "Expanding SWVF_1_22"; gunzip -k SWVF_1_22.txt.gz; mv SWVF_1_22.txt SWVF_1_22.csv; echo "SWVF_1_22.csv assembled.") &
else
  echo "SWVF_1_22 already found"
fi

if [ ! -f "./SWVF_23_44.csv" ]; then
  (echo "Assembling SWVF_23_44"; cat SWVF_23_44.txt.part.* > SWVF_23_44.txt.gz; echo "Expanding SWVF_23_44"; gunzip -k SWVF_23_44.txt.gz; mv SWVF_23_44.txt SWVF_23_44.csv; echo "SWVF_23_44.csv assembled.") &
else
  echo "SWVF_23_44 already found"
fi

if [ ! -f "./SWVF_45_66.csv" ]; then
  (echo "Assembling SWVF_45_66"; cat SWVF_45_66.txt.part.* > SWVF_45_66.txt.gz; echo "Expanding SWVF_45_66"; gunzip -k SWVF_45_66.txt.gz; mv SWVF_45_66.txt SWVF_45_66.csv; echo "SWVF_45_66.csv assembled.") &
else
  echo "SWVF_45_66 already found"
fi

if [ ! -f "./SWVF_67_88.csv" ]; then
  (echo "Assembling SWVF_67_88"; cat SWVF_67_88.txt.part.* > SWVF_67_88.txt.gz; echo "Expanding SWVF_67_88"; gunzip -k SWVF_67_88.txt.gz; mv SWVF_67_88.txt SWVF_67_88.csv; echo "SWVF_67_88.csv assembled.") &
else
  echo "SWVF_67_88 already found"
fi

wait
echo "Completed assembling Ohio state voter data."
