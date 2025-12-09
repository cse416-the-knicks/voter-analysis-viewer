package com.theknicks.voteranalysis_backend.enums;

import java.util.ArrayList;
import java.util.List;

public enum VoterEquipmentType {
  DRE_NO_VVPAT,
  DRE_WITH_VVPAT,
  SCANNER,
  BMD,
  HANDCOUNT,
  OTHER,
  COUNT;

  public static boolean isA(List<VoterEquipmentType> types, VoterEquipmentType target) {
    for (var type : types) {
      if (type.equals(target)) {
        return true;
      }
    }
    return false;
  }

  public static List<VoterEquipmentType> determineClass(
      String equipmentType, boolean supportsVvpat) {
    List<VoterEquipmentType> classes = new ArrayList<>();

    if (equipmentType.contains("VVPAT")) {
      supportsVvpat = true;
    }

    switch (equipmentType) {
      case "DRE Dial":
      case "DRE with VVPAT":
      case "DRE Touchscreen":
      case "DRE Push Button":
        if (supportsVvpat) {
          classes.add(VoterEquipmentType.DRE_WITH_VVPAT);
        } else {
          classes.add(VoterEquipmentType.DRE_NO_VVPAT);
        }
        break;
      case "Hybrid Optical Scanner/BMD":
        // NOTE(jerry): intentional fall-through.
        classes.add(VoterEquipmentType.BMD);
      case "Batch-Fed Optical Scanner":
      case "Scanner":
      case "Hand-Fed Optical Scanner":
      case "Batch-Fed Optical Scan Tabulator":
        classes.add(VoterEquipmentType.SCANNER);
        break;
      case "BMD/Tabulator":
      case "BMD":
      case "Ballot Marking Device":
        classes.add(VoterEquipmentType.BMD);
        break;
      case "Hand Count":
        classes.add(VoterEquipmentType.HANDCOUNT);
        break;
      default:
        classes.add(VoterEquipmentType.OTHER);
        break;
    }

    return classes;
  }
}
