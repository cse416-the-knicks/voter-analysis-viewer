package com.theknicks.voteranalysis_backend.dao;

import static com.theknicks.voteranalysis_backend.helpers.CsvHelpers.*;

import com.theknicks.voteranalysis_backend.models.VotingEquipmentModel;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class VoterEquipmentDAO implements IVoterEquipmentDAO {
  private final Logger _logger = LoggerFactory.getLogger(VoterEquipmentLocalDiskDAO.class);

  public VoterEquipmentDAO() throws IOException {
    _logger.info("Creating VoterEquipmentDAO - JDBC Persistence");
  }

  @Override
  public List<VotingEquipmentModel> getAllVotingEquipment() {
    return List.of();
  }

  @Override
  public List<VotingEquipmentModel> getVotingEquipmentByType(String type) {
    return List.of();
  }

  @Override
  public List<VotingEquipmentModel> getVotingEquipmentByManufacturer(String manufacturer) {
    return List.of();
  }

  @Override
  public Optional<VotingEquipmentModel> getVotingEquipmentModel(String manufacturer, String model) {
    return Optional.empty();
  }
}
