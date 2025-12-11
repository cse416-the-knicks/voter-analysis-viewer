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
  private final Logger logger = LoggerFactory.getLogger(VoterRegistrationController.class);
  private final ObjectMapper objectMapper = new ObjectMapper();
  private final VoterRegistrationService service;

  public VoterRegistrationController(VoterRegistrationService service) {
    logger.info("Created VoterRegistrationController.");
    this.service = service;
  }

  @GetMapping("/count")
  public int getDetailedVoterRegistrationDataCount(
      @RequestParam(name = "state", defaultValue = "") String stateFips,
      @RequestParam(name = "county", defaultValue = "") String countyFips,
      @RequestParam(name = "party", defaultValue = "0") int partySelectionFilterId) {
    // NOTE(jerry):
    // this end-point exists to help support pagination on the frontend.
    return service.getDetailedVoterRegistrationDataCount(
        stateFips, countyFips, partySelectionFilterId);
  }

  @GetMapping("/")
  public List<VoterRegistrationDataModel> getDetailedVoterRegistrationData(
      @RequestParam(name = "state", defaultValue = "") String stateFips,
      @RequestParam(name = "county", defaultValue = "") String countyFips,
      @RequestParam(name = "pageSize", defaultValue = "50") int pageSize,
      @RequestParam(name = "pageIndex", defaultValue = "0") int pageIndex,
      @RequestParam(name = "party", defaultValue = "0") int partySelectionFilterId,
      @RequestParam(name = "sort", defaultValue = "") String encodedSortParams) {
    CollectionSortParamModel sortParams = null;
    if (!encodedSortParams.isEmpty()) {
      var decodedSortParams = URLDecoder.decode(encodedSortParams, StandardCharsets.UTF_8);
      try {
        sortParams = objectMapper.readValue(decodedSortParams, CollectionSortParamModel.class);
      } catch (JsonProcessingException jpe) {
        logger.error("Error processing sort params?");
        logger.error(jpe.getMessage());
      }
    }
    logger.info(encodedSortParams);
    return service.getDetailedVoterRegistrationData(
        stateFips,
        countyFips,
        pageSize,
        pageIndex,
        (sortParams != null) ? Optional.of(sortParams) : Optional.empty(),
        partySelectionFilterId);
  }

  @GetMapping("/cvap/{fipsCode}")
  public List<CVAPStatisticsModel> getCVAPStatisticsData(
      @PathVariable(name = "fipsCode") String fipsCode,
      @RequestParam(name = "year", defaultValue = "2023") int year,
      @RequestParam(name = "aggregate", defaultValue = "false") boolean inAggregate,
      @RequestParam(name = "granularity", defaultValue = "county") String dataGranularity) {
    logger.info("Requesting at data granularity: " + dataGranularity);
    return service.getCVAPStatisticsData(fipsCode, year, inAggregate, dataGranularity);
  }
}
