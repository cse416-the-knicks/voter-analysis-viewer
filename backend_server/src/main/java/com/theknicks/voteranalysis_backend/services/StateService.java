package com.theknicks.voteranalysis_backend.services;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.theknicks.voteranalysis_backend.dao.IStateDAO;
import com.theknicks.voteranalysis_backend.models.*;
import java.util.*;
import java.util.stream.DoubleStream;
import org.apache.commons.math3.fitting.PolynomialCurveFitter;
import org.apache.commons.math3.fitting.WeightedObservedPoint;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.*;

/**
 * State Service layer,
 *
 * <p>Handles BusinessLogic for the State Controller, which currently means loading a GeoJSON file
 * and doing some preprocessing to return the exact stuff that we need to render.
 */
@Service
public class StateService {
  private final Logger logger = LoggerFactory.getLogger(StateService.class);
  private final IStateDAO dao;

  public StateService(IStateDAO dao) {
    logger.info("Creating StateService...");
    this.dao = dao;
  }

  public Optional<ObjectNode> getBoundaryGeometry(String fipsCode) {
    return dao.getGeometryBoundary(fipsCode);
  }

  @Cacheable(cacheNames = "provisionalBallotsByCounty", key = "{ #fipsCode, #year, #inAggregate }")
  public Optional<ProvisionalBallotStatisticsModel> getProvisionalBallotDataForCounty(
      String fipsCode, String countyCode, int year) {
    return dao.getProvisionBallotRowByCounty(fipsCode, countyCode, year);
  }

  @Cacheable(
      cacheNames = "provisionalBallots",
      key = "{ #fipsCode, #countyCode, #year, #inAggregate }")
  public List<ProvisionalBallotStatisticsModel> getProvisionalBallotData(
      String fipsCode, int year, boolean inAggregate) {
    return dao.getProvisionBallotRows(fipsCode, year, inAggregate);
  }

  @Cacheable(cacheNames = "voterRegistrationStatistics", key = "{ #fipsCode, #year, #inAggregate }")
  public List<VoterRegistrationStatisticsModel> getVoterRegistrationData(
      String fipsCode, int year, boolean inAggregate) {
    return dao.getVoterRegistrationRows(fipsCode, year, inAggregate);
  }

  @Cacheable(
      cacheNames = "voterRegistrationStatisticsByCounty",
      key = "{ #fipsCode, #countyCode, #year }")
  public Optional<VoterRegistrationStatisticsModel> getVoterRegistrationDataForCounty(
      String fipsCode, String countyCode, int year) {
    return dao.getVoterRegistrationRowByCounty(fipsCode, countyCode, year);
  }

  @Cacheable(cacheNames = "voterAffiliationStatistics", key = "{ #fipsCode, #inAggregate }")
  public List<VoterAffiliationStatisticsModel> getVoterAffiliationData(
      String fipsCode, boolean inAggregate) {
    return dao.getVoterAffiliationRows(fipsCode, inAggregate);
  }

  @Cacheable(cacheNames = "pollBookDeletions", key = "{ #fipsCode, #year, #inAggregate }")
  public List<PollbookDeletionStatisticsModel> getPollbookDeletionData(
      String fipsCode, int year, boolean inAggregate) {
    return dao.getPollbookDeletionRows(fipsCode, year, inAggregate);
  }

  @Cacheable(cacheNames = "pollBookDeletionsByCounty", key = "{ #fipsCode, #countyCode, #year }")
  public Optional<PollbookDeletionStatisticsModel> getPollbookDeletionDataForCounty(
      String fipsCode, String countyCode, int year) {
    return dao.getPollbookDeletionRowByCounty(fipsCode, countyCode, year);
  }

  @Cacheable(cacheNames = "mailBallotRejections", key = "{ #fipsCode, #year, #inAggregate }")
  public List<MailBallotRejectionStatisticsModel> getMailBallotRejectionData(
      String fipsCode, int year, boolean inAggregate) {
    return dao.getMailBallotRejectionRows(fipsCode, year, inAggregate);
  }

  @Cacheable(cacheNames = "mailBallotRejectionsByCounty", key = "{ #fipsCode, #countyCode, #year }")
  public Optional<MailBallotRejectionStatisticsModel> getMailBallotRejectionDataForCounty(
      String fipsCode, String countyCode, int year) {
    return dao.getMailBallotRejectionRowByCounty(fipsCode, countyCode, year);
  }

