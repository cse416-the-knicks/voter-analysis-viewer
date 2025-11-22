package com.theknicks.voteranalysis_backend.models;

import java.util.List;

/** This models the data required for GUI-16, color is decided on the frontend. */
public record VoterRegistrationHistoryGraphDataModel(
    String label, List<VoterRegistrationHistoryGraphDataModel.Point> points) {
  /**
   * This is an internal point model for the Voter Registration History graph
   *
   * @param x - String label corresponding for the county / geounit this point is for.
   * @param y - The voter registration count for the unit indicated by 'x'.
   */
  public record Point(String x, double y) {}
}
