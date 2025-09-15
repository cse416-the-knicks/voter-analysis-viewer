package com.theknicks.voteranalysis_backend.services;

import java.util.List;

import com.theknicks.voteranalysis_backend.dao.JdbcVoterDAO;
import com.theknicks.voteranalysis_backend.dao.VoterDAO;
import com.theknicks.voteranalysis_backend.models.VoterModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.*;

/**
 * Voter Service layer, 
 * 
 * This handles the business logic (extra processing or methods
 * that we would do on the VoterModel.)
 * 
 * Uses a DataAccessObject as an intermediary for actually retrieving data,
 * for the most part I expect a lot of these will generally be DAO wrappers.
 *
 * Although if we do any additional logic, this is where it should be.
 */
@Service
public class VoterService {
    private final VoterDAO _dao;
    private final Logger _logger = LoggerFactory.getLogger(VoterService.class);

    public VoterService(VoterDAO dao) {
        _dao = dao;
        _logger.info("Creating VoterService...");
    }

    /**
     * Calls the DAO for all users.
     * @return list of `VoterModel`
     */
    public List<VoterModel> getAllVoters() {
        return _dao.getAllVoters();
    }

    /**
     * Calls the DAO for a particular user.
     * @param voterId - The voter id that is to be retrieved.
     * @return The VoterModel for the voter if they exist. Null if otherwise.
     */
    public VoterModel getVoter(int voterId) {
        return _dao.getVoter(voterId);
    }
}