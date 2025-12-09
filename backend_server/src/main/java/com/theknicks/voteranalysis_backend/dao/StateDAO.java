package com.theknicks.voteranalysis_backend.dao;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.theknicks.voteranalysis_backend.helpers.*;
import com.theknicks.voteranalysis_backend.models.*;
import java.io.*;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.*;

@Component
public class StateDAO implements IStateDAO {
  private final Logger logger = LoggerFactory.getLogger(StateDAO.class);
  private final String preprocessedGeospatialPath = "../data_common/geospatial_processed/";
  private final JdbcTemplate jdbcTemplate;

  public StateDAO(JdbcTemplate jdbcTemplate) throws IOException {
    logger.info("Creating Concrete StateDAO");
    logger.info(preprocessedGeospatialPath);
    this.jdbcTemplate = jdbcTemplate;
  }

  public Optional<ObjectNode> getGeometryBoundary(String fipsCode) {
    var mapper = new ObjectMapper();
    logger.info("Reading state with fips code: " + fipsCode);
    try (Reader reader =
        new FileReader(preprocessedGeospatialPath + "stateByFips/" + fipsCode + ".json")) {
      var node = mapper.readValue(reader, ObjectNode.class);
      return Optional.of(node);
    } catch (IOException e) {
      e.printStackTrace();
    }

    return Optional.empty();
  }

  private <T> List<T> getStateDataRows(
      Class<T> type, String fipsCode, int year, boolean aggregated) {
    var queryable = AutoSqlQueryable.findQueryableNested(type);
    assert queryable != null;
    return jdbcTemplate.query(
        queryable.Query(aggregated)
            + " where substring(eavs_data.region_id, 1, 2) = ? and year = ?",
        queryable.Mapper(aggregated),
        fipsCode,
        year);
  }

  public <T> Optional<T> getStateDataRowByCounty(
      Class<T> type, String fipsCode, String countyCode, int year) {
    var queryable = AutoSqlQueryable.findQueryableNested(type);
    var fullPaddedFipsCode = fipsCode + countyCode + "00000";
    assert queryable != null;
    var queryResult =
        (List<T>)
            jdbcTemplate.query(
                queryable.Query(false) + " where eavs_data.region_id = ? and year = ?",
                queryable.Mapper(false),
                fullPaddedFipsCode,
                year);

    return ListHelpers.getFirst(queryResult);
  }

  public List<ProvisionalBallotStatisticsModel> getProvisionBallotRows(
      String fipsCode, int year, boolean aggregated) {
    return getStateDataRows(ProvisionalBallotStatisticsModel.class, fipsCode, year, aggregated);
  }

  public Optional<ProvisionalBallotStatisticsModel> getProvisionBallotRowByCounty(
      String fipsCode, String countyCode, int year) {
    return getStateDataRowByCounty(
        ProvisionalBallotStatisticsModel.class, fipsCode, countyCode, year);
  }

  public List<VoterRegistrationStatisticsModel> getVoterRegistrationRows(
      String fipsCode, int year, boolean aggregated) {
    return getStateDataRows(VoterRegistrationStatisticsModel.class, fipsCode, year, aggregated);
  }

  public List<VoterAffiliationStatisticsModel> getVoterAffiliationRows(
      String fipsCode, boolean aggregated) {
    var queryable = new VoterAffiliationStatisticsModel.Queryable();
    var sqlQuery =
        queryable.QueryWhere(
            new String[] {"eavs_data.\"year\" = 2024", "app.eavs_geounit.state_id = ?"});
    var mapper = queryable.Mapper();
    var queryResult = jdbcTemplate.query(sqlQuery, mapper, Integer.parseInt(fipsCode, 10));

    if (aggregated) {
      // NOTE(jerry):
      // The aggregation on this is kind of complicated
      // imo, and is a different query which our ORM (and I assume many tbh),
      // don't specifically support, so the aggregation will be done here manually.
      int democraticTotal = 0;
      int republicanTotal = 0;
      int unaffiliatedTotal = 0;
      int totalRegisteredVoters = 0;
      int totalActiveRegisteredVoters = 0;

      for (var item : queryResult) {
        democraticTotal += item.democraticTotal();
        republicanTotal += item.republicanTotal();
        unaffiliatedTotal += item.unaffiliatedTotal();
        totalRegisteredVoters += item.registeredVotersTotal();
        totalActiveRegisteredVoters += item.activeRegisteredVotersTotal();
      }

      return Collections.singletonList(
          new VoterAffiliationStatisticsModel(
              democraticTotal,
              republicanTotal,
              unaffiliatedTotal,
              totalRegisteredVoters,
              totalActiveRegisteredVoters));
    }

    return queryResult;
  }

