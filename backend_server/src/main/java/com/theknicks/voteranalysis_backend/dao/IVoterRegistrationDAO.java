package com.theknicks.voteranalysis_backend.dao;

import com.theknicks.voteranalysis_backend.models.CVAPStatisticsModel;
import com.theknicks.voteranalysis_backend.models.CollectionSortParamModel;
import com.theknicks.voteranalysis_backend.models.VoterRegistrationDataModel;
import java.util.*;

/** This is the data access object interface for the detailed voter registration data. */
public interface IVoterRegistrationDAO {
  /**
   * This access point is meant to return all the rows for detailed voter registration information.
   *
   * <p>The parameters are present to allow for filtering (optionally) by either the following: -
   * None - State - State + County/RegionFips Providing only a county without a state will result in
   * an empty list.
   *
   * @param stateFips - State code fips. This is required.
   * @param countyFips - County code fips. Can be left as empty / null
   * @param pageSize - The size of a single page
   * @param pageIndex - The page of data to return
   * @param partySelectionFilterId - The filter flag for the data. [0 = ALL 1 = DEMOCRAT 2 =
   *     REPUBLICAN 3+ = UNAFFILIATED]
   * @return A list of detailed voter registration data rows based on pagination.
   */
  List<VoterRegistrationDataModel> getDetailedVoterRegistrationDataRows(
      String stateFips,
      Optional<String> countyFips,
      int pageSize,
      int pageIndex,
      Optional<CollectionSortParamModel> sortingParams,
      int partySelectionFilterId);

  /**
   * This access point is meant to count all the rows for detailed voter registration information of
   * a particular state.
   *
   * @param stateFips - State code fips. This is required.
   * @param countyFips - County code fips. This is not required, can be left as empty / null
   * @param partySelectionFilterId - The filter flag for the data. [0 = ALL 1 = DEMOCRAT 2 =
   *     REPUBLICAN 3+ = UNAFFILIATED]
   * @return the amount of rows given the filter parameters.
   */
  int getDetailedVoterRegistrationDataCount(
      String stateFips, Optional<String> countyFips, int partySelectionFilterId);

  /**
   * This access point is meant to retrieve CVAP Statistics on a per county level for a particular
   * state. Although it can also return an aggregate for the entire state if necessary.
   *
   * @param stateFips - State code fips. This is required.
   * @param year - Year of CVAP to query. Only defined for 2023, as per the usecases
   * @param inAggregate - whether to return data in aggregate or not.
   * @return A list of CVAPStatisticsModel on a per-county basis or a list of a single model for the
   *     stats aggregates.
   */
  List<CVAPStatisticsModel> getCVAPStatisticsDataRows(
      String stateFips, int year, boolean inAggregate);
}
