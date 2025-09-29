package com.theknicks.voteranalysis_backend.controllers;

import java.util.*;

import com.theknicks.voteranalysis_backend.models.VotingEquipmentModel;
import com.theknicks.voteranalysis_backend.services.VoterEquipmentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

/**
 * This controller services all the requests relating to voting
 * equipment, which for now just basically means we're just returning
 * whatever data we have.
 *
 * There could be more processing or request types, but I don't think
 * we need anything more based on the use-cases.
 */
@RestController
@RequestMapping("/votingequipment")
public class VoterEquipmentController {
    private final Logger _logger = LoggerFactory.getLogger(VoterEquipmentController.class);
    private final VoterEquipmentService _service;

    public VoterEquipmentController(VoterEquipmentService service) {
	    _logger.info("Created VoterEquipmentController.");
        _service = service;
    }

    @GetMapping("/")
    public List<VotingEquipmentModel> getAllVotingEquipment() {
        return _service.getAllVotingEquipment();
    }

    @GetMapping("/by-manufacturer/{manufacturer}")
    public List<VotingEquipmentModel> getAllVotingEquipmentByManufacturer(
            @PathVariable("manufacturer") String manufacturer) {
        return _service.getAllVotingEquipmentByManufacturer(manufacturer);
    }

    @GetMapping("/by-type/{type}")
    public List<VotingEquipmentModel> getAllVotingEquipmentByType(
            @PathVariable("type") String type) {
        return _service.getAllVotingEquipmentByType(type);
    }

    @GetMapping("/{manufacturer}/{model}")
    public Optional<VotingEquipmentModel> getVotingEquipment(
            @PathVariable("manufacturer") String manufacturer,
            @PathVariable("model") String model) {
        return _service.getVotingEquipment(manufacturer, model);
    }
}
