package com.theknicks.voteranalysis_backend.models;

import com.theknicks.voteranalysis_backend.annotations.AutoSql;
import com.theknicks.voteranalysis_backend.annotations.SqlColumnName;
import com.theknicks.voteranalysis_backend.helpers.AutoSqlQueryable;

/**
 * This is the data required to fulfill use-case 7,
 * the voter registration count.
 * A1a/b/c
 */
@AutoSql(collection = "app.eavs_data")
public record VoterRegistrationStatisticsModel(
        @SqlColumnName(name="region_id", omitFromAggregate=true) String fullRegionId,
        String countyName,
        @SqlColumnName(name="total_registered") int total,
        @SqlColumnName(name="active_registered") int active,
        @SqlColumnName(name="inactive_registered") int inactive
) {
    public static class Queryable extends AutoSqlQueryable<VoterRegistrationStatisticsModel> {
        public Queryable() {
            super(VoterRegistrationStatisticsModel.class);
        }
    }
}
