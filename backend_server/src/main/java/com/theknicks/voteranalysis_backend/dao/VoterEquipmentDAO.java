package com.theknicks.voteranalysis_backend.dao;

import static com.theknicks.voteranalysis_backend.helpers.CsvHelpers.*;

import com.theknicks.voteranalysis_backend.helpers.*;
import com.theknicks.voteranalysis_backend.models.VotingEquipmentModel;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class VoterEquipmentDAO implements IVoterEquipmentDAO {
  private final Logger _logger = LoggerFactory.getLogger(VoterEquipmentDAO.class);
  private final JdbcTemplate _jdbcTemplate;

  public VoterEquipmentDAO(JdbcTemplate jdbcTemplate) throws IOException {
    _logger.info("Creating VoterEquipmentDAO - JDBC Persistence");
    _jdbcTemplate = jdbcTemplate;
  }

  @Override
  public List<VotingEquipmentModel> getAllVotingEquipment() {
    var queryable = new VotingEquipmentModel.Queryable();
    return _jdbcTemplate.query(queryable.Query(false), queryable.Mapper(false));
  }

  @Override
  public List<VotingEquipmentModel> getVotingEquipmentByType(String type) {
    var queryable = new VotingEquipmentModel.Queryable();
    return _jdbcTemplate.query(
        queryable.Query(false) + " where equipmentType = ?", queryable.Mapper(false), type);
  }

  @Override
  public List<VotingEquipmentModel> getVotingEquipmentByManufacturer(String manufacturer) {
    var queryable = new VotingEquipmentModel.Queryable();
    return _jdbcTemplate.query(
        queryable.Query(false) + " where manufacturer = ?", queryable.Mapper(false), manufacturer);
  }

  @Override
  public Optional<VotingEquipmentModel> getVotingEquipmentModel(String manufacturer, String model) {
    var queryable = new VotingEquipmentModel.Queryable();
    return Optional.ofNullable(
        _jdbcTemplate.queryForObject(
            queryable.Query(false) + " where manufacturer = ? and model = ?",
            queryable.Mapper(false),
            manufacturer,
            model));
  }
}
