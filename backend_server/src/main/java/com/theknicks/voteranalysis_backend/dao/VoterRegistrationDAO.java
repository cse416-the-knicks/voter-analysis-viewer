package com.theknicks.voteranalysis_backend.dao;

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
      String stateFips, Optional<String> countyFips, int pageSize, int pageIndex) {
    var queryable = new VoterRegistrationDataModel.Queryable();
    var mapper = queryable.Mapper();
    var selectQuery = queryable.Query();

    if (countyFips.isPresent()) {
      return _jdbcTemplate.query(
          selectQuery + " where state_id = ? and region_id = ? limit ? offset ?",
          mapper,
          Integer.parseInt(stateFips, 10),
          countyFips.get(),
          pageSize,
          pageIndex);
    } else {
      return _jdbcTemplate.query(
          selectQuery + " where state_id = ? limit ? offset ?",
          mapper,
          Integer.parseInt(stateFips, 10),
          pageSize,
          pageIndex);
    }
  }

  public int getDetailedVoterRegistrationDataCount(String stateFips, Optional<String> countyFips) {
    int result = 0;
    if (countyFips.isPresent()) {
      var queryResult =
          _jdbcTemplate.queryForObject(
              "select count(*) from app.voter_registration where state_id = ? and region_id = ?",
              Integer.class,
              Integer.parseInt(stateFips, 10),
              countyFips.get());
      if (queryResult != null) {
        result = queryResult;
      }
    } else {
      var queryResult =
          _jdbcTemplate.queryForObject(
              "select count(*) from app.voter_registration where state_id = ?",
              Integer.class,
              Integer.parseInt(stateFips, 10));
      if (queryResult != null) {
        result = queryResult;
      }
    }
    return result;
  }
}
