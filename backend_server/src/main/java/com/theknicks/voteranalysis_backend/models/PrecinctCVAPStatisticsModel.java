package com.theknicks.voteranalysis_backend.models;

import com.theknicks.voteranalysis_backend.annotations.AutoSql;
import com.theknicks.voteranalysis_backend.annotations.SqlColumnName;
import com.theknicks.voteranalysis_backend.helpers.AutoSqlQueryable;

/**
 * This is slightly different from CVAPStatisticsModel as it does not include a region/county name.
 * Precincts are not named in an obvious way, and the join that the main version of the model does,
 * is not supported.
 */
@AutoSql(collection = "app.cvap_data")
public record PrecinctCVAPStatisticsModel(
    @SqlColumnName(name = "region_id") String fullRegionId,
    @SqlColumnName(name = "cvap_total") int cvapTotal,
    @SqlColumnName(name = "cvap_asian") int asianTotal,
    @SqlColumnName(name = "cvap_black") int blackTotal,
    @SqlColumnName(name = "cvap_hispanic") int hispanicTotal,
    @SqlColumnName(name = "cvap_white") int whiteTotal,
    @SqlColumnName(name = "cvap_other") int otherTotal) {
  public CVAPStatisticsModel toCVAPStatisticsModel() {
    return new CVAPStatisticsModel(
        fullRegionId(),
        "Precinct" + fullRegionId().substring(5),
        cvapTotal(),
        asianTotal(),
        blackTotal(),
        hispanicTotal(),
        whiteTotal(),
        otherTotal());
  }

  public static class Queryable extends AutoSqlQueryable<PrecinctCVAPStatisticsModel> {
    public Queryable() {
      super(PrecinctCVAPStatisticsModel.class);
    }
  }
}
