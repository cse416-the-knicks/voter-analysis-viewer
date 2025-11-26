package com.theknicks.voteranalysis_backend.models;

import com.theknicks.voteranalysis_backend.annotations.AutoSql;
import com.theknicks.voteranalysis_backend.annotations.SqlColumnName;
import com.theknicks.voteranalysis_backend.helpers.AutoSqlQueryable;

/**
 * This will hold information about CVAP based on the 2023 ACS data.
 *
 * <p>Might have to consider double-counting on accident.
 */
@AutoSql(
    collection = "app.cvap_data",
    joining = {"app.eavs_geounit"},
    joinMethod = {"inner"},
    joinOn = {"app.eavs_geounit.eavs_unit_code = app.cvap_data.region_id"})
public record CVAPStatisticsModel(
    @SqlColumnName(name = "cvap_data.region_id", omitFromAggregate = true) String fullRegionId,
    @SqlColumnName(name = "eavs_geounit.name", omitFromAggregate = true) String countyName,
    @SqlColumnName(name = "cvap_total") int cvapTotal,
    @SqlColumnName(name = "cvap_asian") int asianTotal,
    @SqlColumnName(name = "cvap_black") int blackTotal,
    @SqlColumnName(name = "cvap_hispanic") int hispanicTotal,
    @SqlColumnName(name = "cvap_white") int whiteTotal,
    @SqlColumnName(name = "cvap_other") int otherTotal) {
  public CVAPStatisticsModel(
      int cvapTotal,
      int asianTotal,
      int blackTotal,
      int hispanicTotal,
      int whiteTotal,
      int otherTotal) {
    this(
        "0000000000",
        "Aggregated",
        cvapTotal,
        asianTotal,
        blackTotal,
        hispanicTotal,
        whiteTotal,
        otherTotal);
  }

  public static class Queryable extends AutoSqlQueryable<CVAPStatisticsModel> {
    public Queryable() {
      super(CVAPStatisticsModel.class);
    }
  }
}
