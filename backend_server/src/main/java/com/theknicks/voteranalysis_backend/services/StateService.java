package com.theknicks.voteranalysis_backend.services;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.theknicks.voteranalysis_backend.dao.IStateDAO;
import com.theknicks.voteranalysis_backend.models.*;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.*;

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

  public Optional<ProvisionalBallotStatisticsModel> getProvisionalBallotDataForCounty(
      String fipsCode, String countyCode, int year) {
    return _dao.getProvisionBallotRowByCounty(fipsCode, countyCode, year);
  }

  public List<ProvisionalBallotStatisticsModel> getProvisionalBallotData(
      String fipsCode, int year, boolean inAggregate) {
    return _dao.getProvisionBallotRows(fipsCode, year, inAggregate);
  }

  public List<VoterRegistrationStatisticsModel> getVoterRegistrationData(
      String fipsCode, int year, boolean inAggregate) {
    return _dao.getVoterRegistrationRows(fipsCode, year, inAggregate);
  }

  public Optional<VoterRegistrationStatisticsModel> getVoterRegistrationDataForCounty(
      String fipsCode, String countyCode, int year) {
    return _dao.getVoterRegistrationRowByCounty(fipsCode, countyCode, year);
  }

  public List<PollbookDeletionStatisticsModel> getPollbookDeletionData(
      String fipsCode, int year, boolean inAggregate) {
    return _dao.getPollbookDeletionRows(fipsCode, year, inAggregate);
  }

  public Optional<PollbookDeletionStatisticsModel> getPollbookDeletionDataForCounty(
      String fipsCode, String countyCode, int year) {
    return _dao.getPollbookDeletionRowByCounty(fipsCode, countyCode, year);
  }

  public List<MailBallotRejectionStatisticsModel> getMailBallotRejectionData(
      String fipsCode, int year, boolean inAggregate) {
    return _dao.getMailBallotRejectionRows(fipsCode, year, inAggregate);
  }

  public Optional<MailBallotRejectionStatisticsModel> getMailBallotRejectionDataForCounty(
      String fipsCode, String countyCode, int year) {
    return _dao.getMailBallotRejectionRowByCounty(fipsCode, countyCode, year);
  }

  public List<ViewStateYearSummaryModel> getViewStateYearSummaryDataForState(String fipsCode) {
    return _dao.getStateYearSummaryRows(fipsCode);
  }

  public Optional<ViewStateYearSummaryModel> getViewStateYearSummaryDataForStateByYear(
      String fipsCode, int year) {
    return _dao.getStateYearSummaryRowByYear(fipsCode, year);
  }

  public List<BallotStatisticsModel> getBallotStatistics(String fipsCode, int year) {
    return _dao.getBallotStatisticsRows(fipsCode, year);
  }

  public Optional<BallotStatisticsModel> getBallotStatisticsForCounty(
      String fipsCode, String countyFipsCode, int year) {
    return _dao.getBallotStatisticsRowByCounty(fipsCode, countyFipsCode, year);
  }

  public Map<String, GeoUnitCentroidModel> getCountyGeoUnitCentroids(String fipsCode) {
    return _dao.getGeoUnitCentroids(fipsCode);
  }

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
