package com.theknicks.voteranalysis_backend.controllers;

import com.theknicks.voteranalysis_backend.models.*;
import com.theknicks.voteranalysis_backend.services.VoterRegistrationService;
import java.util.*;
import org.slf4j.*;
import org.springframework.web.bind.annotation.*;

/**
 * This controller services requests relating to detailed voter registration data.
 *
 * <p>It really only needs one endpoint, the rest of these are queries that are used to filter out
 * the result.
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

  @GetMapping("/count")
  public int getDetailedVoterRegistrationDataCount(
      @RequestParam(name = "state", defaultValue = "") String stateFips,
      @RequestParam(name = "county", defaultValue = "") String countyFips) {
    // NOTE(jerry):
    // this end-point exists to help support pagination on the frontend.
    return _service.getDetailedVoterRegistrationDataCount(stateFips, countyFips);
  }

  @GetMapping("/")
  public List<VoterRegistrationDataModel> getDetailedVoterRegistrationData(
      @RequestParam(name = "state", defaultValue = "") String stateFips,
      @RequestParam(name = "county", defaultValue = "") String countyFips,
      @RequestParam(name = "pageSize", defaultValue = "50") int pageSize,
      @RequestParam(name = "pageIndex", defaultValue = "0") int pageIndex) {
    return _service.getDetailedVoterRegistrationData(stateFips, countyFips, pageSize, pageIndex);
  }
}
