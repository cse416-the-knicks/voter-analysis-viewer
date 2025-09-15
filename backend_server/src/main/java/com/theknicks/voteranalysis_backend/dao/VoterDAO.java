package com.theknicks.voteranalysis_backend.dao;

import com.theknicks.voteranalysis_backend.models.VoterModel;
import java.util.List;
import java.util.Optional;

/**
 * Voter Data Access Object interface.
 */
public interface VoterDAO {
    Optional<VoterModel> getVoter(int voterId);
    List<VoterModel> getAllVoters();
}