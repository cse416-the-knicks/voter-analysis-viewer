package com.theknicks.voteranalysis_backend.models;

import java.util.*;

public record RegressionDataParameterModel(
  int pointsCount,
  List<Double> xs,
  List<Double> ys
) {

}
