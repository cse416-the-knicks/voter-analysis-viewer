package com.theknicks.voteranalysis_backend.models;

import com.theknicks.voteranalysis_backend.annotations.AutoSql;
import com.theknicks.voteranalysis_backend.annotations.SqlColumnName;
import com.theknicks.voteranalysis_backend.helpers.AutoSqlQueryable;

/*
    This holds the overall usage statistics of a voting equipment model
    category. (This is intended to be the participant of a list.)

    It is useful for GUI-12. and GUI-14.
 */
@AutoSql(
        collection = "equipment_usage",
        joining = {"device_model"},
        joinMethod = {"inner"},
        joinOn = {"equipment_usage.device_model_id = device_model.device_model_id"},
        groupBy = {"device_type"}
)
public record VotingEquipmentUsageStatisticsModel(
        @SqlColumnName(name="device_type") String deviceType,
        @SqlColumnName(name="count(distinct equipment_usage.region_id)") int uniqueModels,
        @SqlColumnName(name="sum(quantity)") int totalDevices
) {
    public static class Queryable extends AutoSqlQueryable<VotingEquipmentUsageStatisticsModel> {
        public Queryable() {
            super(VotingEquipmentUsageStatisticsModel.class);
        }
    }
}
