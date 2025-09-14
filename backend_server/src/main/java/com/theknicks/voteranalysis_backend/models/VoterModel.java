package com.theknicks.voteranalysis_backend;

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
    private class InternalRowMapper implements RowMapper<VoterModel> {
        public VoterModel mapRow(
            ResultSet resultSet, 
            int rowNumber)
        {
            try {
                VoterModel result = new VoterModel(
                    resultSet.getString("first_name"),
                    resultSet.getString("last_name"),
                    resultSet.getDate("dob"),
                    resultSet.getInt("precinct_id")
                );
                return result;
            } catch(Exception e) {
                // NOTE(jerry): maybe not a good idea
                return null;
            }
        }
    }

    private static InternalRowMapper _MAPPER;

    public static RowMapper<VoterModel> getRowMapper() {
        return _MAPPER;
    }
}