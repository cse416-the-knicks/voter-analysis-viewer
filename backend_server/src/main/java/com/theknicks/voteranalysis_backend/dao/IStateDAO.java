package com.theknicks.voteranalysis_backend.dao;

import com.google.gson.*;
/**
 * State Data Access Object Layer
 */
public interface IStateDAO {
    /**
     * This access point is meant to return the geometry boundary of a
     * state, along with some extra helper information to convey our use-case
     * for this state. Primarily information on what type of detail state it is.
     *
     * EX:
     * {
     *     detailType: VOTER_REGISTRATION,
     *     geoJson: ...
     * }
     *
     * {
     *     detailType: null, // or omitted.
     *     geoJson: ...
     * }
     *
     * @param fipsCode - A string for the fipsCode of the state.
     * @return GeoJSON object representing the boundaries of the state
     */
    JsonObject getGeometryBoundary(String fipsCode);
}
