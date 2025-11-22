package com.theknicks.voteranalysis_backend.models;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/*
   This is similar to VotingEquipmentUsageStatisticsEntryModel but is
   formatted in such a way that it is suitable for tabulation (and state
   analysis.)

   TODO(jerry): rename some stuff to be more general, this needs to be shared
   for the total aggregate (of the state), and per county.
*/
public record VotingEquipmentUsageStatisticsModel(
    String stateName,
    int stateId,
    int dreNoVvpatTotal,
    int dreVvpatTotal,
    int bmdTotal,
    int scannerTotal) {
  public static List<VotingEquipmentUsageStatisticsModel> fromDataRows(
      List<VotingEquipmentUsageStatisticsEntryModel> rows) {
    var statisticsRows = new ArrayList<VotingEquipmentUsageStatisticsModel>();
    var dataByStates =
        rows.stream()
            .collect(Collectors.groupingBy(VotingEquipmentUsageStatisticsEntryModel::stateId));

    // Classification sorting...
    for (var state : dataByStates.keySet()) {
      var dataRowsPerState = dataByStates.get(state);
      var hasVvpat = false;
      var dreCount = 0;
      var dreVvpatCount = 0;
      var bmdCount = 0;
      var scannerCount = 0;
      var stateName = "";

      for (var entry : dataRowsPerState) {
        if (stateName.isEmpty()) {
          stateName = entry.stateName();
        }

        assert entry.deviceType() != null;
        if (entry.certification() != null && entry.certification().contains("VVPAT")
            || entry.deviceType().contains("VVPAT")) {
          hasVvpat = true;
        }

        int deviceCount = entry.totalDevices();
        switch (entry.deviceType()) {
          case "DRE Dial":
          case "DRE with VVPAT":
          case "DRE Touchscreen":
          case "DRE Push Button":
            if (hasVvpat) {
              dreVvpatCount += deviceCount;
            } else {
              dreCount += deviceCount;
            }
            break;
          case "Hybrid Optical Scanner/BMD":
            // NOTE(jerry): intentional fall-through.
            bmdCount += deviceCount;
          case "Batch-Fed Optical Scanner":
          case "Scanner":
          case "Hand-Fed Optical Scanner":
          case "Batch-Fed Optical Scan Tabulator":
            scannerCount += deviceCount;
            break;
          case "BMD/Tabulator":
          case "BMD":
          case "Ballot Marking Device":
            bmdCount += deviceCount;
            break;
        }
      }
      statisticsRows.add(
          new VotingEquipmentUsageStatisticsModel(
              stateName, state, dreCount, dreVvpatCount, bmdCount, scannerCount));
    }

    return statisticsRows;
  }

  public static List<VotingEquipmentUsageStatisticsModel> fromDataRowsPerCounty(
      List<VotingEquipmentUsageStatisticsEntryModel> rows) {
    var statisticsRows = new ArrayList<VotingEquipmentUsageStatisticsModel>();
    var dataByStates =
        rows.stream()
            .collect(Collectors.groupingBy(VotingEquipmentUsageStatisticsEntryModel::stateId));

    // Classification sorting...
    for (var state : dataByStates.keySet()) {
      var dataRowsPerState = dataByStates.get(state);
      var hasVvpat = false;
      var dreCount = 0;
      var dreVvpatCount = 0;
      var bmdCount = 0;
      var scannerCount = 0;
      var stateName = "";

      for (var entry : dataRowsPerState) {
        if (stateName.isEmpty()) {
          stateName = entry.stateName();
        }

        assert entry.deviceType() != null;
        if (entry.certification() != null && entry.certification().contains("VVPAT")
            || entry.deviceType().contains("VVPAT")) {
          hasVvpat = true;
        }

        int deviceCount = entry.totalDevices();
        switch (entry.deviceType()) {
          case "DRE Dial":
          case "DRE with VVPAT":
          case "DRE Touchscreen":
          case "DRE Push Button":
            if (hasVvpat) {
              dreVvpatCount += deviceCount;
            } else {
              dreCount += deviceCount;
            }
            break;
          case "Hybrid Optical Scanner/BMD":
            // NOTE(jerry): intentional fall-through.
            bmdCount += deviceCount;
          case "Batch-Fed Optical Scanner":
          case "Scanner":
          case "Hand-Fed Optical Scanner":
          case "Batch-Fed Optical Scan Tabulator":
            scannerCount += deviceCount;
            break;
          case "BMD/Tabulator":
          case "BMD":
          case "Ballot Marking Device":
            bmdCount += deviceCount;
            break;
        }
      }
      statisticsRows.add(
          new VotingEquipmentUsageStatisticsModel(
              stateName, state, dreCount, dreVvpatCount, bmdCount, scannerCount));
    }

    return statisticsRows;
  }
}
