package com.theknicks.voteranalysis_backend.dao;

import java.util.List;
import java.util.Optional;
import java.sql.ResultSet;
import com.theknicks.voteranalysis_backend.models.VoterModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

/**
 * This implements the Data Access Object pattern for a Voter model within
 * the demo database schema.
 */
@Component
public class VoterDAO implements IVoterDAO {
    /**
     * This internal class should be in all the Data Access Objects. It implements
     * a mapping between the rows/columns of the relation database and puts them
     * into a VoterModel.
     */
    private static class InternalRowMapper implements RowMapper<VoterModel> {
        public VoterModel mapRow(
            ResultSet resultSet, 
            int rowNumber)
        {
            try {
                return new VoterModel(
                    resultSet.getInt("voter_id"),
                    resultSet.getString("first_name"),
                    resultSet.getString("last_name"),
                    resultSet.getDate("dob"),
                    resultSet.getInt("precinct_id")
                );
            } catch(Exception e) {
                // NOTE(jerry): maybe not a good idea.
                return null;
            }
        }
    }

    private final JdbcTemplate _jdbcTemplate;
    private final Logger _logger = LoggerFactory.getLogger(VoterDAO.class);

    public VoterDAO(JdbcTemplate jdbcTemplate) {
        _jdbcTemplate = jdbcTemplate;
        _logger.info("Creating JdbcVoterDAO");
    }

    /**
     * Make a SQL query for a particular voter.
     * @param voterId - The id of the voter. Corresponds to the exact column in the DB.
     * @return a VoterModel for the entry if exists.
     */
    public Optional<VoterModel> getVoter(int voterId) {
        List<VoterModel> result;
        String sqlStatement = "SELECT * FROM voters WHERE voter_id=?";
        result = _jdbcTemplate.query(
            sqlStatement, 
            new InternalRowMapper(),
            voterId);

        if (result.isEmpty()) {
            _logger.debug("This voter doesn't have an entry.");
            return Optional.empty();
        }

        return Optional.of(result.getFirst());
    }

    /**
     * Make a SQL query for all the voters.
     * @return a list of VoterModels, can be empty.
     */
    public List<VoterModel> getAllVoters() {
        List<VoterModel> result;
        String sqlStatement = "SELECT * FROM voters";
        result = _jdbcTemplate.query(
            sqlStatement, 
            new InternalRowMapper());
        _logger.debug("Found " + result.size() + " voter entries.");
        return result;
    }
}