package com.theknicks.voteranalysis_backend.models;

import com.theknicks.voteranalysis_backend.annotations.AutoSql;
import com.theknicks.voteranalysis_backend.annotations.SqlColumnName;
import com.theknicks.voteranalysis_backend.helpers.AutoSqlQueryable;

/**
 * Similar to GeoUnitCentroidModel, but this is the raw copy that is retrieved from the database.
 *
 * <p>Needs to be converted into the regular GeoUnitCentroidModel
 */
@AutoSql(
    collection = "app.region_boundary",
    joining = {"app.eavs_geounit"},
    joinMethod = {"inner"},
    joinOn = {"eavs_geounit.eavs_unit_code = region_boundary.region_id"})
public record GeoUnitCentroidDataRowModel(
    @SqlColumnName(name = "region_boundary.region_id") String regionId,
    @SqlColumnName(name = "eavs_geounit.name") String name,
    @SqlColumnName(name = "geom_center") String geomCenterJson) {
  public static class Queryable extends AutoSqlQueryable<GeoUnitCentroidDataRowModel> {
    public Queryable() {
      super(GeoUnitCentroidDataRowModel.class);
    }
  }
}
