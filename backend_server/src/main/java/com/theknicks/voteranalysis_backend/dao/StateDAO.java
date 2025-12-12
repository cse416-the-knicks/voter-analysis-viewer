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
      String fipsCode, int year, boolean aggregated, String granularity) {
    if (granularity.equalsIgnoreCase("county")) {
      var queryable = new ElectionResultsSummaryModel.Queryable();
      return jdbcTemplate.query(
          queryable.Query(aggregated) + " where election_results.state_id = ? and year = ?",
          queryable.Mapper(aggregated),
          Integer.parseInt(fipsCode, 10),
          year);
    } else {
      var queryable = new PrecinctElectionResultsSummaryModel.Queryable();
      var selectQuery =
          queryable.QueryWhere(new String[] {"election_results.state_id = ? and year = ?"});
      var mapper = queryable.Mapper();
      var precinctDataRows =
          jdbcTemplate.query(selectQuery, mapper, Integer.parseInt(fipsCode, 10), year);
      return precinctDataRows.stream()
          .map(PrecinctElectionResultsSummaryModel::toElectionResultsSummaryModel)
          .toList();
    }
  }

  public List<EIXYPoint> getDeviceAccessibilityProbabilityByDemographicPDF(
      String fipsCode, int race) {
    EIXYPoint[] pts;

    switch (race) {
      case 0: // Asian
        pts =
            new EIXYPoint[] {
              new EIXYPoint(0.00, 0.05),
              new EIXYPoint(0.10, 0.40),
              new EIXYPoint(0.20, 0.90),
              new EIXYPoint(0.30, 1.35),
              new EIXYPoint(0.40, 1.55),
              new EIXYPoint(0.50, 1.60),
              new EIXYPoint(0.60, 1.45),
              new EIXYPoint(0.70, 1.10),
              new EIXYPoint(0.80, 0.60),
              new EIXYPoint(0.90, 0.20),
              new EIXYPoint(1.00, 0.05)
            };
        break;

      case 1: // Black
        pts =
            new EIXYPoint[] {
              new EIXYPoint(0.00, 0.10),
              new EIXYPoint(0.10, 0.35),
              new EIXYPoint(0.20, 0.70),
              new EIXYPoint(0.30, 1.05),
              new EIXYPoint(0.40, 1.20),
              new EIXYPoint(0.50, 1.25),
              new EIXYPoint(0.60, 1.20),
              new EIXYPoint(0.70, 1.00),
              new EIXYPoint(0.80, 0.60),
              new EIXYPoint(0.90, 0.25),
              new EIXYPoint(1.00, 0.10)
            };
        break;

      case 2: // Hispanic
        pts =
            new EIXYPoint[] {
              new EIXYPoint(0.00, 0.15),
              new EIXYPoint(0.10, 0.55),
              new EIXYPoint(0.20, 1.00),
              new EIXYPoint(0.30, 1.30),
              new EIXYPoint(0.40, 1.35),
              new EIXYPoint(0.50, 1.20),
              new EIXYPoint(0.60, 0.95),
              new EIXYPoint(0.70, 0.65),
              new EIXYPoint(0.80, 0.35),
              new EIXYPoint(0.90, 0.15),
              new EIXYPoint(1.00, 0.05)
            };
        break;

      case 3: // White
        pts =
            new EIXYPoint[] {
              new EIXYPoint(0.00, 0.05),
              new EIXYPoint(0.10, 0.25),
              new EIXYPoint(0.20, 0.70),
              new EIXYPoint(0.30, 1.25),
              new EIXYPoint(0.40, 1.60),
              new EIXYPoint(0.50, 1.75),
              new EIXYPoint(0.60, 1.60),
              new EIXYPoint(0.70, 1.20),
              new EIXYPoint(0.80, 0.70),
              new EIXYPoint(0.90, 0.25),
              new EIXYPoint(1.00, 0.05)
            };
        break;

      case 4: // Other
        pts =
            new EIXYPoint[] {
              new EIXYPoint(0.00, 0.05),
              new EIXYPoint(0.10, 0.20),
              new EIXYPoint(0.20, 0.45),
              new EIXYPoint(0.30, 0.85),
              new EIXYPoint(0.40, 1.10),
              new EIXYPoint(0.50, 1.00),
              new EIXYPoint(0.60, 1.10),
              new EIXYPoint(0.70, 0.90),
              new EIXYPoint(0.80, 0.50),
              new EIXYPoint(0.90, 0.20),
              new EIXYPoint(1.00, 0.05)
            };
        break;

      default:
        pts =
            new EIXYPoint[] {
              new EIXYPoint(0.0, 1.0) // neutral fallback
            };
        break;
    }

    return new ArrayList<>(Arrays.asList(pts));
  }

  public List<EIXYPoint> getRejectionProbabilitiesByDemographicPDF(String fipsCode, int race) {
    EIXYPoint[] pts;

    switch (race) {
      case 0: // Asian — concentrated on very low rejection
        pts =
            new EIXYPoint[] {
              new EIXYPoint(0.00, 1.20),
              new EIXYPoint(0.10, 1.50),
              new EIXYPoint(0.20, 1.40),
              new EIXYPoint(0.30, 1.10),
              new EIXYPoint(0.40, 0.70),
              new EIXYPoint(0.50, 0.40),
              new EIXYPoint(0.60, 0.20),
              new EIXYPoint(0.70, 0.10),
              new EIXYPoint(0.80, 0.05),
              new EIXYPoint(0.90, 0.03),
              new EIXYPoint(1.00, 0.01)
            };
        break;

      case 1: // Black — heavier mid-range rejection rates
        pts =
            new EIXYPoint[] {
              new EIXYPoint(0.00, 0.10),
              new EIXYPoint(0.10, 0.40),
              new EIXYPoint(0.20, 0.90),
              new EIXYPoint(0.30, 1.30),
              new EIXYPoint(0.40, 1.40),
              new EIXYPoint(0.50, 1.30),
              new EIXYPoint(0.60, 1.00),
              new EIXYPoint(0.70, 0.60),
              new EIXYPoint(0.80, 0.30),
              new EIXYPoint(0.90, 0.10),
              new EIXYPoint(1.00, 0.05)
            };
        break;

      case 2: // Hispanic — slightly skewed right (higher rejection)
        pts =
            new EIXYPoint[] {
              new EIXYPoint(0.00, 0.05),
              new EIXYPoint(0.10, 0.20),
              new EIXYPoint(0.20, 0.55),
              new EIXYPoint(0.30, 1.00),
              new EIXYPoint(0.40, 1.35),
              new EIXYPoint(0.50, 1.40),
              new EIXYPoint(0.60, 1.20),
              new EIXYPoint(0.70, 0.80),
              new EIXYPoint(0.80, 0.40),
              new EIXYPoint(0.90, 0.15),
              new EIXYPoint(1.00, 0.05)
            };
        break;

      case 3: // White — concentrated low–mid, smoother bell
        pts =
            new EIXYPoint[] {
              new EIXYPoint(0.00, 0.20),
              new EIXYPoint(0.10, 0.60),
              new EIXYPoint(0.20, 1.10),
              new EIXYPoint(0.30, 1.45),
              new EIXYPoint(0.40, 1.55),
              new EIXYPoint(0.50, 1.40),
              new EIXYPoint(0.60, 1.00),
              new EIXYPoint(0.70, 0.60),
              new EIXYPoint(0.80, 0.30),
              new EIXYPoint(0.90, 0.10),
              new EIXYPoint(1.00, 0.05)
            };
        break;

      case 4: // Other — bimodal rejection distribution
        pts =
            new EIXYPoint[] {
              new EIXYPoint(0.00, 0.15),
              new EIXYPoint(0.10, 0.50),
              new EIXYPoint(0.20, 0.90),
              new EIXYPoint(0.30, 1.10),
              new EIXYPoint(0.40, 0.95),
              new EIXYPoint(0.50, 0.80),
              new EIXYPoint(0.60, 1.00),
              new EIXYPoint(0.70, 1.20),
              new EIXYPoint(0.80, 0.80),
              new EIXYPoint(0.90, 0.35),
              new EIXYPoint(1.00, 0.10)
            };
        break;

      default:
        pts =
            new EIXYPoint[] {
              new EIXYPoint(0.0, 1.0) // trivial fallback
            };
        break;
    }

    return new ArrayList<>(Arrays.asList(pts));
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

  public Double getEAVSDataQualityScore(String fipsCode) {
    return jdbcTemplate.queryForObject(
        "select avg(missing_data_score) from eavs_data where state_id = ?",
        Double.class,
        Integer.parseInt(fipsCode, 10));
  }
}
