package com.theknicks.voteranalysis_backend.models;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeType;

/**
 * This retrieves the data for getting all the centroid information of the counties within a state
 * (if applicable)
 *
 * <p>NOTE(jerry): just like the GeoJson data it is read from a file.
 */
public record GeoUnitCentroidModel(
    String fullRegionId, String countyName, float centerX, float centerY) {
  public static GeoUnitCentroidModel fromDataRow(GeoUnitCentroidDataRowModel dataRow) {
    float xCoordinate = Float.NaN;
    float yCoordinate = Float.NaN;

    try {
      var jsonGeoPointData = dataRow.geomCenterJson();
      var jsonNode = new ObjectMapper().readTree(jsonGeoPointData);
      var coordinatesArray = jsonNode.get("coordinates");
      assert coordinatesArray.getNodeType() == JsonNodeType.ARRAY;
      xCoordinate = (float) coordinatesArray.get(0).asDouble();
      yCoordinate = (float) coordinatesArray.get(1).asDouble();
    } catch (Exception e) {
      e.printStackTrace();
    }

    return new GeoUnitCentroidModel(dataRow.regionId(), dataRow.name(), xCoordinate, yCoordinate);
  }
}
