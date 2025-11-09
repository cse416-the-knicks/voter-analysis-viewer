package com.theknicks.voteranalysis_backend.controllers;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.theknicks.voteranalysis_backend.models.*;
import com.theknicks.voteranalysis_backend.services.StateService;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

/**
 * This controller will service all the requests relating to state-specific information, including
 * but not limited to: - Geographical Data - EAVs State Data - Any Appropriate Detailed Data
 */
@RestController
@RequestMapping("/state")
public class StateController {
  private final Logger _logger = LoggerFactory.getLogger(StateController.class);
  private final StateService _service;

  public StateController(StateService service) {
    _logger.info("Created StateController.");
    _service = service;
  }

  @GetMapping("/{fipsCode}/geometry")
  @ApiResponse(
      responseCode = "200",
      description = "Get the geometry boundary of a state by FipsCode",
      content =
          @Content(
              mediaType = "application/json",
              schema =
                  @Schema(
                      ref = "../openapi-ext/geojson.yaml#/components/schema/GeoJsonObject",
                      nullable = true)))
  public Optional<ObjectNode> getStateGeometry(@PathVariable("fipsCode") String fipsCode) {
    return _service.getBoundaryGeometry(fipsCode);
  }

  @GetMapping("/{fipsCode}/centroids")
  public Map<String, GeoUnitCentroidModel> getCountyGeoUnitCentroids(
      @PathVariable("fipsCode") String fipsCode) {
    return _service.getCountyGeoUnitCentroids(fipsCode);
  }

  @GetMapping("/{fipsCode}/provisional-ballots")
  public List<ProvisionalBallotStatisticsModel> getProvisionalBallots(
      @PathVariable("fipsCode") String fipsCode,
      @RequestParam(name = "year", defaultValue = "2024") int year,
      @RequestParam(name = "aggregate", defaultValue = "false") boolean inAggregate) {
    return _service.getProvisionalBallotData(fipsCode, year, inAggregate);
  }

  @GetMapping("/{fipsCode}/{countyFipsCode}/provisional-ballots")
  public Optional<ProvisionalBallotStatisticsModel> getProvisionalBallotsByCounty(
      @PathVariable("fipsCode") String fipsCode,
      @PathVariable("countyFipsCode") String countyFipsCode,
      @RequestParam(name = "year", defaultValue = "2024") int year) {
    return _service.getProvisionalBallotDataForCounty(fipsCode, countyFipsCode, year);
  }

  @GetMapping("/{fipsCode}/voter-registration-count")
  public List<VoterRegistrationStatisticsModel> getVoterRegistrationCounts(
      @PathVariable("fipsCode") String fipsCode,
      @RequestParam(name = "year", defaultValue = "2024") int year,
      @RequestParam(name = "aggregate", defaultValue = "false") boolean inAggregate) {
    return _service.getVoterRegistrationData(fipsCode, year, inAggregate);
  }

  @GetMapping("/{fipsCode}/{countyFipsCode}/voter-registration-count")
  public Optional<VoterRegistrationStatisticsModel> getVoterRegistrationCountsByCounty(
      @PathVariable("fipsCode") String fipsCode,
      @PathVariable("countyFipsCode") String countyFipsCode,
      @RequestParam(name = "year", defaultValue = "2024") int year) {
    return _service.getVoterRegistrationDataForCounty(fipsCode, countyFipsCode, year);
  }

  @GetMapping("/{fipsCode}/pollbook-deletions")
  public List<PollbookDeletionStatisticsModel> getPollbookDeletions(
      @PathVariable("fipsCode") String fipsCode,
      @RequestParam(name = "year", defaultValue = "2024") int year,
      @RequestParam(name = "aggregate", defaultValue = "false") boolean inAggregate) {
    return _service.getPollbookDeletionData(fipsCode, year, inAggregate);
  }

  @GetMapping("/{fipsCode}/{countyFipsCode}/pollbook-deletions")
  public Optional<PollbookDeletionStatisticsModel> getPollbookDeletionsByCounty(
      @PathVariable("fipsCode") String fipsCode,
      @PathVariable("countyFipsCode") String countyFipsCode,
      @RequestParam(name = "year", defaultValue = "2024") int year) {
    return _service.getPollbookDeletionDataForCounty(fipsCode, countyFipsCode, year);
  }

  @GetMapping("/{fipsCode}/mail-ballot-rejections")
  public List<MailBallotRejectionStatisticsModel> getMailBallotRejections(
      @PathVariable("fipsCode") String fipsCode,
      @RequestParam(name = "year", defaultValue = "2024") int year,
      @RequestParam(name = "aggregate", defaultValue = "false") boolean inAggregate) {
    return _service.getMailBallotRejectionData(fipsCode, year, inAggregate);
  }

  @GetMapping("/{fipsCode}/{countyFipsCode}/mail-ballot-rejections")
  public Optional<MailBallotRejectionStatisticsModel> getMailBallotRejectionsByCounty(
      @PathVariable("fipsCode") String fipsCode,
      @PathVariable("countyFipsCode") String countyFipsCode,
      @RequestParam(name = "year", defaultValue = "2024") int year) {
    return _service.getMailBallotRejectionDataForCounty(fipsCode, countyFipsCode, year);
  }

  @GetMapping("/{fipsCode}/ballot-statistics")
  public List<BallotStatisticsModel> getBallotStatistics(
      @PathVariable("fipsCode") String fipsCode,
      @RequestParam(name = "year", defaultValue = "2024") int year) {
    return _service.getBallotStatistics(fipsCode, year);
  }

  @GetMapping("/{fipsCode}/{countyFipsCode}/ballot-statistics")
  public Optional<BallotStatisticsModel> getBallotStatisticsByCounty(
      @PathVariable("fipsCode") String fipsCode,
      @PathVariable("countyFipsCode") String countyFipsCode,
      @RequestParam(name = "year", defaultValue = "2024") int year) {
    return _service.getBallotStatisticsForCounty(fipsCode, countyFipsCode, year);
  }

  @GetMapping("/{fipsCode}/year-summary")
  public List<ViewStateYearSummaryModel> getViewStateYearSummaryByState(
      @PathVariable("fipsCode") String fipsCode) {
    return _service.getViewStateYearSummaryDataForState(fipsCode);
  }

  @GetMapping("/{fipsCode}/year-summary/{year}")
  public Optional<ViewStateYearSummaryModel> getViewStateYearSummaryByStateForYear(
      @PathVariable("fipsCode") String fipsCode, @PathVariable("year") int year) {
    return _service.getViewStateYearSummaryDataForStateByYear(fipsCode, year);
  }

  @GetMapping("/")
  public Map<String, StateInformationModel> getStateInformationTable() {
    return _service.getStateInformationTable();
  }

  @GetMapping("/{fipsCode}")
  public Optional<StateInformationModel> getStateInformationTableForState(
      @PathVariable("fipsCode") String fipsCode) {
    /*
     NOTE(jerry):
     There's simply not that much data for the states to deal with so
     I'm okay with just sifting through on the server-side to
     do this.
    */
    var completeTable = getStateInformationTable();
    var retrievedResult = completeTable.get(fipsCode);
    if (retrievedResult == null) {
      return Optional.empty();
    }
    return Optional.of(retrievedResult);
  }
}
