package com.theknicks.voteranalysis_backend.services;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.theknicks.voteranalysis_backend.dao.IStateDAO;
import com.theknicks.voteranalysis_backend.models.*;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.DoubleStream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.*;
import org.apache.commons.math3.fitting.PolynomialCurveFitter;
import org.apache.commons.math3.fitting.WeightedObservedPoint;

/**
 * State Service layer,
 *
 * <p>Handles BusinessLogic for the State Controller, which currently means loading a GeoJSON file
 * and doing some preprocessing to return the exact stuff that we need to render.
 */
@Service
public class StateService {
  private final Logger _logger = LoggerFactory.getLogger(StateService.class);
  private final IStateDAO _dao;

  public StateService(IStateDAO dao) {
    _logger.info("Creating StateService...");
    _dao = dao;
  }

  public Optional<ObjectNode> getBoundaryGeometry(String fipsCode) {
    return _dao.getGeometryBoundary(fipsCode);
  }

  @Cacheable(cacheNames = "provisionalBallotsByCounty", key = "{ #fipsCode, #year, #inAggregate }")
  public Optional<ProvisionalBallotStatisticsModel> getProvisionalBallotDataForCounty(
      String fipsCode, String countyCode, int year) {
    return _dao.getProvisionBallotRowByCounty(fipsCode, countyCode, year);
  }

  @Cacheable(
      cacheNames = "provisionalBallots",
      key = "{ #fipsCode, #countyCode, #year, #inAggregate }")
  public List<ProvisionalBallotStatisticsModel> getProvisionalBallotData(
      String fipsCode, int year, boolean inAggregate) {
    return _dao.getProvisionBallotRows(fipsCode, year, inAggregate);
  }

  @Cacheable(cacheNames = "voterRegistrationStatistics", key = "{ #fipsCode, #year, #inAggregate }")
  public List<VoterRegistrationStatisticsModel> getVoterRegistrationData(
      String fipsCode, int year, boolean inAggregate) {
    return _dao.getVoterRegistrationRows(fipsCode, year, inAggregate);
  }

  @Cacheable(
      cacheNames = "voterRegistrationStatisticsByCounty",
      key = "{ #fipsCode, #countyCode, #year }")
  public Optional<VoterRegistrationStatisticsModel> getVoterRegistrationDataForCounty(
      String fipsCode, String countyCode, int year) {
    return _dao.getVoterRegistrationRowByCounty(fipsCode, countyCode, year);
  }

  @Cacheable(cacheNames = "pollBookDeletions", key = "{ #fipsCode, #year, #inAggregate }")
  public List<PollbookDeletionStatisticsModel> getPollbookDeletionData(
      String fipsCode, int year, boolean inAggregate) {
    return _dao.getPollbookDeletionRows(fipsCode, year, inAggregate);
  }

  @Cacheable(cacheNames = "pollBookDeletionsByCounty", key = "{ #fipsCode, #countyCode, #year }")
  public Optional<PollbookDeletionStatisticsModel> getPollbookDeletionDataForCounty(
      String fipsCode, String countyCode, int year) {
    return _dao.getPollbookDeletionRowByCounty(fipsCode, countyCode, year);
  }

  @Cacheable(cacheNames = "mailBallotRejections", key = "{ #fipsCode, #year, #inAggregate }")
  public List<MailBallotRejectionStatisticsModel> getMailBallotRejectionData(
      String fipsCode, int year, boolean inAggregate) {
    return _dao.getMailBallotRejectionRows(fipsCode, year, inAggregate);
  }

  @Cacheable(cacheNames = "mailBallotRejectionsByCounty", key = "{ #fipsCode, #countyCode, #year }")
  public Optional<MailBallotRejectionStatisticsModel> getMailBallotRejectionDataForCounty(
      String fipsCode, String countyCode, int year) {
    return _dao.getMailBallotRejectionRowByCounty(fipsCode, countyCode, year);
  }

  @Cacheable(cacheNames = "viewStateYearSummary", key = "{ #fipsCode }")
  public List<ViewStateYearSummaryModel> getViewStateYearSummaryDataForState(String fipsCode) {
    return _dao.getStateYearSummaryRows(fipsCode);
  }

  @Cacheable(cacheNames = "electionResults", key = "{ #fipsCode, #year, #aggregated }")
  public List<ElectionResultsSummaryModel> getElectionResultsSummaryDataForState(
      String fipsCode, int year, boolean aggregated) {
    return _dao.getStateElectionResultsSummaryRows(fipsCode, year, aggregated);
  }

  @Cacheable(cacheNames = "viewStateYearSummaryByCounty", key = "{ #fipsCode, #year }")
  public Optional<ViewStateYearSummaryModel> getViewStateYearSummaryDataForStateByYear(
      String fipsCode, int year) {
    return _dao.getStateYearSummaryRowByYear(fipsCode, year);
  }

  @Cacheable(cacheNames = "ballotStatistics", key = "{ #fipsCode, #year }")
  public List<BallotStatisticsModel> getBallotStatistics(String fipsCode, int year) {
    return _dao.getBallotStatisticsRows(fipsCode, year);
  }

  @Cacheable(cacheNames = "ballotStatisticsByCounty", key = "{ #fipsCode, #year, #countyFipsCode }")
  public Optional<BallotStatisticsModel> getBallotStatisticsForCounty(
      String fipsCode, String countyFipsCode, int year) {
    return _dao.getBallotStatisticsRowByCounty(fipsCode, countyFipsCode, year);
  }

  public List<Double> getRegressionCoefficients(
    RegressionDataParameterModel dataPoints
  ) {
    List<WeightedObservedPoint> points = new ArrayList<>();

    assert dataPoints.pointsCount() == dataPoints.xs().size() : "Point Xs does not match the pointsCount data.";
    assert dataPoints.pointsCount() == dataPoints.ys().size() : "Point Ys does not match the pointsCount data.";

    // Initial coefficients, this is for a quadratic curve.
    var fitter = PolynomialCurveFitter.create(2).withStartPoint(
      new double[] {
        0.0, 0.0, 0.0
      }
    );

    for (int i = 0; i < dataPoints.pointsCount(); ++i) {
      // For the regression, all points are equally weighted.
      var newPoint = new WeightedObservedPoint(
        1.0, dataPoints.xs().get(i), dataPoints.ys().get(i));
      points.add(newPoint);
    }

    var bestFitCoefficients = fitter.fit(points);
    return DoubleStream.of(bestFitCoefficients).boxed().toList();
  }

  public Map<String, GeoUnitCentroidModel> getCountyGeoUnitCentroids(String fipsCode) {
    return _dao.getGeoUnitCentroids(fipsCode);
  }

  @Cacheable(cacheNames = "stateInformation")
  public Map<String, StateInformationModel> getStateInformationTable() {
    var stateInformation = _dao.getStateInformationDataRowModels();
    var result = new HashMap<String, StateInformationModel>();

    for (var state : stateInformation) {
      var finalStateFormat = StateInformationModel.fromRaw(state);
      result.put(finalStateFormat.fipsCode(), finalStateFormat);
    }

    return result;
  }
}
