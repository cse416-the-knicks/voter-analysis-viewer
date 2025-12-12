package com.theknicks.voteranalysis_backend.models;

import java.util.List;

public record EISampledCurveData(
    List<EIXYPoint> white,
    List<EIXYPoint> black,
    List<EIXYPoint> asian,
    List<EIXYPoint> hispanic,
    List<EIXYPoint> other) {
  public List<EIXYPoint> getRacialCurveSamples(int race) {
    switch (race) {
      case 0:
        return asian();
      case 1:
        return black();
      case 2:
        return hispanic();
      case 3:
        return white();
      default:
      case 4:
        return other();
    }
  }
}
