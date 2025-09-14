package com.theknicks.voteranalysis_backend;

import java.util.List;
import org.springframework.stereotype.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Voter Service layer, 
 * 
 * This handles the business logic (extra processing or methods
 * that we would do on the VoterModel.)
 * 
 * Uses a DataAccessObject as an intermediary for actually retrieving data.
 */
@Service
public class VoterService {
    @Autowired
    private final VoterDAO _dao;

    public VoterService(VoterDAO dao) {
        _dao = dao;
        System.out.println("Creating VoterService...");
    }

    public List<VoterModel> getAllUsers() {
        return _dao.getAllUsers();
    }

    public VoterModel getUser(int userId) {
        return _dao.getUser(userId);
    }
}