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
        public InternalRowMapper(Dictionary<String, String> fipsToCountyNameMap) {
            _fipsToCountyNameMap = fipsToCountyNameMap;
        }

        public ProvisionalBallotStatisticsModel mapRow(
                ResultSet resultSet,
                int rowNumber) {
            try {
                return new ProvisionalBallotStatisticsModel(
                        resultSet.getString("region_id"),
                        _fipsToCountyNameMap.get(resultSet.getString("region_id")),
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
            } catch (Exception e) {
                // NOTE(jerry): maybe not a good idea.
                return null;
            }
        }
    }

    private final Logger _logger = LoggerFactory.getLogger(StateDAO.class);
    private final String preprocessedGeospatialPath = "../data_common/geospatial_processed/";
    private final String rawCsvPath = "../data_common/raw/";
    private final Dictionary<String, String> _fipsCodeToCountyNameMap;
    private final JdbcTemplate _jdbcTemplate;

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

    private String _baseQueryForProvisionalBallotData = """
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
    from eavs_data
    """;

    public List<ProvisionalBallotStatisticsModel> getProvisionBallotRow(String fipsCode) {
        List<ProvisionalBallotStatisticsModel> result;
        String sqlStatement = String.format("%s where substring(region_id, 1, 3) = ?",
                _baseQueryForProvisionalBallotData);
        result = _jdbcTemplate.query(
                sqlStatement,
                new InternalRowMapper(_fipsCodeToCountyNameMap),
                fipsCode
        );
        return result;
    }

    public Optional<ProvisionalBallotStatisticsModel> getProvisionBallotRowByCounty(String fipsCode, String countyCode) {
        List<ProvisionalBallotStatisticsModel> queryResult;
        String sqlStatement = String.format("%s where region_id = ?",
                _baseQueryForProvisionalBallotData);
        var fullPaddedFipsCode = fipsCode + countyCode + "00000";
        queryResult = _jdbcTemplate.query(
                sqlStatement,
                new InternalRowMapper(_fipsCodeToCountyNameMap),
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
                _logger.info(paddedFullFipsRegionCode);
                _fipsCodeToCountyNameMap.put(paddedFullFipsRegionCode, countyName);
            }
        } catch (IOException ex) {
            throw ex; // Propagate exception...
        }
    }
}
