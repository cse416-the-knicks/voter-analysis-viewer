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
  private final Logger logger = LoggerFactory.getLogger(StateController.class);
  private final StateService service;

  public StateController(StateService service) {
    logger.info("Created StateController.");
    this.service = service;
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
    return service.getBoundaryGeometry(fipsCode);
  }

  @GetMapping("/{fipsCode}/centroids")
  public Map<String, GeoUnitCentroidModel> getCountyGeoUnitCentroids(
      @PathVariable("fipsCode") String fipsCode) {
    return service.getCountyGeoUnitCentroids(fipsCode);
  }

  @GetMapping("/{fipsCode}/provisional-ballots")
  public List<ProvisionalBallotStatisticsModel> getProvisionalBallots(
      @PathVariable("fipsCode") String fipsCode,
      @RequestParam(name = "year", defaultValue = "2024") int year,
      @RequestParam(name = "aggregate", defaultValue = "false") boolean inAggregate) {
    return service.getProvisionalBallotData(fipsCode, year, inAggregate);
  }

  @GetMapping("/{fipsCode}/{countyFipsCode}/provisional-ballots")
  public Optional<ProvisionalBallotStatisticsModel> getProvisionalBallotsByCounty(
      @PathVariable("fipsCode") String fipsCode,
      @PathVariable("countyFipsCode") String countyFipsCode,
      @RequestParam(name = "year", defaultValue = "2024") int year) {
    return service.getProvisionalBallotDataForCounty(fipsCode, countyFipsCode, year);
  }

  @GetMapping("/{fipsCode}/voter-registration-count")
  public List<VoterRegistrationStatisticsModel> getVoterRegistrationCounts(
      @PathVariable("fipsCode") String fipsCode,
      @RequestParam(name = "year", defaultValue = "2024") int year,
      @RequestParam(name = "aggregate", defaultValue = "false") boolean inAggregate) {
    return service.getVoterRegistrationData(fipsCode, year, inAggregate);
  }

  @GetMapping("/{fipsCode}/{countyFipsCode}/voter-registration-count")
  public Optional<VoterRegistrationStatisticsModel> getVoterRegistrationCountsByCounty(
      @PathVariable("fipsCode") String fipsCode,
      @PathVariable("countyFipsCode") String countyFipsCode,
      @RequestParam(name = "year", defaultValue = "2024") int year) {
    return service.getVoterRegistrationDataForCounty(fipsCode, countyFipsCode, year);
  }

  @GetMapping("/{fipsCode}/voter-affiliations")
  public List<VoterAffiliationStatisticsModel> getVoterAffiliations(
      @PathVariable("fipsCode") String fipsCode,
      @RequestParam(name = "aggregate", defaultValue = "false") boolean inAggregate) {
    return service.getVoterAffiliationData(fipsCode, inAggregate);
  }

  @GetMapping("/{fipsCode}/pollbook-deletions")
  public List<PollbookDeletionStatisticsModel> getPollbookDeletions(
      @PathVariable("fipsCode") String fipsCode,
      @RequestParam(name = "year", defaultValue = "2024") int year,
      @RequestParam(name = "aggregate", defaultValue = "false") boolean inAggregate) {
    return service.getPollbookDeletionData(fipsCode, year, inAggregate);
  }

  @GetMapping("/{fipsCode}/{countyFipsCode}/pollbook-deletions")
  public Optional<PollbookDeletionStatisticsModel> getPollbookDeletionsByCounty(
      @PathVariable("fipsCode") String fipsCode,
      @PathVariable("countyFipsCode") String countyFipsCode,
      @RequestParam(name = "year", defaultValue = "2024") int year) {
    return service.getPollbookDeletionDataForCounty(fipsCode, countyFipsCode, year);
  }

  @GetMapping("/{fipsCode}/mail-ballot-rejections")
  public List<MailBallotRejectionStatisticsModel> getMailBallotRejections(
      @PathVariable("fipsCode") String fipsCode,
      @RequestParam(name = "year", defaultValue = "2024") int year,
      @RequestParam(name = "aggregate", defaultValue = "false") boolean inAggregate) {
    return service.getMailBallotRejectionData(fipsCode, year, inAggregate);
  }

  @GetMapping("/{fipsCode}/{countyFipsCode}/mail-ballot-rejections")
  public Optional<MailBallotRejectionStatisticsModel> getMailBallotRejectionsByCounty(
      @PathVariable("fipsCode") String fipsCode,
      @PathVariable("countyFipsCode") String countyFipsCode,
      @RequestParam(name = "year", defaultValue = "2024") int year) {
    return service.getMailBallotRejectionDataForCounty(fipsCode, countyFipsCode, year);
  }

  @GetMapping("/{fipsCode}/ballot-statistics")
  public List<BallotStatisticsModel> getBallotStatistics(
      @PathVariable("fipsCode") String fipsCode,
      @RequestParam(name = "year", defaultValue = "2024") int year) {
    return service.getBallotStatistics(fipsCode, year);
  }

  @GetMapping("/{fipsCode}/{countyFipsCode}/ballot-statistics")
  public Optional<BallotStatisticsModel> getBallotStatisticsByCounty(
      @PathVariable("fipsCode") String fipsCode,
      @PathVariable("countyFipsCode") String countyFipsCode,
      @RequestParam(name = "year", defaultValue = "2024") int year) {
    return service.getBallotStatisticsForCounty(fipsCode, countyFipsCode, year);
  }

  @GetMapping("/{fipsCode}/year-summary")
  public List<ViewStateYearSummaryModel> getViewStateYearSummaryByState(
      @PathVariable("fipsCode") String fipsCode) {
    return service.getViewStateYearSummaryDataForState(fipsCode);
  }

  @GetMapping("/{fipsCode}/year-summary/{year}")
  public Optional<ViewStateYearSummaryModel> getViewStateYearSummaryByStateForYear(
      @PathVariable("fipsCode") String fipsCode, @PathVariable("year") int year) {
    return service.getViewStateYearSummaryDataForStateByYear(fipsCode, year);
  }

  @GetMapping("/{fipsCode}/election-year-results/{year}")
  public List<ElectionResultsSummaryModel> getElectionResultsSummary(
      @PathVariable("fipsCode") String fipsCode,
      @PathVariable("year") int year,
      @RequestParam(name = "aggregate", defaultValue = "false") boolean inAggregate,
      @RequestParam(name = "granularity", defaultValue = "county") String dataGranularity) {
    logger.info("Requesting at data granularity: " + dataGranularity);
    return service.getElectionResultsSummaryDataForState(
        fipsCode, year, inAggregate, dataGranularity);
  }

  @GetMapping("/{fipsCode}/ei-device-accessibility-by-demographic")
  public List<EIXYPoint> getDeviceAccessibilityProbabilityByDemographicPDF(
      @PathVariable("fipsCode") String fipsCode,
      @RequestParam(value = "race", defaultValue = "0") int race) {
    return service.getDeviceAccessibilityProbabilityByDemographicPDF(fipsCode, race);
  }

  @GetMapping("/{fipsCode}/ei-rejection-by-demographic")
  public List<EIXYPoint> getRejectionProbabilitiesByDemographicPDF(
      @PathVariable("fipsCode") String fipsCode,
      @RequestParam(value = "race", defaultValue = "0") int race) {
    return service.getRejectionProbabilitiesByDemographicPDF(fipsCode, race);
  }

  @GetMapping("/")
  public Map<String, StateInformationModel> getStateInformationTable() {
    return service.getStateInformationTable();
  }

  @GetMapping("/{fipsCode}/voter-registration-ordered-graph/")
  public List<VoterRegistrationHistoryGraphDataModel> getVoterRegistrationHistory(
      @PathVariable("fipsCode") String fipsCode,
      @RequestParam(name = "years", defaultValue = "2024,2022,2020,2018,2016")
          List<Integer> years) {
    // Used for sorting reference.
    var eavs2024Data = service.getVoterRegistrationData(fipsCode, 2024, false);

    var dataPerYear =
        years.stream()
            .map(year -> service.getVoterRegistrationData(fipsCode, year, false))
            .toList();

    var finalPointSets = new ArrayList<VoterRegistrationHistoryGraphDataModel>();
    for (int i = 0; i < years.size(); ++i) {
      int year = years.get(i);
      var eavsYearData = dataPerYear.get(i);

      var existingCountiesIn2024 =
          eavsYearData.stream()
              .filter(
                  item ->
                      eavs2024Data.stream()
                          .anyMatch(x -> x.countyName().equalsIgnoreCase(item.countyName())));

      var orderedCountiesBy2024 =
          existingCountiesIn2024.sorted(
              (a, b) -> {
                var corresponding2024A =
                    eavs2024Data.stream()
                        .filter(item -> item.countyName().equalsIgnoreCase(a.countyName()))
                        .findFirst();
                var corresponding2024B =
                    eavs2024Data.stream()
                        .filter(item -> item.countyName().equalsIgnoreCase(b.countyName()))
                        .findFirst();
                int compareValueA = 0;
                int compareValueB = 0;

                if (corresponding2024A.isPresent()) {
                  compareValueA = corresponding2024A.get().total();
                }

                if (corresponding2024B.isPresent()) {
                  compareValueB = corresponding2024B.get().total();
                }

                return compareValueB - compareValueA;
              });

      var orderedPoints =
          orderedCountiesBy2024
              .map(
                  data ->
                      new VoterRegistrationHistoryGraphDataModel.Point(
                          data.countyName(), data.total()))
              .toList();
      finalPointSets.add(
          new VoterRegistrationHistoryGraphDataModel(String.valueOf(year), orderedPoints));
    }

    return finalPointSets;
  }

  @PostMapping("/regression-coefficients")
  public List<Double> getRegressionCoefficients(
      @RequestBody RegressionDataParameterModel dataPoints,
      @RequestParam(name = "degree", defaultValue = "2") int degree) {
    return service.getRegressionCoefficients(dataPoints, degree);
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
