package com.theknicks.voteranalysis_backend.dao;

import com.theknicks.voteranalysis_backend.models.VotingEquipmentModel;

import java.util.List;
import java.util.Optional;

/**
 * NOTE(jerry):
 * This DAO exists so that it is possible to unit test the logic of this DAO,
 * because otherwise the tests would need to read from disk, which is not optimal.
 *
 * This happens to be because JDBC doesn't need to be used for this since it requires
 * so little data (relatively speaking.)
 */
public class VoterEquipmentInMemoryDAO implements IVoterEquipmentDAO {
    private final List<VotingEquipmentModel> _equipmentList;

    public VoterEquipmentInMemoryDAO(List<VotingEquipmentModel> equipmentList) {
        _equipmentList = equipmentList;
    }

    @Override
    public List<VotingEquipmentModel> getAllVotingEquipment() {
        return _equipmentList;
    }

    @Override
    public List<VotingEquipmentModel> getVotingEquipmentByType(String type) {
        return _equipmentList.stream().filter(
                (item) -> item.equipmentType().equals(type)
        ).toList();
    }

    @Override
    public List<VotingEquipmentModel> getVotingEquipmentByManufacturer(String manufacturer) {
        return _equipmentList.stream().filter(
                (item) -> item.manufacturer().equals(manufacturer)
        ).toList();
    }

    @Override
    public Optional<VotingEquipmentModel> getVotingEquipmentModel(String manufacturer, String model) {
        for (var machine : getAllVotingEquipment()) {
            if (machine.manufacturer().equals(manufacturer)) {
                if (machine.modelName().equals(model)) {
                    return Optional.of(machine);
                }
            }
        }

        return Optional.empty();
    }
}
