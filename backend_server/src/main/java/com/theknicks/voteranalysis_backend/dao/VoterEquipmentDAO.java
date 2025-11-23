package com.theknicks.voteranalysis_backend.dao;

import static com.theknicks.voteranalysis_backend.helpers.CsvHelpers.*;

import com.theknicks.voteranalysis_backend.helpers.*;
import com.theknicks.voteranalysis_backend.models.VotingEquipmentModel;
import com.theknicks.voteranalysis_backend.models.VotingEquipmentUsageStatisticsEntryModel;
import com.theknicks.voteranalysis_backend.models.VotingEquipmentUsageStatisticsModel;
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
        queryable.Query(false) + " where equipment_type = ?", queryable.Mapper(false), type);
  }

  @Override
  public List<VotingEquipmentModel> getVotingEquipmentByManufacturer(String manufacturer) {
    var queryable = new VotingEquipmentModel.Queryable();
    return _jdbcTemplate.query(
        queryable.Query(false) + " where manufacturer = ?", queryable.Mapper(false), manufacturer);
  }

  @Override
  public List<VotingEquipmentUsageStatisticsModel> getVotingEquipmentUsage(String fipsCode) {
    var queryable = new VotingEquipmentUsageStatisticsEntryModel.Queryable();
    List<VotingEquipmentUsageStatisticsEntryModel> entries;
    if (fipsCode.isEmpty()) {
      entries = _jdbcTemplate.query(queryable.Query(), queryable.Mapper());
    } else {
      entries =
          _jdbcTemplate.query(
              queryable.QueryWhere(new String[] {"eavs_geounit.state_id = ?"}),
              queryable.Mapper(),
              Integer.parseInt(fipsCode, 10));
    }

    return VotingEquipmentUsageStatisticsModel.fromDataRows(entries);
  }

  @Override
  public List<VotingEquipmentUsageStatisticsModel> getDetailedVotingEquipmentUsage(
      String fipsCode) {
    var queryable = new VotingEquipmentUsageStatisticsEntryModel.Queryable();
    var entries =
        _jdbcTemplate.query(
            queryable.QueryWhere(new String[] {"eavs_geounit.state_id = ?"}),
            queryable.Mapper(),
            Integer.parseInt(fipsCode, 10));
    return VotingEquipmentUsageStatisticsModel.fromDataRowsPerCounty(entries);
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
