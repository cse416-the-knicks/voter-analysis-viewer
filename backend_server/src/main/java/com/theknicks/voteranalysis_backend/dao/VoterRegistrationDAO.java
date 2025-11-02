package com.theknicks.voteranalysis_backend.dao;

import com.theknicks.voteranalysis_backend.models.CollectionSortParamModel;
import com.theknicks.voteranalysis_backend.models.VoterRegistrationDataModel;
import java.util.*;
import org.slf4j.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class VoterRegistrationDAO implements IVoterRegistrationDAO {
  private final Logger _logger = LoggerFactory.getLogger(VoterRegistrationDAO.class);
  private final JdbcTemplate _jdbcTemplate;

  public VoterRegistrationDAO(JdbcTemplate jdbcTemplate) {
    _logger.info("Creating Concrete VoterRegistrationDAO");
    _jdbcTemplate = jdbcTemplate;
  }

  public List<VoterRegistrationDataModel> getDetailedVoterRegistrationDataRows(
      String stateFips,
      Optional<String> countyFips,
      int pageSize,
      int pageIndex,
      Optional<CollectionSortParamModel> sortingParams) {
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

    sql.append(" ").append(queryable.QueryOrdering(sortingParams)).append(" LIMIT ? OFFSET ?");

    params.add(pageSize);
    params.add(pageIndex * pageSize);

    return _jdbcTemplate.query(sql.toString(), mapper, params.toArray());
  }

  public int getDetailedVoterRegistrationDataCount(String stateFips, Optional<String> countyFips) {
    int state = Integer.parseInt(stateFips, 10);

    StringBuilder sql =
        new StringBuilder("SELECT COUNT(*) FROM app.voter_registration WHERE state_id = ?");
    List<Object> params = new ArrayList<>();
    params.add(state);

    if (countyFips.isPresent()) {
        sql.append(" AND region_id = ?");
        params.add(countyFips.get());
    }

    Integer count = _jdbcTemplate.queryForObject(sql.toString(), Integer.class, params.toArray());
    return count != null ? count : 0;
  }
}
