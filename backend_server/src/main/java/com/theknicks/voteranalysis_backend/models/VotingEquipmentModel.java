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
    @SqlColumnName(name = "manufacturer") String manufacturer,
    @SqlColumnName(name = "equipment_type") String equipmentType,
    @SqlColumnName(name = "model_name") String modelName,
    @SqlColumnName(name = "discontinued") Optional<Boolean> discontinued,
    @SqlColumnName(name = "short_description") Optional<String> shortDescription,
    @SqlColumnName(name = "security_risks") Optional<String> securityRisks,
    @SqlColumnName(name = "notes_misc") Optional<String> notesMisc,
    @SqlColumnName(name = "first_manufactured") Optional<Date> firstManufactured,
    @SqlColumnName(name = "last_manufactured") Optional<Date> lastManufactured,
    @SqlColumnName(name = "os") Optional<String> operatingSystem,
    @SqlColumnName(name = "firmware_version") Optional<String> firmwareVersion,
    @SqlColumnName(name = "paper_capacity") Optional<Integer> paperCapacity,
    @SqlColumnName(name = "battery_life") Optional<Integer> batteryLife,

    // Voter Verified Paper Audit Trail
    @SqlColumnName(name = "vvpatt") Optional<Boolean> vvpat,

    // Mostly VVSG
    @SqlColumnName(name = "certification_level") Optional<String> certificationLevel,
    Optional<Integer> age,
    List<VoterEquipmentType> types,
    @SqlColumnName(name = "quality_score") Optional<Double> equipmentQuality,
    @SqlColumnName(name = "scanning_rate") Optional<Integer> scanRate,
    @SqlColumnName(name = "error_rate") Optional<Double> errorRate,
    @SqlColumnName(name = "reliability") Optional<Double> reliabilityScore,
    @SqlColumnName(name = "sum(quantity)") int quantity) {

  public VotingEquipmentModel(
      int id,
      String manufacturer,
      String equipmentType,
      String modelName,
      Optional<Boolean> discontinued,
      Optional<String> shortDescription,
      Optional<String> securityRisks,
      Optional<String> notesMisc,
      Optional<Date> firstManufactured,
      Optional<Date> lastManufactured,
      Optional<String> operatingSystem,
      Optional<String> firmwareVersion,
      Optional<Integer> paperCapacity,
      Optional<Integer> batteryLife,
      Optional<Boolean> vvpat,
      Optional<String> certificationLevel,
      Optional<Double> equipmentQuality,
      Optional<Integer> scanRate,
      Optional<Double> errorRate,
      Optional<Double> reliabilityScore,
      int quantity) {
    this(
        id,
        manufacturer,
        equipmentType,
        modelName,
        discontinued,
        shortDescription,
        securityRisks,
        notesMisc,
        firstManufactured,
        lastManufactured,
        operatingSystem,
        firmwareVersion,
        paperCapacity,
        batteryLife,
        vvpat,
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
        VoterEquipmentType.determineClass(equipmentType, vvpat.orElse(false)),
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
