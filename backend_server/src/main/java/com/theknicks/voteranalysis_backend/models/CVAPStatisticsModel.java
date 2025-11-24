package com.theknicks.voteranalysis_backend.models;

import com.theknicks.voteranalysis_backend.helpers.AutoSqlQueryable;

/**
 * This will hold information about CVAP based on the 2023 ACS data.
 *
 * <p>Might have to consider double-counting on accident.
 */

// TODO(jerry):
// Which collection does this stuff belong to?
public record CVAPStatisticsModel(
    String fullRegionId,
    String regionName,
    int asianTotal,
    int africanAmericanTotal,
    int hispanicTotal,
    int whiteTotal,
    int nativeAmericanTotal,
    int otherTotal) {
  public CVAPStatisticsModel(
      int asianTotal,
      int africanAmericanTotal,
      int hispanicTotal,
      int whiteTotal,
      int nativeAmericanTotal,
      int otherTotal) {
    this(
        "0000000000",
        "Aggregated",
        asianTotal,
        africanAmericanTotal,
        hispanicTotal,
        whiteTotal,
        nativeAmericanTotal,
        otherTotal);
  }

  public static class Queryable extends AutoSqlQueryable<CVAPStatisticsModel> {
    public Queryable() {
      super(CVAPStatisticsModel.class);
    }
  }
}
