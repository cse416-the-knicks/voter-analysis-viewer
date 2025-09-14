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
    private final VoterService _service;

    public VoterController(VoterService service) {
        _service = service;
        System.out.println("Please!");
    }

    @GetMapping
    public List<VoterModel> getAllUsers() {
        return _service.getAllUsers();
    }

    @GetMapping("/{id}")
    public VoterModel getUser(@PathVariable("id") int userId) {
        return _service.getUser(userId);
    }
}