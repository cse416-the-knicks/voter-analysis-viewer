package com.theknicks.voteranalysis_backend.dao;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.theknicks.voteranalysis_backend.helpers.AutoSqlQueryable;
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

@Component
public class StateDAO implements IStateDAO {
    private final Logger _logger = LoggerFactory.getLogger(StateDAO.class);
    private final String preprocessedGeospatialPath = "../data_common/geospatial_processed/";
    private final Path _localCsvDataPath = Paths.get("../data_common/raw/US_FIPS_Codes.csv");

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

    private <T> List<T> getStateDataRows(Class<T> type, String fipsCode, boolean aggregated) {
        var queryable = AutoSqlQueryable.findQueryableNested(type);
        assert queryable != null;
        return _jdbcTemplate.query(
                queryable.Query(aggregated) + " where substring(region_id, 1, 2) = ?",
                queryable.Mapper(new Object[] {_fipsCodeToCountyNameMap}, aggregated),
                fipsCode
        );
    }

    public <T> Optional<T> getStateDataRowByCounty(Class<T> type, String fipsCode, String countyCode) {
        var queryable = AutoSqlQueryable.findQueryableNested(type);
        var fullPaddedFipsCode = fipsCode + countyCode + "00000";
        assert queryable != null;
        var queryResult = (List<T>)_jdbcTemplate.query(
                queryable.Query(false) + " where region_id = ?",
                queryable.Mapper(new Object[] { _fipsCodeToCountyNameMap }, false),
                fullPaddedFipsCode
        );

        if (queryResult.isEmpty()) {
            return Optional.empty();
        } else {
            return Optional.of(queryResult.getFirst());
        }
    }

    public List<ProvisionalBallotStatisticsModel> getProvisionBallotRows(String fipsCode, boolean aggregated) {
        return getStateDataRows(ProvisionalBallotStatisticsModel.class, fipsCode, aggregated);
    }

    public Optional<ProvisionalBallotStatisticsModel> getProvisionBallotRowByCounty(
            String fipsCode, String countyCode) {
        return getStateDataRowByCounty(ProvisionalBallotStatisticsModel.class, fipsCode, countyCode);
    }

    public List<VoterRegistrationStatisticsModel> getVoterRegistrationRows(String fipsCode, boolean aggregated) {
        return getStateDataRows(VoterRegistrationStatisticsModel.class, fipsCode, aggregated);
    }

    public Optional<VoterRegistrationStatisticsModel> getVoterRegistrationRowByCounty(String fipsCode, String countyCode) {
        return getStateDataRowByCounty(VoterRegistrationStatisticsModel.class, fipsCode, countyCode);
    }

    public List<PollbookDeletionStatisticsModel> getPollbookDeletionRows(String fipsCode, boolean aggregated) {
        return getStateDataRows(PollbookDeletionStatisticsModel.class, fipsCode, aggregated);
    }

    public Optional<PollbookDeletionStatisticsModel> getPollbookDeletionRowByCounty(String fipsCode, String countyCode) {
        return getStateDataRowByCounty(PollbookDeletionStatisticsModel.class, fipsCode, countyCode);
    }

    public List<MailBallotRejectionStatisticsModel> getMailBallotRejectionRows(String fipsCode, boolean aggregated) {
        return getStateDataRows(MailBallotRejectionStatisticsModel.class, fipsCode, aggregated);
    }

    public Optional<MailBallotRejectionStatisticsModel> getMailBallotRejectionRowByCounty(String fipsCode, String countyCode) {
        return getStateDataRowByCounty(MailBallotRejectionStatisticsModel.class, fipsCode, countyCode);
    }

    private void populateFipsCodeToCountyNameMapTable() throws IOException {
        try (var fileLinesStream = Files.lines(_localCsvDataPath)) {
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
