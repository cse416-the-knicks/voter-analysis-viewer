package com.theknicks.voteranalysis_backend.dao;

import com.theknicks.voteranalysis_backend.models.VotingEquipmentModel;
import com.theknicks.voteranalysis_backend.models.VotingEquipmentUsageStatisticsModel;
import java.util.*;

/** Voter Equipment Data Access Object Layer */
public interface IVoterEquipmentDAO {
  /**
   * NOTE(jerry): The Voter Equipment access points aren't particularly complicated as far as I can
   * tell based on the use-cases.
   *
   * <p>It's sufficient to do direct queries, but this might evolve based on how it seems the
   * Frontend might like to request the data.
   */
  List<VotingEquipmentModel> getAllVotingEquipment();

  List<VotingEquipmentModel> getVotingEquipmentByType(String type);

  List<VotingEquipmentModel> getVotingEquipmentByManufacturer(String manufacturer);

  List<VotingEquipmentUsageStatisticsModel> getVotingEquipmentUsage(int year, String fipsCode);

  List<VotingEquipmentUsageStatisticsModel> getDetailedVotingEquipmentUsage(
      int year, String fipsCode);

  /**
   * Get the information of a particular voting equipment machine by a manufacturer, and model
   * tuple.
   *
   * @param manufacturer - Manufacturer string. Full string
   * @param model - Model string. Full string
   * @return the information about that particular machine, or none if it doesn't exist.
   */
  Optional<VotingEquipmentModel> getVotingEquipmentModel(String manufacturer, String model);
}
