package com.theknicks.voteranalysis_backend.controllers;

import java.util.*;

import com.theknicks.voteranalysis_backend.models.VoterModel;
import com.theknicks.voteranalysis_backend.services.VoterService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

/**
 * This controller is meant to service requests about Voter information
 * as per Sean's test data.
 * 
 * Only GET methods supported for this for now.
 */
@RestController
@RequestMapping("/voters")
public class VoterController {
    private final Logger _logger = LoggerFactory.getLogger(VoterController.class);
    private final VoterService _service;

    public VoterController(VoterService service) {
        _service = service;
        _logger.info("Created VoterController.");
    }

    /**
     * This method on the controller maps to
     * `GET /voters`.
     *
     * @return a list of `VoterModel`
     */
    @GetMapping
    public List<VoterModel> getAllVoters() {
        _logger.debug("Requesting all voters");
        return _service.getAllVoters();
    }

    /**
     * This method on the controller maps to
     * `GET /voters/id`, where `id` is a number.
     *
     * @param userId - the ID of the voter we want to retrieve.
     * @return if the voter exists, the VoterModel for the user. Null if they do not.
     */
    @GetMapping("/{id}")
    public VoterModel getVoter(@PathVariable("id") int userId) {
        _logger.debug("Requesting particular voter " + userId);
        return _service.getVoter(userId);
    }
}