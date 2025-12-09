package com.theknicks.voteranalysis_backend.controllers;

import com.theknicks.voteranalysis_backend.models.VotingEquipmentModel;
import com.theknicks.voteranalysis_backend.models.VotingEquipmentUsageStatisticsModel;
import com.theknicks.voteranalysis_backend.services.VoterEquipmentService;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

/**
 * This controller services all the requests relating to voting equipment, which for now just
 * basically means we're just returning whatever data we have.
 *
 * <p>There could be more processing or request types, but I don't think we need anything more based
 * on the use-cases.
 */
@RestController
@RequestMapping("/votingequipment")
public class VoterEquipmentController {
  private final Logger logger = LoggerFactory.getLogger(VoterEquipmentController.class);
  private final VoterEquipmentService service;

  public VoterEquipmentController(VoterEquipmentService service) {
    logger.info("Created VoterEquipmentController.");
    this.service = service;
  }

  @GetMapping("/")
  public List<VotingEquipmentModel> getAllVotingEquipment(
      @RequestParam(value = "stateFips", defaultValue = "") String stateFips) {
    return service.getAllVotingEquipment(
        stateFips.isEmpty() ? Optional.empty() : Optional.of(stateFips));
  }

  @GetMapping("/by-manufacturer/{manufacturer}")
  public List<VotingEquipmentModel> getAllVotingEquipmentByManufacturer(
      @PathVariable("manufacturer") String manufacturer) {
    return service.getAllVotingEquipmentByManufacturer(manufacturer);
  }

  @GetMapping("/by-type/{type}")
  public List<VotingEquipmentModel> getAllVotingEquipmentByType(@PathVariable("type") String type) {
    return service.getAllVotingEquipmentByType(type);
  }

  @GetMapping("/{manufacturer}/{model}")
  public Optional<VotingEquipmentModel> getVotingEquipment(
      @PathVariable("manufacturer") String manufacturer, @PathVariable("model") String model) {
    return service.getVotingEquipment(manufacturer, model);
  }

  @GetMapping("/usages/")
  public List<VotingEquipmentUsageStatisticsModel> getVotingEquipmentUsage(
      @RequestParam(name = "year", defaultValue = "2024") int year) {
    return service.getVotingEquipmentUsage(year, "");
  }

  @GetMapping("/usages/{fipsCode}")
  public List<VotingEquipmentUsageStatisticsModel> getDetailedVotingEquipmentUsage(
      @PathVariable("fipsCode") String fipsCode,
      @RequestParam(name = "year", defaultValue = "2024") int year,
      @RequestParam(name = "aggregate", defaultValue = "false") boolean inAggregate) {
    return service.getDetailedVotingEquipmentUsage(fipsCode, year, inAggregate);
  }
}
