package com.theknicks.voteranalysis_backend.models;

import com.theknicks.voteranalysis_backend.annotations.AutoSql;
import com.theknicks.voteranalysis_backend.annotations.SqlColumnName;
import com.theknicks.voteranalysis_backend.helpers.AutoSqlQueryable;

/*
   This holds the overall usage statistics of a voting equipment model
   category. (This is intended to be the participant of a list.)

   It is useful for GUI-12. and GUI-14.

   This is the raw form that comes out of the SQL query and this is
   not suitable for tabulation without more aggregation work.
*/
@AutoSql(
    collection = "equipment_usage",
    joining = {"device_model", "eavs_geounit", "states"},
    joinMethod = {"inner", "inner", "inner"},
    joinOn = {
      "equipment_usage.device_model_id = device_model.device_model_id",
      "equipment_usage.region_id = eavs_geounit.eavs_unit_code",
      "equipment_usage.state_id = states.state_id"
    },
    groupBy = {
      "eavs_geounit.state_id",
      "eavs_geounit.region_id",
      "device_model.device_model_id",
      "states.name",
      "device_type",
      "certification"
    })
public record VotingEquipmentUsageStatisticsEntryModel(
    @SqlColumnName(name = "device_model.device_model_id") int deviceId,
    @SqlColumnName(name = "states.name") String stateName,
    @SqlColumnName(name = "eavs_geounit.state_id") int stateId,
    @SqlColumnName(name = "eavs_geounit.eavs_unit_code") String fullRegionId,
    @SqlColumnName(name = "eavs_geounit.name") String countyName,
    @SqlColumnName(name = "device_type") String deviceType,
    @SqlColumnName(name = "certification") String certification,
    // NOTE(jerry):
    // I think this query is incorrect, but fortunately it's not used anywhere
    // right now I don't remember why I put this or thought it would be helpful.
    @SqlColumnName(name = "count(distinct equipment_usage.region_id)") int uniqueModels,
    @SqlColumnName(name = "sum(quantity)") int totalDevices) {
  public static class Queryable extends AutoSqlQueryable<VotingEquipmentUsageStatisticsEntryModel> {
    public Queryable() {
      super(VotingEquipmentUsageStatisticsEntryModel.class);
    }
  }
}
