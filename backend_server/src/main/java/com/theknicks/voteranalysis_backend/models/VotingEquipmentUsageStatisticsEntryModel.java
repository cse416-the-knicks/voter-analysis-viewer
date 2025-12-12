package com.theknicks.voteranalysis_backend.models;

import com.theknicks.voteranalysis_backend.annotations.AutoSql;
import com.theknicks.voteranalysis_backend.annotations.SqlColumnName;
import com.theknicks.voteranalysis_backend.enums.VoterEquipmentType;
import com.theknicks.voteranalysis_backend.helpers.AutoSqlQueryable;
import java.util.List;
import java.util.Optional;

/*
   This holds the overall usage statistics of a voting equipment model
   category. (This is intended to be the participant of a list.)

   It is useful for GUI-12. and GUI-14.

   This is the raw form that comes out of the SQL query and this is
   not suitable for tabulation without more aggregation work.
*/
@AutoSql(
    collection = "eavs_geounit",
    joining = {"states", "equipment_usage", "device_model"},
    joinMethod = {"inner", "left", "left"},
    joinOn = {
      "states.state_id = eavs_geounit.state_id",
      "equipment_usage.state_id = states.state_id and (year = ?)",
      "device_model.device_model_id = equipment_usage.device_model_id"
    },
    groupBy = {
      "eavs_geounit.state_id",
      "eavs_geounit.region_id",
            "eavs_geounit.name",
      "device_model.device_model_id",
      "states.name",
      "device_type",
      "certification"
    })
public record VotingEquipmentUsageStatisticsEntryModel(
    @SqlColumnName(name = "device_model.device_model_id") Optional<Integer> deviceId,
    @SqlColumnName(name = "states.name") String stateName,
    @SqlColumnName(name = "eavs_geounit.state_id") int stateId,
    @SqlColumnName(name = "eavs_geounit.eavs_unit_code") String fullRegionId,
    @SqlColumnName(name = "eavs_geounit.name") String countyName,
    @SqlColumnName(name = "device_type") Optional<String> deviceType,
    @SqlColumnName(name = "certification") Optional<String> certification,
    // currently DNE
    /*@SqlColumnName(name = "device_model.vvpat")*/ Optional<Boolean> hasVvpat,
    @SqlColumnName(name = "coalesce(sum(equipment_usage.quantity), 0)") int totalDevices,
    List<VoterEquipmentType> types) {
  public VotingEquipmentUsageStatisticsEntryModel(
      Optional<Integer> deviceId,
      String stateName,
      int stateId,
      String fullRegionId,
      String countyName,
      Optional<String> deviceType,
      Optional<String> certification,
      int totalDevices) {
    this(
        deviceId,
        stateName,
        stateId,
        fullRegionId,
        countyName,
        deviceType,
        certification,
        Optional.of(false),
        totalDevices,
            (deviceType.isPresent()) ? VoterEquipmentType.determineClass(deviceType.get(), false) : List.of()
        );
  }

  public static class Queryable extends AutoSqlQueryable<VotingEquipmentUsageStatisticsEntryModel> {
    public Queryable() {
      super(VotingEquipmentUsageStatisticsEntryModel.class);
    }
  }
}
