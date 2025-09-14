package com.theknicks.voteranalysis_backend;

import java.util.List;

/**
 * Voter Data Access Object interface.
 */
public interface VoterDAO {
    public VoterModel getUser(int voterId);
    public List<VoterModel> getAllUsers();
}