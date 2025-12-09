package com.theknicks.voteranalysis_backend.dao;

import com.theknicks.voteranalysis_backend.models.CVAPStatisticsModel;
import com.theknicks.voteranalysis_backend.models.CollectionSortParamModel;
import com.theknicks.voteranalysis_backend.models.VoterRegistrationDataModel;
import java.util.*;
import org.slf4j.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class VoterRegistrationDAO implements IVoterRegistrationDAO {
  private final Logger logger = LoggerFactory.getLogger(VoterRegistrationDAO.class);
  private final JdbcTemplate jdbcTemplate;

  public VoterRegistrationDAO(JdbcTemplate jdbcTemplate) {
    logger.info("Creating Concrete VoterRegistrationDAO");
    this.jdbcTemplate = jdbcTemplate;
  }

  private static String getFilterClauseForPartySelection(int partySelectionFilterId) {
    switch (partySelectionFilterId) {
      case 0:
        return " ";
      case 1:
        return " AND party_affiliation = 'D'";
      case 2:
        return " AND party_affiliation = 'R'";
    }
    return " AND party_affiliation is NULL or party_affiliation = ''";
  }

  public List<VoterRegistrationDataModel> getDetailedVoterRegistrationDataRows(
      String stateFips,
      Optional<String> countyFips,
      int pageSize,
      int pageIndex,
      Optional<CollectionSortParamModel> sortingParams,
      int partySelectionFilterId) {
    var queryable = new VoterRegistrationDataModel.Queryable();
    var mapper = queryable.Mapper();
    var selectQuery = queryable.Query();

    StringBuilder sql = new StringBuilder(selectQuery);
    List<Object> params = new ArrayList<>();

    sql.append(" WHERE state_id = ?");
    params.add(Integer.parseInt(stateFips, 10));

    if (countyFips.isPresent()) {
      sql.append(" AND region_id = ?");
      params.add(countyFips.get());
    }
    sql.append(getFilterClauseForPartySelection(partySelectionFilterId));

    sql.append(" ").append(queryable.QueryOrdering(sortingParams)).append(" LIMIT ? OFFSET ?");

    params.add(pageSize);
    params.add(pageIndex * pageSize);

    return jdbcTemplate.query(sql.toString(), mapper, params.toArray());
  }

  public int getDetailedVoterRegistrationDataCount(
      String stateFips, Optional<String> countyFips, int partySelectionFilterId) {
    int state = Integer.parseInt(stateFips, 10);

    StringBuilder sql =
        new StringBuilder("SELECT COUNT(*) FROM app.voter_registration WHERE state_id = ?");
    List<Object> params = new ArrayList<>();
    params.add(state);

    if (countyFips.isPresent()) {
      sql.append(" AND region_id = ?");
      params.add(countyFips.get());
    }
    sql.append(getFilterClauseForPartySelection(partySelectionFilterId));
    logger.info(sql.toString());
    Integer count = jdbcTemplate.queryForObject(sql.toString(), Integer.class, params.toArray());
    return count != null ? count : 0;
  }

  public List<CVAPStatisticsModel> getCVAPStatisticsDataRows(
      String stateFips, int year, boolean inAggregate) {
    var queryable = new CVAPStatisticsModel.Queryable();
    var mapper = queryable.Mapper(inAggregate);
    var selectQuery = queryable.QueryWhere(new String[] {"cvap_data.state_id = ?"}, inAggregate);
    return jdbcTemplate.query(
        selectQuery.toString(), mapper, new Object[] {Integer.parseInt(stateFips, 10)});
  }
}
