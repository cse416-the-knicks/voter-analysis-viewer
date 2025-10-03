package com.theknicks.voteranalysis_backend.models;

import com.theknicks.voteranalysis_backend.annotations.AutoSql;
import com.theknicks.voteranalysis_backend.annotations.SqlColumnName;
import com.theknicks.voteranalysis_backend.helpers.AutoSqlQueryable;

/**
 * This is all the data for mail ballot rejections (C9a->q)
 */
@AutoSql(collection="app.eavs_data")
public record MailBallotRejectionStatisticsModel(
        @SqlColumnName(name="region_id", omitFromAggregate = true) String fullRegionId,
        String countyName,
        @SqlColumnName(name="mail_reject_total") int rejectTotal,
        @SqlColumnName(name="mail_reject_late") int rejectLate,
        @SqlColumnName(name="mail_reject_no_sig") int rejectNoSignature,
        @SqlColumnName(name="mail_reject_no_witness_sig") int rejectNoWitnessSignature,
        @SqlColumnName(name="mail_reject_sig_mismatch") int rejectSignatureMismatch,
        @SqlColumnName(name="mail_reject_unofficial_env") int rejectUnofficialEnv,
        @SqlColumnName(name="mail_reject_ballot_missing") int rejectBallotMissing,
        @SqlColumnName(name="mail_reject_no_secrecy_env") int rejectNoSecrecyEnvironment,
        @SqlColumnName(name="mail_reject_multiple_in_env") int rejectMultipleInEnvironment, // Multiple ballots in one envelope
        @SqlColumnName(name="mail_reject_unsealed_env") int rejectUnsealedEnvironment,
        @SqlColumnName(name="mail_reject_no_postmark") int rejectNoPostMark,
        @SqlColumnName(name="mail_reject_no_address") int rejectNoAddress,
        @SqlColumnName(name="mail_reject_voter_deceased") int rejectVoterDeceased,
        @SqlColumnName(name="mail_reject_duplicate_vote") int rejectDuplicateVote,
        @SqlColumnName(name="mail_reject_missing_docs") int rejectMissingDocumentation,
        @SqlColumnName(name="mail_reject_not_eligible") int rejectNotEligible,
        @SqlColumnName(name="mail_reject_no_application") int rejectNoApplication,
        @SqlColumnName(name="mail_reject_other") int rejectOther
) {
    public static class Queryable extends AutoSqlQueryable<MailBallotRejectionStatisticsModel> {
        public Queryable() {
            super(MailBallotRejectionStatisticsModel.class);
        }
    }
}
