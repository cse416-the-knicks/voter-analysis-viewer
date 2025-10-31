package com.theknicks.voteranalysis_backend.dao;

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
   * @return A list of detailed voter registration data rows.
   */
  List<VoterRegistrationDataModel> getDetailedVoterRegistrationDataRows(
      String stateFips, Optional<String> countyFips, int pageSize, int pageIndex);

  /**
   * This access point is meant to count all the rows for detailed voter registration information of
   * a particular state.
   *
   * @param stateFips - State code fips. This is required.
   * @param countyFips - County code fips. This is not required, can be left as empty / null
   * @return
   */
  int getDetailedVoterRegistrationDataCount(String stateFips, Optional<String> countyFips);
}
