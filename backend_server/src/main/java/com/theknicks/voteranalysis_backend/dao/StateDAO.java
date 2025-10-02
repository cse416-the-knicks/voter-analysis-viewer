package com.theknicks.voteranalysis_backend.dao;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.ResultSet;
import java.util.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.theknicks.voteranalysis_backend.models.ProvisionalBallotStatisticsModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.*;

enum StateCsvRecordColumnId {
    STATE_NAME,
    COUNTY_NAME,
    STATE_FIPS,
    COUNTY_FIPS,
    COUNT
};

@Component
public class StateDAO implements IStateDAO {
    private static class InternalRowMapper implements RowMapper<ProvisionalBallotStatisticsModel> {
        private final Dictionary<String, String> _fipsToCountyNameMap;
        private final boolean _isInAggregate;

        public InternalRowMapper(
                Dictionary<String, String> fipsToCountyNameMap,
                boolean isInAggregate) {
            _fipsToCountyNameMap = fipsToCountyNameMap;
            _isInAggregate = isInAggregate;
        }

        public ProvisionalBallotStatisticsModel mapRow(
                ResultSet resultSet,
                int rowNumber) {
            try {
                String regionName;
                String regionCode;

                if (_isInAggregate) {
                    regionName = "Aggregate";
                    regionCode = "000000000";
                    return new ProvisionalBallotStatisticsModel(
                            regionCode,
                            regionName,
                            resultSet.getInt(1),
                            resultSet.getInt(2),
                            resultSet.getInt(3),
                            resultSet.getInt(4),
                            resultSet.getInt(5),
                            resultSet.getInt(6),
                            resultSet.getInt(7),
                            resultSet.getInt(8),
                            resultSet.getInt(9),
                            resultSet.getInt(10),
                            resultSet.getInt(11)
                    );
                } else {
                    regionCode = resultSet.getString("region_id");
                    regionName = _fipsToCountyNameMap.get(regionCode);
                    return new ProvisionalBallotStatisticsModel(
                            regionCode,
                            regionName,
                            resultSet.getInt("prov_cast"),
                            resultSet.getInt("prov_reason_not_in_roll"),
                            resultSet.getInt("prov_reason_no_id"),
                            resultSet.getInt("prov_reason_not_eligibe_official"),
                            resultSet.getInt("prov_reason_challenged"),
                            resultSet.getInt("prov_reason_wrong_precinct"),
                            resultSet.getInt("prov_reason_name_address"),
                            resultSet.getInt("prov_reason_mail_ballot_unsurrendered"),
                            resultSet.getInt("prov_reason_hours_extended"),
                            resultSet.getInt("prov_reason_same_day_reg"),
                            resultSet.getInt("prov_other")
                    );
                }
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        }
    }

    private final Logger _logger = LoggerFactory.getLogger(StateDAO.class);
    private final String preprocessedGeospatialPath = "../data_common/geospatial_processed/";
    private final String rawCsvPath = "../data_common/raw/";
    private final Dictionary<String, String> _fipsCodeToCountyNameMap;
    private final JdbcTemplate _jdbcTemplate;

    /*
        NOTE(jerry):
            If anyone has a better way of doing this without
            this much duplication please let me know...
     */
    private final String _baseQueryForProvisionalBallotData = """
    select
        region_id,
        prov_cast,
        prov_reason_not_in_roll,
        prov_reason_no_id,
        prov_reason_not_eligibe_official,
        prov_reason_challenged,
        prov_reason_wrong_precinct,
        prov_reason_name_address,
        prov_reason_mail_ballot_unsurrendered,
        prov_reason_hours_extended,
        prov_reason_same_day_reg,
        prov_other
    from app.eavs_data
    """;
    private final String _baseQueryForStateAggregatedBallotData = """
    select
        sum(prov_cast),
        sum(prov_reason_not_in_roll),
        sum(prov_reason_no_id),
        sum(prov_reason_not_eligibe_official),
        sum(prov_reason_challenged),
        sum(prov_reason_wrong_precinct),
        sum(prov_reason_name_address),
        sum(prov_reason_mail_ballot_unsurrendered),
        sum(prov_reason_hours_extended),
        sum(prov_reason_same_day_reg),
        sum(prov_other)
    from app.eavs_data
    """;

    public StateDAO(JdbcTemplate jdbcTemplate)
        throws IOException
    {
        _logger.info("Creating Concrete StateDAO");
        _logger.info(preprocessedGeospatialPath);
        _jdbcTemplate = jdbcTemplate;
        _fipsCodeToCountyNameMap = new Hashtable<String, String>();
        populateFipsCodeToCountyNameMapTable();
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

    public List<ProvisionalBallotStatisticsModel> getProvisionBallotRows(
            String fipsCode,
            boolean aggregated) {
        List<ProvisionalBallotStatisticsModel> result;
        String baseQuery;
        if (aggregated) {
            baseQuery = _baseQueryForStateAggregatedBallotData;
        } else {
            baseQuery = _baseQueryForProvisionalBallotData;
        }

        String sqlStatement = String.format("%s where substring(region_id, 1, 2) = ?",
                baseQuery);
        _logger.info(sqlStatement);
        result = _jdbcTemplate.query(
                sqlStatement,
                new InternalRowMapper(_fipsCodeToCountyNameMap, aggregated),
                fipsCode
        );
        return result;
    }

    public Optional<ProvisionalBallotStatisticsModel> getProvisionBallotRowByCounty(
            String fipsCode, String countyCode) {
        List<ProvisionalBallotStatisticsModel> queryResult;
        String sqlStatement = String.format("%s where region_id = ?",
                _baseQueryForProvisionalBallotData);
        _logger.info(sqlStatement);
        var fullPaddedFipsCode = fipsCode + countyCode + "00000";
        queryResult = _jdbcTemplate.query(
                sqlStatement,
                new InternalRowMapper(_fipsCodeToCountyNameMap, false),
                fullPaddedFipsCode
        );

        if (queryResult.isEmpty()) {
            return Optional.empty();
        } else {
            return Optional.of(queryResult.getFirst());
        }
    }

    private void populateFipsCodeToCountyNameMapTable() throws IOException {
        try (var fileLinesStream = Files.lines(Paths.get(rawCsvPath, "US_FIPS_Codes.csv"))) {
            var fileLines = fileLinesStream.toList();

            // First line is just headings...
            for (int i = 1; i < fileLines.size(); ++i) {
                var currentLine = fileLines.get(i);
                // NOTE(jerry): the negative limit is to allow for taking in the empty fields
                // appropriately.
                var splitLine = currentLine.split(",", -1);
                var _stateName = splitLine[StateCsvRecordColumnId.STATE_NAME.ordinal()]; // skip
                var countyName = splitLine[StateCsvRecordColumnId.COUNTY_NAME.ordinal()];
                var stateFips = splitLine[StateCsvRecordColumnId.STATE_FIPS.ordinal()];
                var countyFips = splitLine[StateCsvRecordColumnId.COUNTY_FIPS.ordinal()];
                var paddedFullFipsRegionCode = stateFips + countyFips + "00000";
                _fipsCodeToCountyNameMap.put(paddedFullFipsRegionCode, countyName);
            }
        } catch (IOException ex) {
            throw ex; // Propagate exception...
        }
    }
}
