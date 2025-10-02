package com.theknicks.voteranalysis_backend.dao;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.theknicks.voteranalysis_backend.models.ProvisionalBallotStatisticsModel;
import com.theknicks.voteranalysis_backend.models.VotingEquipmentModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.*;
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
    private final String rawCsvPath = "../data_common/raw/";
    private final Dictionary<String, String> _fipsCodeToCountyNameMap;

    public StateDAO()
        throws IOException
    {
        _logger.info("Creating Concrete StateDAO");
        _logger.info(preprocessedGeospatialPath);

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

    public List<ProvisionalBallotStatisticsModel> getProvisionBallotRow(String fipsCode) {
        return List.of();
    }

    public Optional<ProvisionalBallotStatisticsModel> getProvisionBallotRowByCounty(String fipsCode, String countyCode) {
        return Optional.empty();
    }

    private Optional<String> entryOrNoneIfBlank(String s) {
        if (s.isEmpty()) {
            return Optional.empty();
        }

        return Optional.of(s);
    }

    private Optional<Boolean> tryParseBoolean(Optional<String> s) {
        if (s.isEmpty()) {
            return Optional.empty();
        }

        var val = s.get();
        _logger.info(val);
        if (val.equals("TRUE")) {
            return Optional.of(true);
        } else if (val.equals("FALSE")) {
            return Optional.of(false);
        }

        // Yes there's a difference between TRUE, FALSE, N/A
        return Optional.empty();
    }

    private Optional<Integer> tryParseYearFromString(Optional<String> s) {
        if (s.isEmpty()) {
            return Optional.empty();
        }

        try {
            var splitString = s.get().split("/", -1);
            // For most date formats, and certainly any American date format
            // the year is the last component of the date.
            //
            // This is nearly temporary code anyway.
            return Optional.of(Integer.parseInt(splitString[splitString.length-1]));
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return Optional.empty();
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
