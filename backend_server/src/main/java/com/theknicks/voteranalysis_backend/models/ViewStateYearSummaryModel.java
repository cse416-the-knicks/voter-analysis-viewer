package com.theknicks.voteranalysis_backend.models;

/**
 * "state_id"	"state_code"	"state_name"	"year"	"active_registered"	"inactive_registered"	"total_registered"	"total_ballots_cast"	"early_voting_total"	"ballots_by_mail"	"prov_cast"	"active_voter_rate"	"inactive_voter_rate"	"turnout_rate"	"early_share"	"mail_share"
 * 1	"AL"	"Alabama"	2024	3466606	401434	3868040	126018			13355	0.89621772267091343419	0.10378227732908656581	0.03257929080361113122
 */

import com.theknicks.voteranalysis_backend.annotations.AutoSql;
import com.theknicks.voteranalysis_backend.annotations.SqlColumnName;
import com.theknicks.voteranalysis_backend.helpers.AutoSqlQueryable;

/**
 * This is holds the data for GUI21, based off the view in the db.
 */
@AutoSql(view = "app.v_state_year_summary")
public record ViewStateYearSummaryModel(
        @SqlColumnName int stateFipsCode, // NOTE(jerry): unpadded. For some reason.
        @SqlColumnName String stateCode,
        @SqlColumnName String stateName,
        @SqlColumnName int forYear,
        @SqlColumnName int activeRegistered,
        @SqlColumnName int inactiveRegistered,
        @SqlColumnName int totalRegistered,
        @SqlColumnName int totalBallotsCast,
        @SqlColumnName int earlyVotingTotal,
        @SqlColumnName int ballotsByMail,
        @SqlColumnName int totalProvisionalBallotsCast,
        @SqlColumnName double activeVoterRate,
        @SqlColumnName double inactiveVoterRate,
        @SqlColumnName double turnOutRate,
        @SqlColumnName double earlyVotingShareRate,
        @SqlColumnName double mailinBallotVotingShareRate
) {
    public static class Queryable extends AutoSqlQueryable<ViewStateYearSummaryModel> {
        public Queryable() {
            super(ViewStateYearSummaryModel.class);
        }
    }
}
