package com.theknicks.voteranalysis_backend.models;

import java.util.*;

/**
 * NOTE(jerry): This is the input parameter for our regression endpoint.
 *
 * <p>The reason it separates the components instead of using a specific object type for points in
 * the response, is for flexibility, and to avoid enforcing a specific points structure.
 *
 * <p>It is simpler to keep it like this instead of having an array of number[2] or an actual point
 * object.
 *
 * <p>That's my take on it anyway.
 */
public record RegressionDataParameterModel(int pointsCount, List<Double> xs, List<Double> ys) {}
