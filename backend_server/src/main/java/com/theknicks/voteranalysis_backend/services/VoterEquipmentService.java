package com.theknicks.voteranalysis_backend.services;

import com.theknicks.voteranalysis_backend.dao.IVoterEquipmentDAO;
import com.theknicks.voteranalysis_backend.models.VotingEquipmentModel;
import java.util.*;

import com.theknicks.voteranalysis_backend.models.VotingEquipmentUsageStatisticsModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.*;

/**
 * State Service layer,
 *
 * <p>Handles BusinessLogic for the State Controller, which currently means loading a GeoJSON file
 * and doing some preprocessing to return the exact stuff that we need to render.
 */
@Service
public class VoterEquipmentService {
  private final Logger _logger = LoggerFactory.getLogger(VoterEquipmentService.class);
  private IVoterEquipmentDAO _dao;

  public VoterEquipmentService(IVoterEquipmentDAO dao) {
    _logger.info("Creating VoterEquipmentService...");
    _dao = dao;
  }

  public List<VotingEquipmentModel> getAllVotingEquipment() {
    return _dao.getAllVotingEquipment();
  }

  public List<VotingEquipmentModel> getAllVotingEquipmentByManufacturer(String manufacturer) {
    return _dao.getVotingEquipmentByManufacturer(manufacturer);
  }

  public List<VotingEquipmentUsageStatisticsModel> getVotingEquipmentUsage(String fipsCode) {
    return _dao.getVotingEquipmentUsage(fipsCode);
  }

  public List<VotingEquipmentModel> getAllVotingEquipmentByType(String type) {
    return _dao.getVotingEquipmentByType(type);
  }

  public Optional<VotingEquipmentModel> getVotingEquipment(String manufacturer, String model) {
    return _dao.getVotingEquipmentModel(manufacturer, model);
  }
}
