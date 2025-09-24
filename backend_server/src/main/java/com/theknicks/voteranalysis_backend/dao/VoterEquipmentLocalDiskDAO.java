package com.theknicks.voteranalysis_backend.dao;

import com.theknicks.voteranalysis_backend.models.VotingEquipmentModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
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

    public VoterEquipmentLocalDiskDAO()
            throws URISyntaxException, IOException
    {
        _logger.info("Creating VoterEquipmentDAO - LocalDisk Persistence");
        populateInternalList();
    }

    @Override
    public List<VotingEquipmentModel> getAllVotingEquipment() {
        return _equipmentList;
    }

    @Override
    public List<VotingEquipmentModel> getVotingEquipmentByType(String type) {
        return _equipmentList.stream().filter(
                (item) -> item.equipmentType().equals(type)
        ).toList();
    }

    @Override
    public List<VotingEquipmentModel> getVotingEquipmentByManufacturer(String manufacturer) {
        return _equipmentList.stream().filter(
                (item) -> item.manufacturer().equals(manufacturer)
        ).toList();
    }

    @Override
    public Optional<VotingEquipmentModel> getVotingEquipmentModel(String manufacturer, String model) {
        for (var machine : getAllVotingEquipment()) {
            if (machine.manufacturer().equals(manufacturer)) {
                if (machine.modelName().equals(model)) {
                    return Optional.of(machine);
                }
            }
        }

        return Optional.empty();
    }

    private Optional<String> entryOrNoneIfBlank(String s) {
        if (s.isEmpty()) {
            return Optional.empty();
        }

        return Optional.of(s);
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
                        entryOrNoneIfBlank(splitLine[CsvRecordColumnId.FIRST_MANUFACTURED.ordinal()]),
                        entryOrNoneIfBlank(splitLine[CsvRecordColumnId.LAST_MANUFACTURED.ordinal()]),
                        entryOrNoneIfBlank(splitLine[CsvRecordColumnId.OS.ordinal()]),
                        entryOrNoneIfBlank(splitLine[CsvRecordColumnId.FIRMWARE_VERSION.ordinal()]),
                        entryOrNoneIfBlank(splitLine[CsvRecordColumnId.VVPAT.ordinal()]),
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
