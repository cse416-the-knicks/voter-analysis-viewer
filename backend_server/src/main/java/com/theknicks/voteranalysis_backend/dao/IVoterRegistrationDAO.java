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
   * @param stateFips - State code fips. Can be left as empty / null
   * @param countyFips - County code fips. Can be left as empty / null
   * @return A list of detailed voter registration data rows.
   */
  List<VoterRegistrationDataModel> getDetailedVoterRegistrationDataRows(
      Optional<String> stateFips, Optional<String> countyFips);
}
