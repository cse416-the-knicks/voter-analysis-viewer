# SQL Schema (Source of Truth)

This folder holds the **authoritative SQL for the database schema** used by the Knicks for the CSE 416 Poject

---

## Folder Layout

```
sql/
    README.md <-- this file
    schema/ <-- table & index definitions (baseline + migrations)
        001_create_states.sql
        002_create_eavs_geounit.sql
        003_create_eavs_data.sql
        004_create_census_block.sql
        005_create_device_model.sql
        006_create_equipment_usage.sql
        007_create_voter_registration.sql
        008_create_election_results.sql
        009_create_cvap_data.sql
        010_alter_region_id.sql
        011_drop_eavs_geounit_and_migrate.sql
    views/ <-- active derived views for frontend queries
        101_v_states_lookup.sql
        104_v_region_year_turnout.sql
        105_v_region_year_early_mail_rates.sql
        106_v_region_year_mail_rejects.sql
        107_v_region_year_provisional_rates.sql
        110_v_region_year_equipment_summary.sql
        111_v_device_model_usage.sql
        113_v_state_year_summary.sql
        114_v_state_year_results.sql
        115_v_eavs_latest_year.sql
        116_v_results_latest_year.sql
        117_v_devices_latest_year.sql
        120_v_region_year_basics_lite.sql
        121_v_region_year_results_lite.sql
        122_v_region_year_equipment_lite.sql
        123_v_region_year_cvap_lite.sql
            views/archived/
                102_v_regions_lookup.sql
                103_v_region_year_basics.sql
                108_v_region_year_results.sql
                109_v_region_year_equipment.sql
                112_v_region_year_cvap.sql
                118_v_regions_centroids.sql
                119_v_regions_bounds.sql

```

---

## Numbering Convention

- **0xx** → schema files (tables + indexes, and migrations).
- **1xx** → views (frontend-friendly abstractions).
- Files are prefixed with an **incrementing three-digit number** so the creation order is explicit.
- Keep the sequence stable.

**Examples**

- `001_create_states.sql` – creates `app.states`
- `009_create_cvap_data.sql` – creates `app.cvap_data`
- `115_v_eavs_latest_year.sql` – latest-year snapshot view

---

## Authoritative Schema Index

Short summaries of what each file creates and why. Update this table **whenever you add a new file**.

### Tables & Indexes

| File                                  | Creates                  | Purpose                                                                                                     |
| ------------------------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------- |
| 001_create_states.sql                 | `app.states`             | State-level attributes (policies, summary stats). Stores geometry as text since we are not using PostGIS.   |
| 002_create_eavs_geounit.sql           | `app.eavs_geounit`       | **(deprecated)** Jurisdictions keyed by `region_id`. Dropped in 011; kept for history.                      |
| 003_create_eavs_data.sql              | `app.eavs_data`          | EAVS facts per `region_id`+`year` (registration, removals, ballots, provisional, mail-reject stats).        |
| 004_create_census_block.sql           | `app.census_block`       | Census block centroids for mapping; fast state filtering.                                                   |
| 005_create_device_model.sql           | `app.device_model`       | Voting equipment catalog (vendor/model, certs, metrics).                                                    |
| 006_create_equipment_usage.sql        | `app.equipment_usage`    | Device deployments per state/region/year; supports history and rollups.                                     |
| 007_create_voter_registration.sql     | `app.voter_registration` | Registered voter records; minimal PII, linked to census blocks.                                             |
| 008_create_election_results.sql       | `app.election_results`   | Presidential results by `region_id`+`year`, with computed total.                                            |
| 009_create_cvap_data.sql              | `app.cvap_data`          | CVAP demographics by `region_id` and estimate year.                                                         |
| 010_alter_region_id.sql               | Alters schema            | Changed `region_id` type to `VARCHAR(10)` across `eavs_geounit` and all referencing tables.                 |
| 011_drop_eavs_geounit_and_migrate.sql | Alters schema            | Dropped `app.eavs_geounit`; added `state_id` directly to fact tables; rewired foreign keys and state views. |

### Views

| File                                    | View                                  | Purpose                                                               |
| --------------------------------------- | ------------------------------------- | --------------------------------------------------------------------- |
| 101_v_states_lookup.sql                 | `app.v_states_lookup`                 | Lightweight state directory (id, code, name).                         |
| 104_v_region_year_turnout.sql           | `app.v_region_year_turnout`           | Calculates turnout rates per region-year.                             |
| 105_v_region_year_early_mail_rates.sql  | `app.v_region_year_early_mail_rates`  | Computes early/mail voting shares.                                    |
| 106_v_region_year_mail_rejects.sql      | `app.v_region_year_mail_rejects`      | Mail ballot rejection rate per region-year.                           |
| 107_v_region_year_provisional_rates.sql | `app.v_region_year_provisional_rates` | Provisional ballot rate per region-year.                              |
| 110_v_region_year_equipment_summary.sql | `app.v_region_year_equipment_summary` | Summarized device counts per region-year.                             |
| 111_v_device_model_usage.sql            | `app.v_device_model_usage`            | Footprint of each device model (regions using, total units).          |
| 113_v_state_year_summary.sql            | `app.v_state_year_summary`            | Aggregated EAVS data per state-year (turnout, early/mail shares).     |
| 114_v_state_year_results.sql            | `app.v_state_year_results`            | Aggregated election results per state-year (shares, margins, winner). |
| 115_v_eavs_latest_year.sql              | `app.v_eavs_latest_year`              | Latest year of EAVS data.                                             |
| 116_v_results_latest_year.sql           | `app.v_results_latest_year`           | Latest year of election results.                                      |
| 117_v_devices_latest_year.sql           | `app.v_devices_latest_year`           | Latest year of equipment usage.                                       |
| 120_v_region_year_basics_lite.sql       | `app.v_region_year_basics_lite`       | Replacement for region basics without geounit metadata.               |
| 121_v_region_year_results_lite.sql      | `app.v_region_year_results_lite`      | Replacement for region results without geounit metadata.              |
| 122_v_region_year_equipment_lite.sql    | `app.v_region_year_equipment_lite`    | Replacement for region equipment without geounit metadata.            |
| 123_v_region_year_cvap_lite.sql         | `app.v_region_year_cvap_lite`         | Replacement for region CVAP demographics without geounit metadata.    |

### Archived Views

These were **removed from active use** in 011 because they depended on `app.eavs_geounit`. They remain in `sql/views/archived/` for reference.

- 102_v_regions_lookup.sql
- 103_v_region_year_basics.sql
- 108_v_region_year_results.sql
- 109_v_region_year_equipment.sql
- 112_v_region_year_cvap.sql
- 118_v_regions_centroids.sql
- 119_v_regions_bounds.sql

---

## Change Log (append entries here)

| Date       | File(s)                      | Summary                                                                                                                                                  |
| ---------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2025-09-23 | 002, 003, 006, 007, 008, 009 | `region_id` type updated to `VARCHAR(10)` across `eavs_geounit` and all referencing tables.                                                              |
| 2025-09-27 | 011, 102–119, 120–123        | Dropped `app.eavs_geounit`; removed dependent region-level views (archived); added new lite region-year views (120–123); rewired state views (113, 114). |
