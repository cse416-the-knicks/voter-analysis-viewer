package com.theknicks.voteranalysis_backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.theknicks.voteranalysis_backend.annotations.AutoSql;
import com.theknicks.voteranalysis_backend.annotations.SqlColumnName;
import com.theknicks.voteranalysis_backend.enums.VoterEquipmentType;
import com.theknicks.voteranalysis_backend.helpers.AutoSqlQueryable;
import java.util.Date;
import java.util.List;
import java.util.Optional;

/**
 * Voting Equipment Model Response
 *
 * <p>For simplicity, this model is going to be almost directly in sync with the spreadsheet
 * columns.
 */
@AutoSql(
    collection = "app.device_model",
    joining = {"app.equipment_usage"},
    joinMethod = {"left"},
    joinOn = {
      "equipment_usage.device_model_id = device_model.device_model_id",
    },
    groupBy = {
      "device_model.device_model_id",
    })
public record VotingEquipmentModel(
    @JsonIgnore @SqlColumnName(name = "device_model.device_model_id") int id,
    @SqlColumnName(name = "vendor") String manufacturer,
    // No strong opinions, but this could be an enum.
    @SqlColumnName(name = "device_type") String equipmentType,
    @SqlColumnName(name = "model_name") String modelName,
    @SqlColumnName(name = "is_discontinued") Optional<Boolean> discontinued,
    // Could/Should be dates, can change later.
    @SqlColumnName(name = "first_manufactured") Optional<Date> firstManufactured,
    @SqlColumnName(name = "underlying_os") Optional<String> operatingSystem,

    // Voter Verified Paper Audit Trail
    // DNE
    // @SqlColumnName(name = "vvpat") Optional<Boolean> vvpat,

    // Mostly VVSG
    @SqlColumnName(name = "certification") Optional<String> certificationLevel,
    Optional<Integer> age,
    List<VoterEquipmentType> types,
    @SqlColumnName(name = "quality_score") Optional<Double> equipmentQuality,
    @SqlColumnName(name = "scan_rate") Optional<Double> scanRate,
    @SqlColumnName(name = "error_rate") Optional<Double> errorRate,
    @SqlColumnName(name = "reliability") Optional<Double> reliabilityScore,
    @SqlColumnName(name = "sum(quantity)") int quantity) {

  public VotingEquipmentModel(
      int id,
      String manufacturer,
      String equipmentType,
      String modelName,
      Optional<Boolean> discontinued,
      Optional<Date> firstManufactured,
      Optional<String> operatingSystem,
      Optional<String> certificationLevel,
      Optional<Double> equipmentQuality,
      Optional<Double> scanRate,
      Optional<Double> errorRate,
      Optional<Double> reliabilityScore,
      int quantity) {
    this(
        id,
        manufacturer,
        equipmentType,
        modelName,
        discontinued,
        firstManufactured,
        operatingSystem,
        certificationLevel,
        // NOTE(jerry): No flexible constructor
        // support without Java-Preview... :|
        firstManufactured
            .map(
                d -> {
                  var instant = d.toInstant();
                  var zone = java.time.ZoneId.systemDefault();
                  var localDate = instant.atZone(zone).toLocalDate();

                  int yearManufactured = localDate.getYear();
                  int currentYear = java.time.LocalDate.now().getYear();

                  return Optional.of(currentYear - yearManufactured);
                })
            .orElse(Optional.empty()),
        VoterEquipmentType.determineClass(equipmentType, false),
        equipmentQuality,
        scanRate,
        errorRate,
        reliabilityScore,
        quantity);
  }

  public static class Queryable extends AutoSqlQueryable<VotingEquipmentModel> {
    public Queryable() {
      super(VotingEquipmentModel.class);
    }
  }
}
