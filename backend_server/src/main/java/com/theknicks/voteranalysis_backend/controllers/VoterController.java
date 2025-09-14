package com.theknicks.voteranalysis_backend;

import java.util.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.*;

/**
 * This controller is meant to service requests about Voter information
 * as per Sean's test data.
 * 
 * Only GET methods supported for this for now.
 */
@RestController
@RequestMapping("/voters")
public class VoterController {
    private final JdbcTemplate _jdbcTemplate;

    public VoterController(JdbcTemplate jdbcTemplate) {
        _jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public List<VoterModel> getAllUsers() {
        List<VoterModel> result;
        String sqlStatement = "SELECT * FROM voters";
        result = _jdbcTemplate.query(
            sqlStatement, 
            VoterModel.getRowMapper());
        return result;
    }

    @GetMapping("/{id}")
    public VoterModel getUser(@PathVariable("id") int userId) {
        List<VoterModel> result;
        String sqlStatement = "SELECT * FROM voters WHERE voter_id=?";
        result = _jdbcTemplate.query(
            sqlStatement, 
            VoterModel.getRowMapper(), 
            userId);

        if (result.isEmpty()) {
            return null;
        }

        return result.getFirst();
    }
}