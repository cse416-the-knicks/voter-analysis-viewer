package com.theknicks.voteranalysis_backend.models;

import com.theknicks.voteranalysis_backend.annotations.AutoSql;
import com.theknicks.voteranalysis_backend.annotations.SqlColumnName;
import com.theknicks.voteranalysis_backend.helpers.AutoSqlQueryable;

/**
 * This is the data for pollbook deletions (A12a->h)
 */
@AutoSql(collection = "app.eavs_data")
public record PollbookDeletionStatisticsModel(
        @SqlColumnName(name="region_id", omitFromAggregate = true) String fullRegionId,
        String countyName,
        @SqlColumnName(name="total_removed") int totalRemoved,
        @SqlColumnName(name="removed_moved") int removedReasonMoved,
        @SqlColumnName(name="removed_deceased") int removedReasonDeceased,
        @SqlColumnName(name="removed_felony") int removedReasonFelony,
        @SqlColumnName(name="removed_failed_confirm") int removedReasonFailedToConfirm,
        @SqlColumnName(name="removed_incompetent") int removedReasonIncompetent,
        @SqlColumnName(name="removed_requested") int removedReasonRequested,
        @SqlColumnName(name="removed_duplicate") int removedReasonDuplicate,
        @SqlColumnName(name="removed_other") int removedOther
) {
    public static class Queryable extends AutoSqlQueryable<PollbookDeletionStatisticsModel> {
        public Queryable() {
            super(PollbookDeletionStatisticsModel.class);
        }
    }
}
