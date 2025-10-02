package com.theknicks.voteranalysis_backend.dao;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.theknicks.voteranalysis_backend.models.ProvisionalBallotStatisticsModel;
import com.theknicks.voteranalysis_backend.models.VoterRegistrationStatisticsModel;

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
     * @param aggregated - A boolean asking whether to aggregate the result, will return a list of one in that case.
     * @return a list of ProvisionalBallotStatisticsModels, or a single model containing the aggregate for the state.
     */
    List<ProvisionalBallotStatisticsModel> getProvisionBallotRows(String fipsCode, boolean aggregated);

    /**
     * This access point is meant to return the provisional ballots data for a specific county
     * within a state.
     * @param fipsCode - A string for the fipsCode of the state.
     * @param countyCode - A string for the fipsCode of the county.
     * @return a ProvisionalBallotStatisticModel if it exists, none otherwise.
     */
    Optional<ProvisionalBallotStatisticsModel> getProvisionBallotRowByCounty(String fipsCode, String countyCode);

    /**
     * This access point is meant to return the voter registration information of a state by county,
     * allowing for the choice of aggregating to get a whole state count.
     * @param fipsCode - A string for the fipsCode of the state.
     * @param aggregated - A boolean asking whether to aggregate the result, will return a list of one in that case.
     * @return a list of VoterRegistrationStatisticModels, or a single model containing the aggregate for the state.
     */
    List<VoterRegistrationStatisticsModel> getVoterRegistrationRows(String fipsCode, boolean aggregated);

    /**
     * This access point is meant to return the voter registration information of a specific county within
     * a state.
     * @param fipsCode - A string for the fipsCode of the state.
     * @param countyCode - A string for the fipsCode of the county.
     * @return a VoterRegistrationStatisticsModel if it exists, none otherwise.
     */
    Optional<VoterRegistrationStatisticsModel> getVoterRegistrationRowByCounty(String fipsCode, String countyCode);
}
