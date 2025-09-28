package com.theknicks.voteranalysis_backend.dao;

import com.theknicks.voteranalysis_backend.models.VotingEquipmentModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

enum CsvRecordColumnId {
    MANUFACTURER,
    EQUIPMENT_TYPE,
    MODEL_NAME,
    FIRST_MANUFACTURED,
    LAST_MANUFACTURED,
    OS,
    FIRMWARE_VERSION,
    BATTERY_LIFE,
    SCANNING_RATE,
    VVPAT,
    PAPER_CAPACITY,
    CERTIFICATION_LEVEL,
    SECURITY_RISKS,
    NOTES_MISC,
    DISCONTINUED,
    COUNT
};


/**
 * NOTE(jerry):
 * This is the first practical use of the DAO pattern being necessary, because
 * I'm not sure if we're moving this into an actual DB or not.
 *
 * For now, this DAO will access the /data_common/raw/voting_machine_data.csv file.
 */
@Component
public class VoterEquipmentLocalDiskDAO implements IVoterEquipmentDAO {
    private final Path _localCsvDataPath = Paths.get("../data_common/raw/voting_machine_data.csv");
    private final Logger _logger = LoggerFactory.getLogger(VoterEquipmentLocalDiskDAO.class);
    private final List<VotingEquipmentModel> _equipmentList = new ArrayList<>();
    private final VoterEquipmentInMemoryDAO _inMemoryDAO;

    public VoterEquipmentLocalDiskDAO()
            throws IOException
    {
        _logger.info("Creating VoterEquipmentDAO - LocalDisk Persistence");
        populateInternalList();
        _inMemoryDAO = new VoterEquipmentInMemoryDAO(_equipmentList);
    }

    @Override
    public List<VotingEquipmentModel> getAllVotingEquipment() {
        return _inMemoryDAO.getAllVotingEquipment();
    }

    @Override
    public List<VotingEquipmentModel> getVotingEquipmentByType(String type) {
        return _inMemoryDAO.getVotingEquipmentByType(type);
    }

    @Override
    public List<VotingEquipmentModel> getVotingEquipmentByManufacturer(String manufacturer) {
        return _inMemoryDAO.getVotingEquipmentByManufacturer(manufacturer);
    }

    @Override
    public Optional<VotingEquipmentModel> getVotingEquipmentModel(String manufacturer, String model) {
        return _inMemoryDAO.getVotingEquipmentModel(manufacturer, model);
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

    private void populateInternalList() throws IOException {
        _logger.info("Populating internal equipment database for faster querying.");
        try (var fileLinesStream = Files.lines(_localCsvDataPath)) {
            var fileLines = fileLinesStream.toList();

            // First line is just headings...
            for (int i = 1; i < fileLines.size(); ++i) {
                var currentLine = fileLines.get(i);
                // NOTE(jerry): the negative limit is to allow for taking in the empty fields
                // appropriately.
                var splitLine = currentLine.split(",", -1);
                var newMachine = new VotingEquipmentModel(
                        splitLine[CsvRecordColumnId.MANUFACTURER.ordinal()],
                        splitLine[CsvRecordColumnId.EQUIPMENT_TYPE.ordinal()],
                        splitLine[CsvRecordColumnId.MODEL_NAME.ordinal()],
                        tryParseBoolean(entryOrNoneIfBlank(splitLine[CsvRecordColumnId.DISCONTINUED.ordinal()])),
                        tryParseYearFromString(entryOrNoneIfBlank(splitLine[CsvRecordColumnId.FIRST_MANUFACTURED.ordinal()])),
                        tryParseYearFromString(entryOrNoneIfBlank(splitLine[CsvRecordColumnId.LAST_MANUFACTURED.ordinal()])),
                        entryOrNoneIfBlank(splitLine[CsvRecordColumnId.OS.ordinal()]),
                        entryOrNoneIfBlank(splitLine[CsvRecordColumnId.FIRMWARE_VERSION.ordinal()]),
                        tryParseBoolean(entryOrNoneIfBlank(splitLine[CsvRecordColumnId.VVPAT.ordinal()])),
                        entryOrNoneIfBlank(splitLine[CsvRecordColumnId.CERTIFICATION_LEVEL.ordinal()]),
                        entryOrNoneIfBlank(splitLine[CsvRecordColumnId.SECURITY_RISKS.ordinal()])
                );
                _equipmentList.add(newMachine);
            }
        } catch (IOException ex) {
            throw ex; // Propagate exception...
        }
    }
}
