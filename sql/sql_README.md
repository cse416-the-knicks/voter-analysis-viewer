# SQL Schema (Source of Truth)

This folder holds the **authoritative SQL for the database schema** used by the Knicks for the CSE 416 Poject

---

## Folder Layout

```
sql/
  README.md                <-- this file
  schema/                  <-- table & index definitions (baseline)
    001_create_states.sql
    002_create_eavs_geounit.sql
    003_create_eavs_data.sql
    004_create_census_block.sql
    005_create_device_model.sql
    006_create_equipment_usage.sql
    007_create_voter_registration.sql
    008_create_election_results.sql
    009_create_cvap_data.sql
    010_alter_region_id

```

## Numbering Convention

- Files are prefixed with an **incrementing three‑digit number** so the creation order is explicit.
- Keep the sequence stable.

**Examples**

- `001_create_states.sql` – creates `app.states`
- `002_create_eavs_geounit.sql` – creates `app.eavs_geounit` (depends on `states`)
- …

## Authoritative Schema Index

Short summaries of what each file creates and why. Update this table **whenever you add a new file**.

| File                              | Creates                  | Purpose (1–2 sentences)                                                                                                 |
| --------------------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| 001_create_states.sql             | `app.states`             | State-level attributes (policies, summary stats). Stores geometry as text (WKT/GeoJSON) since we are not using PostGIS. |
| 002_create_eavs_geounit.sql       | `app.eavs_geounit`       | Jurisdictions (counties, towns) keyed by `region_id` (**VARCHAR(10)**). Join key for all fact tables.                   |
| 003_create_eavs_data.sql          | `app.eavs_data`          | EAVS facts per `region_id`+`year` (registration, removals, ballots, provisional, mail-reject stats).                    |
| 004_create_census_block.sql       | `app.census_block`       | Census block centroids (text geometry) for bubble overlays; fast state filtering.                                       |
| 005_create_device_model.sql       | `app.device_model`       | Voting equipment catalog (vendor/model, certs, metrics).                                                                |
| 006_create_equipment_usage.sql    | `app.equipment_usage`    | Counts of devices deployed per state/region and year; supports history and rollups.                                     |
| 007_create_voter_registration.sql | `app.voter_registration` | Registered voter records for detailed states; minimal PII, linked to census blocks.                                     |
| 008_create_election_results.sql   | `app.election_results`   | Presidential results by `region_id`+`year`, with computed total.                                                        |
| 009_create_cvap_data.sql          | `app.cvap_data`          | CVAP demographics by `region_id` and estimate year.                                                                     |

---

## Change Log (append entries here)

Use this lightweight log for notable schema changes so teammates see what changed at a glance.

| Date       | File(s)                      | Summary                                                                                             |
| ---------- | ---------------------------- | --------------------------------------------------------------------------------------------------- |
| 2025‑09‑23 | 002, 003, 006, 007, 008, 009 | **`region_id`** type updated to **`VARCHAR(10)`** across `eavs_geounit` and all referencing tables. |