  public Optional<VoterRegistrationStatisticsModel> getVoterRegistrationRowByCounty(
      String fipsCode, String countyCode, int year) {
    return getStateDataRowByCounty(
        VoterRegistrationStatisticsModel.class, fipsCode, countyCode, year);
  }

  public List<PollbookDeletionStatisticsModel> getPollbookDeletionRows(
      String fipsCode, int year, boolean aggregated) {
    return getStateDataRows(PollbookDeletionStatisticsModel.class, fipsCode, year, aggregated);
  }

  public Optional<PollbookDeletionStatisticsModel> getPollbookDeletionRowByCounty(
      String fipsCode, String countyCode, int year) {
    return getStateDataRowByCounty(
        PollbookDeletionStatisticsModel.class, fipsCode, countyCode, year);
  }

  public List<MailBallotRejectionStatisticsModel> getMailBallotRejectionRows(
      String fipsCode, int year, boolean aggregated) {
    return getStateDataRows(MailBallotRejectionStatisticsModel.class, fipsCode, year, aggregated);
  }

  public Optional<MailBallotRejectionStatisticsModel> getMailBallotRejectionRowByCounty(
      String fipsCode, String countyCode, int year) {
    return getStateDataRowByCounty(
        MailBallotRejectionStatisticsModel.class, fipsCode, countyCode, year);
  }

  public List<BallotStatisticsModel> getBallotStatisticsRows(String fipsCode, int year) {
    return getStateDataRows(BallotStatisticsModel.class, fipsCode, year, false);
  }

  public Optional<BallotStatisticsModel> getBallotStatisticsRowByCounty(
      String fipsCode, String countyCode, int year) {
    return getStateDataRowByCounty(BallotStatisticsModel.class, fipsCode, countyCode, year);
  }

  public List<ViewStateYearSummaryModel> getStateYearSummaryRows(String fipsCode) {
    var queryable = new ViewStateYearSummaryModel.Queryable();
    return jdbcTemplate.query(
        queryable.Query() + " where state_id = ?",
        queryable.Mapper(),
        Integer.parseInt(fipsCode, 10));
  }

  public Optional<ViewStateYearSummaryModel> getStateYearSummaryRowByYear(
      String fipsCode, int year) {
    var queryable = new ViewStateYearSummaryModel.Queryable();
    return ListHelpers.getFirst(
        jdbcTemplate.query(
            queryable.Query() + " where state_id = ? and year = ?",
            queryable.Mapper(),
            Integer.parseInt(fipsCode, 10),
            year));
  }

  public List<ElectionResultsSummaryModel> getStateElectionResultsSummaryRows(
      String fipsCode, int year, boolean aggregated) {
    var queryable = new ElectionResultsSummaryModel.Queryable();
    return jdbcTemplate.query(
        queryable.Query(aggregated) + " where election_results.state_id = ? and year = ?",
        queryable.Mapper(aggregated),
        Integer.parseInt(fipsCode, 10),
        year);
  }

  public Map<String, GeoUnitCentroidModel> getGeoUnitCentroids(String fipsCode) {
    var result = new HashMap<String, GeoUnitCentroidModel>();

    // state_id is an integer in the schema definition.
    var fipsCodeAsInteger = Integer.parseInt(fipsCode, 10);
    var queryable = new GeoUnitCentroidDataRowModel.Queryable();
    var queryString = queryable.QueryWhere(new String[] {"region_boundary.state_id = ?"});
    var queryMapper = queryable.Mapper();
    var queryResult = jdbcTemplate.query(queryString, queryMapper, fipsCodeAsInteger);
    var geoUnitCentroids = queryResult.stream().map(GeoUnitCentroidModel::fromDataRow).toList();

    for (var geoUnitCentroid : geoUnitCentroids) {
      result.put(geoUnitCentroid.fullRegionId(), geoUnitCentroid);
    }

    return result;
  }

  public List<StateInformationDataRowModel> getStateInformationDataRowModels() {
    var queryable = AutoSqlQueryable.findQueryableNested(StateInformationDataRowModel.class);
    assert queryable != null;
    return jdbcTemplate.query(queryable.Query(), queryable.Mapper());
  }
}
