package com.theknicks.voteranalysis_backend.services;

import com.theknicks.voteranalysis_backend.dao.IVoterEquipmentDAO;
import com.theknicks.voteranalysis_backend.models.VotingEquipmentModel;
import com.theknicks.voteranalysis_backend.models.VotingEquipmentUsageStatisticsModel;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.*;

/**
 * State Service layer,
 *
 * <p>Handles BusinessLogic for the State Controller, which currently means loading a GeoJSON file
 * and doing some preprocessing to return the exact stuff that we need to render.
 */
@Service
public class VoterEquipmentService {
  private final Logger logger = LoggerFactory.getLogger(VoterEquipmentService.class);
  private IVoterEquipmentDAO dao;

  public VoterEquipmentService(IVoterEquipmentDAO dao) {
    logger.info("Creating VoterEquipmentService...");
    this.dao = dao;
  }

  @Cacheable(value = "allVotingEquipment", key = "#stateFips.orElse('ALL')")
  public List<VotingEquipmentModel> getAllVotingEquipment(Optional<String> stateFips) {
    return dao.getAllVotingEquipment(stateFips);
  }

  @Cacheable(value = "equipmentByManufacturer", key = "#manufacturer")
  public List<VotingEquipmentModel> getAllVotingEquipmentByManufacturer(String manufacturer) {
    return dao.getVotingEquipmentByManufacturer(manufacturer);
  }

  @Cacheable(value = "usage", key = "{#year, #fipsCode}")
  public List<VotingEquipmentUsageStatisticsModel> getVotingEquipmentUsage(
      int year, String fipsCode) {
    return dao.getVotingEquipmentUsage(year, fipsCode);
  }

  @Cacheable(value = "detailedUsage", key = "{#fipsCode, #year, #inAggregate}")
  public List<VotingEquipmentUsageStatisticsModel> getDetailedVotingEquipmentUsage(
      String fipsCode, int year, boolean inAggregate) {

    if (inAggregate) {
      return dao.getVotingEquipmentUsage(year, fipsCode);
    }
    return dao.getDetailedVotingEquipmentUsage(year, fipsCode);
  }

  @Cacheable(value = "equipmentByType", key = "#type")
  public List<VotingEquipmentModel> getAllVotingEquipmentByType(String type) {
    return dao.getVotingEquipmentByType(type);
  }

  @Cacheable(value = "equipmentModel", key = "{#manufacturer, #model}")
  public Optional<VotingEquipmentModel> getVotingEquipment(String manufacturer, String model) {
    return dao.getVotingEquipmentModel(manufacturer, model);
  }
}
