package com.theknicks.voteranalysis_backend.models;

import java.util.List;

/**
 * This class is meant to support sortability for primarily DataTables on the frontend.
 *
 * <p>It is converted from an equivalent JSON object, and will act as a query modifier for
 * supporting endpoints.
 */
public record CollectionSortParamModel(List<CollectionSortParamFieldModel> fields) {}
