---
title: "416 Knicks - API Contract"
author:
    The Knicks
css: style.css
---

# Summary
**For Build 2510.3**

**Author: Jerry Zhu**

**Last Updated: 10/18/2025**

***

This document describes the API contracts for our backend to be consumed from the frontend, including the data structures, API endpoints and how to use them.

The API client library is in `frontend_client/src/api/client.ts` and should be used as the final reference.

To update this document, please install [Pandoc](https://pandoc.org/) and/or LaTeX and run
the following command:

```
pandoc api-contract.md -f markdown --toc --toc-depth=4 --standalone -o api-contract.pdf
```

# API Contracts

***

## Data Structures
These are the data structures representing the JSON responses that the backend will return.

**NOTE:** This document only defines data structures, we define ourselves.

 
### EAVS Data

***

#### `BallotStatisticsModel`
#### `MailBallotRejectionStatisticsModel`
#### `PollbookDeletionStatisticsModel`
#### `ProvisionalBallotStatisticsModel`
#### `VoterRegistrationStatisticsModel`
#### `ViewStateYearSummaryModel`

 
### Geometry

***

All the data structures here relate to *EAVS* GeoUnit boundary data. Primarily centroids and the
boundary polygons.

 
#### `GeoUnitCentroidModel`
This is the data structure used to define the center of an *EAVS* GeoUnit, which is typically
a county.

It is populated through as part of the preprocessing steps.

```js
GeoUnitCentroidModel {
    fullRegionId: string; /// fully 10 digit padded fips code
    countyName:   string;
    centerX:      float;  /// centerX and centerY are longitude and latitude.
    centerY:      float;
}
```
 
#### `GeoJSON`
We do not define this structure here, so please refer to the official [GeoJSON Specification.](https://geojson.org/)
 

### Voter Equipment

***

All the data structures here relate to voting equipment usecases.
 
#### `VoterEquipmentModel`
This is the data structure used to define a voting equipment machine by make, type, and manufacturer.

It is based on the class-wide shared data spreadsheet, and is synced from it through a
Python script.

This structure is currently read from a CSV file, instead of being retrieved from a database.

```js
VoterEquipmentModel {
    manufacturer: string;
    equipmentType: string;
    modelName: string;

    // NOTE(jerry):
    // These are intentionally optional. We distinguish the state of
    // not knowing the value vs. a falsy value.

    discontinued: boolean?;
    firstManufactured: int?; // Year
    lastManufactured: int?; // Year
    operatingSystem: string?;

    vvpat: bool?; // Voter Verified Paper Audit Trail
                  // whether the machine produces a paper receipt
                  // of the users' digital ballot.
                  //
                  // Can be used for recounting.
    certificationLevel: string?;
    securityRiskDescription: string?;
}
```
 

### Detailed Voter Registration

***

All the data structures defined here pertain to *Detailed Voter Registration* usecases.

#### `VoterRegistrationDataModel`
This is the data structure used to define a registered voter's information.

It contains enough to identify the person, and be used as part of a *Display Registered Voters*
functionality.

```js
VoterRegistrationDataModel {
    regionId: string;
    firstName: string;
    middleName: string;
    lastName: string;
    partyAffiliation: string;
    status: string;
}
```
 

## Endpoints

***

These are the endpoints with their appropriate `client.ts` function name for invocation.

 
### EAVS Data

***


#### **GET** `/state/{fipsCode}/provisional-ballots`
 
#### **GET** `/state/{fipsCode}/{countyFipsCode}/provisional-ballots`
 
#### **GET** `/state/{fipsCode}/voter-registration-count`
 
#### **GET** `/state/{fipsCode}/{countyFipsCode}/voter-registration-count`
 
#### **GET** `/state/{fipsCode}/pollbook-deletions`
 
#### **GET** `/state/{fipsCode}/{countyFipsCode}/pollbook-deletions`
 
#### **GET** `/state/{fipsCode}/mail-ballot-rejections`
 
#### **GET** `/state/{fipsCode}/{countyFipsCode}/mail-ballot-rejections`
 
#### **GET** `/state/{fipsCode}/year-summary`
 
#### **GET** `/state/{fipsCode}/year-summary/{year}`
 

 
### Geometry

***

#### **GET** `/state/{fipsCode}/geometry`
 
#### **GET** `/state/{fipsCode}/centroids`
 

 
### Voter Equipment

These endpoints deal with voter equipment related usecases.

***

#### **GET** `/votingequipment/`

***

**Description**: 

This endpoint will return all the voting equipment we have data on, it will
always succeed.

The corresponding client library function is: `getAllVotingEquipment`.

**Parameters**:

N/A

**Returns**:

A list of [VoterEquipmentModel](#voterequipmentmodel).

***

#### **GET** `/votingequipment/by-manufacturer/{manufacturer}`

***

**Description**: 

This endpoint will return all the voting equipment we have data on filtering on
the specified manufacturer, it will always succeed.

The corresponding client library function is: `getAllVotingEquipmentByManufacturer`.

**Parameters**:

`{manufacturer}` - This is a **path parameter**, which must be a string representing the manufacturer name.

**Returns**:

A list of [VoterEquipmentModel](#voterequipmentmodel), which are guaranteed to have the same manufacturer.

***

#### **GET** `/votingequipment/by-type/{type}`

***

**Description**: 

This endpoint will return all the voting equipment we have data on filtering on
the specified machine type, it will always succeed.

The corresponding client library function is: `getAllVotingEquipmentByType`.

**Parameters**:

`{type}` - This is a **path parameter**, which must be a string representing the equipment type, valid values are:

- `"Batch-Fed Optical Scanner"`
- `"Hand-Fed Optical Scanner"`
- `"Hybrid Optical Scanner/DRE"`
- `"DRE Dial"`
- `"DRE Touchscreen"`
- `"DRE Push Button"`
- `"Remote Ballot Marking"`
- `"Internet Voting"`
- `"Electronic Poll Book"`
- `"BMD"`
- `"BMD/Tabulator"`

**Returns**:

A list of [VoterEquipmentModel](#voterequipmentmodel), which are guaranteed to be the same equipment type.

***

#### **GET** `/votingequipment/{manufacturer}/{model}`

***

**Description**: 

This endpoint will return a specific voting equipment by manufacturer and make name.

The corresponding client library function is: `getVotingEquipment`.

**Parameters**:

`{manufacturer}` - This is a **path parameter** representing the manufacturer of the equipment.

`{model}` - This is a **path parameter** representing the model of the equipment.

**Returns**: 

A single [VoterEquipmentModel](#voterequipmentmodel) if it exists, `null` if not.

### Detailed Voter Registration

***

#### **GET** `/voter-registration/`

***

**Description**

This will return all the detailed voter registration we have, optionally allowing you to filter
by the state & county location to narrow down voter data.

The corresponding client library function is: `getDetailedVoterRegistrationData`

**Parameters**

`stateFips` - This is a **query parameter**, representing the state fips id. It is `empty` by default.

`countyFips` - This is a **query parameter**, representing the county fips id. It is `empty` by default. If it is provided, then `stateFips` **cannot be null**, otherwise you will get no return value.

**Returns**
A list of [VoterRegistrationDataModel](#voterregistrationdatamodel).