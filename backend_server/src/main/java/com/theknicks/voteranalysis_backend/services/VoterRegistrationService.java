package com.theknicks.voteranalysis_backend.services;

import com.theknicks.voteranalysis_backend.dao.IVoterRegistrationDAO;
import com.theknicks.voteranalysis_backend.models.*;
import java.util.*;
import org.slf4j.*;
import org.springframework.stereotype.Service;

/** This service wraps around the IVoterRegistrationDAO. */
@Service
public class VoterRegistrationService {
  private final Logger _logger = LoggerFactory.getLogger(VoterRegistrationService.class);
  private final IVoterRegistrationDAO _dao;

  public VoterRegistrationService(IVoterRegistrationDAO dao) {
    _dao = dao;
  }

  public List<VoterRegistrationDataModel> getDetailedVoterRegistrationData(
      String stateFips,
      String countyFips,
      int pageSize,
      int pageIndex,
      Optional<CollectionSortParamModel> sortParams,
      int partySelectionFilterId) {
    Optional<String> countyFipsParam =
        countyFips.isEmpty() ? Optional.empty() : Optional.of(countyFips);
    return _dao.getDetailedVoterRegistrationDataRows(
        stateFips, countyFipsParam, pageSize, pageIndex, sortParams, partySelectionFilterId);
  }

  public int getDetailedVoterRegistrationDataCount(
      String stateFips, String countyFips, int partySelectionFilterId) {
    Optional<String> countyFipsParam =
        countyFips.isEmpty() ? Optional.empty() : Optional.of(countyFips);
    return _dao.getDetailedVoterRegistrationDataCount(
        stateFips, countyFipsParam, partySelectionFilterId);
  }
}
