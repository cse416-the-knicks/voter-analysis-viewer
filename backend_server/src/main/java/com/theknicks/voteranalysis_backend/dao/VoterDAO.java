package com.theknicks.voteranalysis_backend.dao;

import com.theknicks.voteranalysis_backend.models.VoterModel;
import java.util.List;
import java.util.Optional;

/**
 * Voter Data Access Object interface.
 */
public interface VoterDAO {
    public Optional<VoterModel> getVoter(int voterId);
    public List<VoterModel> getAllVoters();
}