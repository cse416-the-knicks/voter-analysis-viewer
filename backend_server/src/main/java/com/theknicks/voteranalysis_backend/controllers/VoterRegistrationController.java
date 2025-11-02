package com.theknicks.voteranalysis_backend.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.theknicks.voteranalysis_backend.models.*;
import com.theknicks.voteranalysis_backend.services.VoterRegistrationService;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
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
  private final ObjectMapper _objectMapper = new ObjectMapper();
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
      @RequestParam(name = "pageIndex", defaultValue = "0") int pageIndex,
      @RequestParam(name = "sort", defaultValue = "") String encodedSortParams) {
    CollectionSortParamModel sortParams = null;
    if (!encodedSortParams.isEmpty()) {
      var decodedSortParams = URLDecoder.decode(encodedSortParams, StandardCharsets.UTF_8);
      _logger.info(encodedSortParams);
      _logger.info(decodedSortParams);
      try {
        sortParams = _objectMapper.readValue(decodedSortParams, CollectionSortParamModel.class);
      } catch (JsonProcessingException jpe) {
        _logger.error("Error processing sort params?");
        _logger.error(jpe.getMessage());
      }
    }
    return _service.getDetailedVoterRegistrationData(
        stateFips,
        countyFips,
        pageSize,
        pageIndex,
        (sortParams != null) ? Optional.of(sortParams) : Optional.empty());
  }
}