  @Cacheable(cacheNames = "viewStateYearSummary", key = "{ #fipsCode }")
  public List<ViewStateYearSummaryModel> getViewStateYearSummaryDataForState(String fipsCode) {
    return dao.getStateYearSummaryRows(fipsCode);
  }

  @Cacheable(
      cacheNames = "electionResults",
      key = "{ #fipsCode, #year, #aggregated, #granularity }")
  public List<ElectionResultsSummaryModel> getElectionResultsSummaryDataForState(
      String fipsCode, int year, boolean aggregated, String granularity) {
    return dao.getStateElectionResultsSummaryRows(fipsCode, year, aggregated, granularity);
  }

  @Cacheable(cacheNames = "viewStateYearSummaryByCounty", key = "{ #fipsCode, #year }")
  public Optional<ViewStateYearSummaryModel> getViewStateYearSummaryDataForStateByYear(
      String fipsCode, int year) {
    return dao.getStateYearSummaryRowByYear(fipsCode, year);
  }

  @Cacheable(cacheNames = "ballotStatistics", key = "{ #fipsCode, #year }")
  public List<BallotStatisticsModel> getBallotStatistics(String fipsCode, int year) {
    return dao.getBallotStatisticsRows(fipsCode, year);
  }

  @Cacheable(cacheNames = "ballotStatisticsByCounty", key = "{ #fipsCode, #year, #countyFipsCode }")
  public Optional<BallotStatisticsModel> getBallotStatisticsForCounty(
      String fipsCode, String countyFipsCode, int year) {
    return dao.getBallotStatisticsRowByCounty(fipsCode, countyFipsCode, year);
  }

  @Cacheable(
      value = "regressionCoefficients",
      key = "T(java.util.Objects).hash(#dataPoints.xs(), #dataPoints.ys(), #degree)")
  public List<Double> getRegressionCoefficients(
      RegressionDataParameterModel dataPoints, int degree) {
    List<WeightedObservedPoint> points = new ArrayList<>();
    logger.info("Received " + dataPoints.pointsCount() + " points.");
    assert dataPoints.pointsCount() == dataPoints.xs().size()
        : "Point Xs does not match the pointsCount data.";
    assert dataPoints.pointsCount() == dataPoints.ys().size()
        : "Point Ys does not match the pointsCount data.";

    var fitter = PolynomialCurveFitter.create(degree);
    var xs = dataPoints.xs();
    var ys = dataPoints.ys();

    for (int i = 0; i < dataPoints.pointsCount(); ++i) {
      // For the regression, all points are equally weighted.
      var newPoint = new WeightedObservedPoint(1.0, xs.get(i), ys.get(i));
      points.add(newPoint);
    }

    var bestFitCoefficients = fitter.fit(points);
    return new ArrayList(DoubleStream.of(bestFitCoefficients).boxed().toList());
  }

  @Cacheable(value = "getDeviceAccessibilityProbabilityByDemographicPDF", key = "{ #fipsCode, #race }")
  public List<EIXYPoint> getDeviceAccessibilityProbabilityByDemographicPDF(
      String fipsCode, int race) {
    return dao.getDeviceAccessibilityProbabilityByDemographicPDF(fipsCode, race);
  }

  @Cacheable(value = "getRejectionProbabilitiesByDemographicPDF", key = "{ #fipsCode, #race }")
  public List<EIXYPoint> getRejectionProbabilitiesByDemographicPDF(String fipsCode, int race) {
    return dao.getRejectionProbabilitiesByDemographicPDF(fipsCode, race);
  }

  @Cacheable(value = "countyGeoCentroids", key = "#fipsCode")
  public Map<String, GeoUnitCentroidModel> getCountyGeoUnitCentroids(String fipsCode) {
    return dao.getGeoUnitCentroids(fipsCode);
  }

  @Cacheable(cacheNames = "stateInformation")
  public Map<String, StateInformationModel> getStateInformationTable() {
    var stateInformation = dao.getStateInformationDataRowModels();
    var result = new HashMap<String, StateInformationModel>();

    for (var state : stateInformation) {
      var finalStateFormat = StateInformationModel.fromRaw(state);
      result.put(finalStateFormat.fipsCode(), finalStateFormat);
    }

    return result;
  }

  @Cacheable(value = "getEAVSDataQualityScore", key = "#fipsCode")
  public Double getEAVSDataQualityScore(String fipsCode) {
    return dao.getEAVSDataQualityScore(fipsCode);
  }
}
