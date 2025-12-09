package com.theknicks.voteranalysis_backend.dao;

import com.theknicks.voteranalysis_backend.models.VotingEquipmentModel;
import com.theknicks.voteranalysis_backend.models.VotingEquipmentUsageStatisticsEntryModel;
import com.theknicks.voteranalysis_backend.models.VotingEquipmentUsageStatisticsModel;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class VoterEquipmentDAO implements IVoterEquipmentDAO {
  private final Logger logger = LoggerFactory.getLogger(VoterEquipmentDAO.class);
  private final JdbcTemplate jdbcTemplate;

  public VoterEquipmentDAO(JdbcTemplate jdbcTemplate) throws IOException {
    logger.info("Creating VoterEquipmentDAO - JDBC Persistence");
    this.jdbcTemplate = jdbcTemplate;
  }

  @Override
  public List<VotingEquipmentModel> getAllVotingEquipment(Optional<String> stateFips) {
    var queryable = new VotingEquipmentModel.Queryable();
    String sql;
    Object[] params;

    if (stateFips.isPresent()) {
      sql = queryable.QueryWhere(new String[] {"equipment_usage.state_id = ?"});
      params = new Object[] {Integer.parseInt(stateFips.get(), 10)};
    } else {
      sql = queryable.Query(false);
      params = new Object[] {};
    }

    return jdbcTemplate.query(
        sql + " order by device_model.device_model_id", params, queryable.Mapper(false));
  }

  @Override
  public List<VotingEquipmentModel> getVotingEquipmentByType(String type) {
    var queryable = new VotingEquipmentModel.Queryable();
    return jdbcTemplate.query(
        queryable.Query(false) + " where equipment_type = ?", queryable.Mapper(false), type);
  }

  @Override
  public List<VotingEquipmentModel> getVotingEquipmentByManufacturer(String manufacturer) {
    var queryable = new VotingEquipmentModel.Queryable();
    return jdbcTemplate.query(
        queryable.Query(false) + " where manufacturer = ?", queryable.Mapper(false), manufacturer);
  }

  @Override
  public List<VotingEquipmentUsageStatisticsModel> getVotingEquipmentUsage(
      int year, String fipsCode) {
    var queryable = new VotingEquipmentUsageStatisticsEntryModel.Queryable();
    List<VotingEquipmentUsageStatisticsEntryModel> entries;
    if (fipsCode.isEmpty()) {
      entries = jdbcTemplate.query(queryable.Query(), queryable.Mapper());
    } else {
      entries =
          jdbcTemplate.query(
              queryable.QueryWhere(new String[] {"eavs_geounit.state_id = ?", "year = ?"}),
              queryable.Mapper(),
              Integer.parseInt(fipsCode, 10),
              year);
    }

    var votingEquipmentAgeMap =
        getAllVotingEquipment(Optional.empty()).stream()
            .collect(Collectors.toMap(VotingEquipmentModel::id, VotingEquipmentModel::age));
    var votingEquipmentQualityMap =
        getAllVotingEquipment(Optional.empty()).stream()
            .collect(
                Collectors.toMap(VotingEquipmentModel::id, VotingEquipmentModel::equipmentQuality));
    return VotingEquipmentUsageStatisticsModel.fromDataRows(
        entries, votingEquipmentAgeMap, votingEquipmentQualityMap);
  }

  @Override
  public List<VotingEquipmentUsageStatisticsModel> getDetailedVotingEquipmentUsage(
      int year, String fipsCode) {
    var queryable = new VotingEquipmentUsageStatisticsEntryModel.Queryable();
    var entries =
        jdbcTemplate.query(
            queryable.QueryWhere(new String[] {"eavs_geounit.state_id = ?", "year = ?"}),
            queryable.Mapper(),
            Integer.parseInt(fipsCode, 10),
            year);

    var votingEquipmentAgeMap =
        getAllVotingEquipment(Optional.empty()).stream()
            .collect(Collectors.toMap(VotingEquipmentModel::id, VotingEquipmentModel::age));
    var votingEquipmentQualityMap =
        getAllVotingEquipment(Optional.empty()).stream()
            .collect(
                Collectors.toMap(VotingEquipmentModel::id, VotingEquipmentModel::equipmentQuality));
    return VotingEquipmentUsageStatisticsModel.fromDataRowsPerCounty(
        entries, votingEquipmentAgeMap, votingEquipmentQualityMap);
  }

  @Override
  public Optional<VotingEquipmentModel> getVotingEquipmentModel(String manufacturer, String model) {
    var queryable = new VotingEquipmentModel.Queryable();
    return Optional.ofNullable(
        jdbcTemplate.queryForObject(
            queryable.Query(false) + " where manufacturer = ? and model = ?",
            queryable.Mapper(false),
            manufacturer,
            model));
  }
}
