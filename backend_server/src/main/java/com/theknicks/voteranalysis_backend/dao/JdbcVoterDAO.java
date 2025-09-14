package com.theknicks.voteranalysis_backend;

import java.util.List;
import java.util.ArrayList;
import java.sql.ResultSet;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

@Component
public class JdbcVoterDAO implements VoterDAO {
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
                // NOTE(jerry): maybe not a good idea.
                return null;
            }
        }
    }

    @Autowired
    private final JdbcTemplate _jdbcTemplate;

    public JdbcVoterDAO(JdbcTemplate jdbcTemplate) {
        _jdbcTemplate = jdbcTemplate;
        System.out.println("Creating JdbcVoterDAO");
    }

    public VoterModel getUser(int voterId) {
        List<VoterModel> result;
        String sqlStatement = "SELECT * FROM voters WHERE voter_id=?";
        result = _jdbcTemplate.query(
            sqlStatement, 
            new InternalRowMapper(),
            voterId);

        if (result.isEmpty()) {
            return null;
        }

        return result.getFirst();
    }

    public List<VoterModel> getAllUsers() {
        List<VoterModel> result;
        String sqlStatement = "SELECT * FROM voters";
        result = _jdbcTemplate.query(
            sqlStatement, 
            new InternalRowMapper());
        return result;
    }
}