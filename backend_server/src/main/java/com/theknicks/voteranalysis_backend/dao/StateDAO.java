package com.theknicks.voteranalysis_backend.dao;

import java.io.*;
import java.util.*;
import java.nio.file.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.theknicks.voteranalysis_backend.helpers.*;
import com.theknicks.voteranalysis_backend.models.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.*;

enum StateCsvRecordColumnId {
    STATE_NAME,
    COUNTY_NAME,
    STATE_FIPS,
    COUNTY_FIPS,
    COUNT
};

enum CountyGeoUnitCsvRecordColumnId {
    STATE_FIPS,
    COUNTY_FIPS,
    CENTER_X,
    CENTER_Y,
    COUNT
};

@Component
public class StateDAO implements IStateDAO {
    private final Logger _logger = LoggerFactory.getLogger(StateDAO.class);
    private final String preprocessedGeospatialPath = "../data_common/geospatial_processed/";
    private final Path _localFipsCodeMappingCsvDataPath = Paths.get("../data_common/raw/US_FIPS_Codes.csv");
    private final Path _localCountyCentroidsCsvDataPath = Paths.get("../data_common/processed/county_centroids.csv");

    private final Dictionary<String, String> _fipsCodeToCountyNameMap;
    // TODO(jerry): replace Dictionary with Map, apparently Map is the new thing,
    // and Dictionary is outdated.
    private final Map<String, GeoUnitCentroidModel> _geoUnitCentroidMap;
    private final JdbcTemplate _jdbcTemplate;

    public StateDAO(JdbcTemplate jdbcTemplate)
        throws IOException
    {
        _logger.info("Creating Concrete StateDAO");
        _logger.info(preprocessedGeospatialPath);
        _jdbcTemplate = jdbcTemplate;
        _fipsCodeToCountyNameMap = new Hashtable<>();
	    _geoUnitCentroidMap = new HashMap<>();
         populateFipsCodeToCountyNameMapTable();
         populateGeoUnitCentroidTable();
    }

