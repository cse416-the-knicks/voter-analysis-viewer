package com.theknicks.voteranalysis_backend.models;

import com.theknicks.voteranalysis_backend.annotations.AutoSql;
import com.theknicks.voteranalysis_backend.annotations.SqlColumnName;
import com.theknicks.voteranalysis_backend.helpers.AutoSqlQueryable;

/**
 * This holds part of the data for a geounit's core information
 * as defined by app.eavs_geounit table.
 *
 * This is only really needed to show the names of everything
 */
@AutoSql(collection = "app.eavs_geounit")
public record EAVSGeoUnitModel(
    @SqlColumnName(name = "eavs_unit_code", omitFromAggregate = true) String fullRegionId,
    @SqlColumnName(name = "name") String regionName) {
  public static class Queryable extends AutoSqlQueryable<EAVSGeoUnitModel> {
    public Queryable() {
      super(EAVSGeoUnitModel.class);
    }
  }
}
