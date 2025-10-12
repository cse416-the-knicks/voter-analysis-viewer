package com.theknicks.voteranalysis_backend.controllers;

import java.util.*;
import org.slf4j.*;
import org.springframework.web.bind.annotation.*;
import com.theknicks.voteranalysis_backend.models.*;
import com.theknicks.voteranalysis_backend.services.VoterRegistrationService;

/**
 * This controller services requests relating to detailed voter registration
 * data.
 *
 * It really only needs one endpoint, the rest of these are queries that
 * are used to filter out the result.
 */
@RestController
@RequestMapping("/voter-registration")
public class VoterRegistrationController {
    private final Logger _logger = LoggerFactory.getLogger(VoterRegistrationController.class);
    private final VoterRegistrationService _service;

    public VoterRegistrationController(VoterRegistrationService service) {
        _logger.info("Created VoterRegistrationController.");
        _service = service;
    }

    @GetMapping("/")
    public List<VoterRegistrationDataModel> getDetailedVoterRegistrationData(
            @RequestParam(name="state", defaultValue="") String stateFips,
            @RequestParam(name="county", defaultValue="") String countyFips
    ) {
        return _service.getDetailedVoterRegistrationData(
                stateFips,
                countyFips
        );
    }
}
