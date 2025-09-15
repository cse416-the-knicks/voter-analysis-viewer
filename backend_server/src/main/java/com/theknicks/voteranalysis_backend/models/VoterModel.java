package com.theknicks.voteranalysis_backend.models;

import org.springframework.jdbc.core.RowMapper;
import java.sql.ResultSet;
import java.util.Date;

/** 
* This is a model class for one of Sean's dummy items.
*
* This is sort of how I want to pattern stuff. All models
* should be records, and mappers are defined within the model
* as internal classes, can experiment with this design since
* technically it couples the model with the database access,
* although I think this keeps everything that's needed in one place.
*/
public record VoterModel(
    String firstName,
    String lastName,
    Date dateOfBirth,
    int precinct_id
) 
{
}