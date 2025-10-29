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
      Optional<String> stateFips, Optional<String> countyFips) {
    var queryable = new VoterRegistrationDataModel.Queryable();
    var mapper = queryable.Mapper();
    var selectQuery = queryable.Query();

    if (stateFips.isPresent()) {
      if (countyFips.isPresent()) {
        return _jdbcTemplate.query(
            selectQuery + " where state_id = ? and region_id = ?",
            mapper,
            Integer.parseInt(stateFips.get(), 10),
            countyFips.get());
      } else {
        return _jdbcTemplate.query(
            selectQuery + " where state_id = ?", mapper, Integer.parseInt(stateFips.get(), 10));
      }
    } else {
      if (countyFips.isEmpty()) {
        return _jdbcTemplate.query(selectQuery, mapper);
      }
    }
    return List.of();
  }
}
