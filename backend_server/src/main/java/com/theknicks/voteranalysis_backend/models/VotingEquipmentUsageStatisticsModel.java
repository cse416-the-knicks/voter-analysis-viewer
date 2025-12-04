package com.theknicks.voteranalysis_backend.models;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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
    String fullRegionId,
    String countyName,
    int dreNoVvpatTotal,
    int dreVvpatTotal,
    int bmdTotal,
    int scannerTotal,
    int averageAge,
    double averageQualityScore) {
  private static VotingEquipmentUsageStatisticsModel aggregateEquipmentCounts(
      List<VotingEquipmentUsageStatisticsEntryModel> entries,
      Map<Integer, Optional<Integer>> deviceAgeMap,
      Map<Integer, Optional<Double>> deviceQualityMap) {
    var stateName = "";
    var fullRegionId = "";
    var countyName = "";
    var dreCount = 0;
    var dreVvpatCount = 0;
    var bmdCount = 0;
    var scannerCount = 0;

    // Used for calculating average age.
    var totalDeviceCount = 0;
    var totalYears = 0;
    var totalQualityScore = 0.0;

    for (var entry : entries) {
      if (stateName.isEmpty()) {
        stateName = entry.stateName();
      }

      if (fullRegionId.isEmpty()) {
        fullRegionId = entry.fullRegionId();
      }

      if (countyName.isEmpty()) {
        countyName = entry.countyName();
      }

      var hasVvpat = false;

      assert entry.deviceType() != null;
      if (entry.certification() != null && entry.certification().contains("VVPAT")
          || entry.deviceType().contains("VVPAT")) {
        hasVvpat = true;
      }

      int deviceCount = entry.totalDevices();
      var deviceAge = deviceAgeMap.get(entry.deviceId());
      var deviceQuality = deviceQualityMap.get(entry.deviceId());

      // If the device doesn't have an age, we don't want
      // to impute it as zero to drag anything down. We'll
      // just not count it for the sake of keeping the average
      // integrity.
      if (deviceAge.isPresent()) {
        totalDeviceCount += deviceCount;
        totalYears += deviceAge.get() * deviceCount;
        totalQualityScore += deviceQuality.get() * deviceCount;
      }

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

    return new VotingEquipmentUsageStatisticsModel(
        stateName,
        0,
        fullRegionId,
        countyName,
        dreCount,
        dreVvpatCount,
        bmdCount,
        scannerCount,
        totalYears / totalDeviceCount,
        totalQualityScore / totalDeviceCount
        );
  }

  public static List<VotingEquipmentUsageStatisticsModel> fromDataRows(
      List<VotingEquipmentUsageStatisticsEntryModel> rows,
      Map<Integer, Optional<Integer>> deviceAgeMap,
      Map<Integer, Optional<Double>> deviceQualityMap) {
    var statisticsRows = new ArrayList<VotingEquipmentUsageStatisticsModel>();
    var dataByStates =
        rows.stream()
            .collect(Collectors.groupingBy(VotingEquipmentUsageStatisticsEntryModel::stateId));

    // Classification sorting...
    for (var state : dataByStates.keySet()) {
      var dataRowsPerState = dataByStates.get(state);
      var aggregated = aggregateEquipmentCounts(dataRowsPerState, deviceAgeMap, deviceQualityMap);
      statisticsRows.add(
          new VotingEquipmentUsageStatisticsModel(
              aggregated.stateName(),
              state,
              "0000000000",
              "Aggregated",
              aggregated.dreNoVvpatTotal(),
              aggregated.dreVvpatTotal(),
              aggregated.bmdTotal(),
              aggregated.scannerTotal(),
              aggregated.averageAge(),
              aggregated.averageQualityScore()));
    }

    return statisticsRows;
  }

  public static List<VotingEquipmentUsageStatisticsModel> fromDataRowsPerCounty(
      List<VotingEquipmentUsageStatisticsEntryModel> rows,
      Map<Integer, Optional<Integer>> deviceAgeMap,
      Map<Integer, Optional<Double>> deviceQualityMap) {
    var statisticsRows = new ArrayList<VotingEquipmentUsageStatisticsModel>();
    var dataByStates =
        rows.stream()
            .collect(Collectors.groupingBy(VotingEquipmentUsageStatisticsEntryModel::stateId));

    for (var state : dataByStates.keySet()) {
      var dataRowsPerState = dataByStates.get(state);
      var dataByCounties =
          rows.stream()
              .collect(
                  Collectors.groupingBy(VotingEquipmentUsageStatisticsEntryModel::fullRegionId));

      for (var county : dataByCounties.keySet()) {
        var countyData = dataByCounties.get(county);
        var aggregated = aggregateEquipmentCounts(countyData, deviceAgeMap, deviceQualityMap);
        statisticsRows.add(
            new VotingEquipmentUsageStatisticsModel(
                aggregated.stateName(),
                state,
                aggregated.fullRegionId(),
                aggregated.countyName(),
                aggregated.dreNoVvpatTotal(),
                aggregated.dreVvpatTotal(),
                aggregated.bmdTotal(),
                aggregated.scannerTotal(),
                aggregated.averageAge(),
                aggregated.averageQualityScore()));
      }
    }

    return statisticsRows;
  }
}
