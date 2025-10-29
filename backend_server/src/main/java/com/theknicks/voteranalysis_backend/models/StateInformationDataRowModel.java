package com.theknicks.voteranalysis_backend.models;

import com.theknicks.voteranalysis_backend.annotations.AutoSql;
import com.theknicks.voteranalysis_backend.annotations.SqlColumnName;
import com.theknicks.voteranalysis_backend.helpers.AutoSqlQueryable;

/**
 * This is the raw version of the data in the states table, some of the relevant data anyway.
 *
 * <p>This is processed into a StateInformationModel which is more strongly typed.
 */
@AutoSql(collection = "app.states")
public record StateInformationDataRowModel(
    @SqlColumnName int state_id,
    @SqlColumnName String name,
    @SqlColumnName String code,
    @SqlColumnName String registration_method,
    @SqlColumnName int felony_disenfranchisement,
    @SqlColumnName int population_total,
    @SqlColumnName int citizens_of_voting_age_population,
    @SqlColumnName int house_seats_rep,
    @SqlColumnName int house_seats_dem,
    @SqlColumnName String redistricting_control, // ?
    @SqlColumnName String dominant_party) {
  public static class Queryable extends AutoSqlQueryable<StateInformationDataRowModel> {
    public Queryable() {
      super(StateInformationDataRowModel.class);
    }
  }
}