    public Optional<ObjectNode> getGeometryBoundary(String fipsCode) {
        var mapper = new ObjectMapper();
        _logger.info("Reading state with fips code: " + fipsCode);
        try (Reader reader = new FileReader(preprocessedGeospatialPath + "stateByFips/" + fipsCode + ".json")) {
	        var node = mapper.readValue(reader, ObjectNode.class);
            return Optional.of(node);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return Optional.empty();
    }

    private <T> List<T> getStateDataRows(Class<T> type, String fipsCode, int year, boolean aggregated) {
        var queryable = AutoSqlQueryable.findQueryableNested(type);
        assert queryable != null;
        return _jdbcTemplate.query(
                queryable.Query(aggregated) + " where substring(region_id, 1, 2) = ? and year = ?",
                queryable.Mapper(new Object[] {_fipsCodeToCountyNameMap}, aggregated),
                fipsCode, year
        );
    }

    public <T> Optional<T> getStateDataRowByCounty(Class<T> type, String fipsCode, String countyCode, int year) {
        var queryable = AutoSqlQueryable.findQueryableNested(type);
        var fullPaddedFipsCode = fipsCode + countyCode + "00000";
        assert queryable != null;
        var queryResult = (List<T>)_jdbcTemplate.query(
                queryable.Query(false) + " where region_id = ? and year = ?",
                queryable.Mapper(new Object[] { _fipsCodeToCountyNameMap }, false),
                fullPaddedFipsCode, year
        );

        return ListHelpers.getFirst(queryResult);
    }

    public List<ProvisionalBallotStatisticsModel> getProvisionBallotRows(String fipsCode, int year, boolean aggregated) {
        return getStateDataRows(ProvisionalBallotStatisticsModel.class, fipsCode, year, aggregated);
    }

    public Optional<ProvisionalBallotStatisticsModel> getProvisionBallotRowByCounty(String fipsCode, String countyCode, int year) {
        return getStateDataRowByCounty(ProvisionalBallotStatisticsModel.class, fipsCode, countyCode, year);
    }

    public List<VoterRegistrationStatisticsModel> getVoterRegistrationRows(String fipsCode, int year, boolean aggregated) {
        return getStateDataRows(VoterRegistrationStatisticsModel.class, fipsCode, year, aggregated);
    }

    public Optional<VoterRegistrationStatisticsModel> getVoterRegistrationRowByCounty(String fipsCode, String countyCode, int year) {
        return getStateDataRowByCounty(VoterRegistrationStatisticsModel.class, fipsCode, countyCode, year);
    }

    public List<PollbookDeletionStatisticsModel> getPollbookDeletionRows(String fipsCode, int year, boolean aggregated) {
        return getStateDataRows(PollbookDeletionStatisticsModel.class, fipsCode, year, aggregated);
    }

    public Optional<PollbookDeletionStatisticsModel> getPollbookDeletionRowByCounty(String fipsCode, String countyCode, int year) {
        return getStateDataRowByCounty(PollbookDeletionStatisticsModel.class, fipsCode, countyCode, year);
    }

    public List<MailBallotRejectionStatisticsModel> getMailBallotRejectionRows(String fipsCode, int year, boolean aggregated) {
        return getStateDataRows(MailBallotRejectionStatisticsModel.class, fipsCode, year, aggregated);
    }

    public Optional<MailBallotRejectionStatisticsModel> getMailBallotRejectionRowByCounty(String fipsCode, String countyCode, int year) {
        return getStateDataRowByCounty(MailBallotRejectionStatisticsModel.class, fipsCode, countyCode, year);
    }

    public List<BallotStatisticsModel> getBallotStatisticsRows(String fipsCode, int year) {
        return getStateDataRows(BallotStatisticsModel.class, fipsCode, year, false);
    }

    public Optional<BallotStatisticsModel> getBallotStatisticsRowByCounty(String fipsCode, String countyCode, int year) {
        return getStateDataRowByCounty(BallotStatisticsModel.class, fipsCode, countyCode, year);
    }

    public List<ViewStateYearSummaryModel> getStateYearSummaryRows(String fipsCode) {
        var queryable = AutoSqlQueryable.findQueryableNested(ViewStateYearSummaryModel.class);
        assert queryable != null;
        return _jdbcTemplate.query(
                queryable.Query() + " where state_id = ?",
                queryable.Mapper(),
                Integer.parseInt(fipsCode, 10)
        );
    }

    public Optional<ViewStateYearSummaryModel> getStateYearSummaryRowByYear(String fipsCode, int year) {
        var queryable = AutoSqlQueryable.findQueryableNested(ViewStateYearSummaryModel.class);
        assert queryable != null;
        return ListHelpers.getFirst(_jdbcTemplate.query(
                queryable.Query() + " where state_id = ? and year = ?",
                queryable.Mapper(),
                Integer.parseInt(fipsCode, 10),
                year
        ));
    }

    public Map<String, GeoUnitCentroidModel> getGeoUnitCentroids(String fipsCode) {
        var result = new HashMap<String, GeoUnitCentroidModel>();

        if (fipsCode.length() < 2) {
            fipsCode = "0" + fipsCode;
        }

        for (var key : _geoUnitCentroidMap.keySet()) {
            if (key.startsWith(fipsCode)) {
                result.put(key, _geoUnitCentroidMap.get(key));
            }
        }

	return result;
    }

    public List<StateInformationDataRowModel> getStateInformationDataRowModels() {
        var queryable = AutoSqlQueryable.findQueryableNested(StateInformationDataRowModel.class);
        assert queryable != null;
        return _jdbcTemplate.query(queryable.Query(), queryable.Mapper());
    }

    private String fullPaddedFips(String stateFips, String countyFips) {
	return stateFips + countyFips + "00000";
    }

    private void populateGeoUnitCentroidTable() throws IOException {
        CsvHelpers.Csv(_localCountyCentroidsCsvDataPath,
                   tokens -> {
                   var stateFips = tokens.get(CountyGeoUnitCsvRecordColumnId.STATE_FIPS.ordinal());
                   var countyFips = tokens.get(CountyGeoUnitCsvRecordColumnId.COUNTY_FIPS.ordinal());
                   var centerXString = tokens.get(CountyGeoUnitCsvRecordColumnId.CENTER_X.ordinal());
                   var centerYString = tokens.get(CountyGeoUnitCsvRecordColumnId.CENTER_Y.ordinal());
                   var fullRegionId = fullPaddedFips(stateFips, countyFips);
                   var countyName = _fipsCodeToCountyNameMap.get(fullRegionId);
                   _geoUnitCentroidMap.put(fullRegionId,
                               new GeoUnitCentroidModel(
                                   fullRegionId,
                                   countyName,
                                   Float.parseFloat(centerXString),
                                   Float.parseFloat(centerYString)
                               ));
                   }
        );
    }

    private void populateFipsCodeToCountyNameMapTable() throws IOException {
        CsvHelpers.Csv(_localFipsCodeMappingCsvDataPath,
                   tokens -> {
                   var _stateName = tokens.get(StateCsvRecordColumnId.STATE_NAME.ordinal()); // skip
                   var countyName = tokens.get(StateCsvRecordColumnId.COUNTY_NAME.ordinal());
                   var stateFips = tokens.get(StateCsvRecordColumnId.STATE_FIPS.ordinal());
                   var countyFips = tokens.get(StateCsvRecordColumnId.COUNTY_FIPS.ordinal());
                   _fipsCodeToCountyNameMap.put(fullPaddedFips(stateFips, countyFips), countyName);
                   }
        );
    }
}
