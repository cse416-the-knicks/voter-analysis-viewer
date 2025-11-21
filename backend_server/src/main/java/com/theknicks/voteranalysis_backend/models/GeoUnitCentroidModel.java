package com.theknicks.voteranalysis_backend.models;

/**
 * This retrieves the data for getting all the centroid information of the counties within a state
 * (if applicable)
 *
 * <p>NOTE(jerry): just like the GeoJson data it is read from a file.
 */
public record GeoUnitCentroidModel(
    String fullRegionId, String countyName, float centerX, float centerY) {
    public static GeoUnitCentroidModel fromDataRow(GeoUnitCentroidDataRowModel dataRow) {
        var jsonGeoPointData = dataRow.geomCenterJson();
        return new GeoUnitCentroidModel(
                dataRow.regionId(),
                dataRow.name(),
                1, 1
        );
    }
}
