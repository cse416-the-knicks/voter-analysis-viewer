package com.theknicks.voteranalysis_backend.dao;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.theknicks.voteranalysis_backend.models.ProvisionalBallotStatisticsModel;

import java.util.*;

/**
 * State Data Access Object Layer
 */
public interface IStateDAO {
    /**
     * This access point is meant to return the geometry boundary of a
     * state.
     *
     * @param fipsCode - A string for the fipsCode of the state.
     * @return GeoJSON object representing the boundaries of the state
     */
    Optional<ObjectNode> getGeometryBoundary(String fipsCode);

    /**
     * This access point is meant to return the provisional ballots for all the
     * counties within a state.
     * @param fipsCode - A string for the fipsCode of the state.
     * @return a list of ProvisionalBallotStatisticsModels
     */
    List<ProvisionalBallotStatisticsModel> getProvisionBallotRow(String fipsCode);

    /**
     * This access point is meant to return the provisional ballots data for a specific county
     * within a state.
     * @param fipsCode - A string for the fipsCode of the state.
     * @param countyCode - A string for the fipsCode of the county.
     * @return a ProvisionalBallotStatisticModel if it exists, none otherwise.
     */
    Optional<ProvisionalBallotStatisticsModel> getProvisionBallotRowByCounty(String fipsCode, String countyCode);
}
