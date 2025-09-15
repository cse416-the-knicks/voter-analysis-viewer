package com.theknicks.voteranalysis_backend.dao;

import com.theknicks.voteranalysis_backend.models.VoterModel;
import java.util.List;

/**
 * Voter Data Access Object interface.
 */
public interface VoterDAO {
    public VoterModel getVoter(int voterId);
    public List<VoterModel> getAllVoters();
}