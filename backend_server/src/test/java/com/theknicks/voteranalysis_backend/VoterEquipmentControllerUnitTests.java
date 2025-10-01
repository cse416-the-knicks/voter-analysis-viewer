package com.theknicks.voteranalysis_backend;

import com.theknicks.voteranalysis_backend.dao.VoterEquipmentInMemoryDAO;
import com.theknicks.voteranalysis_backend.models.VotingEquipmentModel;
import com.theknicks.voteranalysis_backend.controllers.VoterEquipmentController;
import com.theknicks.voteranalysis_backend.services.VoterEquipmentService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.util.Assert;

import java.util.List;
import java.util.Optional;

/**
 * NOTE(jerry): This is not a MvcMockTest, because the setup for that is *really* complicated
 * and there's already enough testing for this part (which is really more of a service test.)
 */
@SpringBootTest
public class VoterEquipmentControllerUnitTests {
    private VoterEquipmentService service;
    private List<VotingEquipmentModel> modelsList;
    private VoterEquipmentInMemoryDAO dao;
    private VoterEquipmentController controller;

    @BeforeEach
    void SetupTestData() {
        // ChatGPT generated-fake data for testing.
        modelsList = List.of(
                new VotingEquipmentModel("CivicVote", "Optical Scan", "CivicScan LX",
                        Optional.of(false), Optional.of(2012), Optional.empty(),
                        Optional.of("Linux 4.4"), Optional.of("5.2.3"),
                        Optional.of(true), Optional.of("VVSG 2005"), Optional.empty()),
                new VotingEquipmentModel("CivicVote", "Ballot Marking Device", "CivicMark Mini",
                        Optional.of(false), Optional.of(2021), Optional.empty(),
                        Optional.of("Android 11"), Optional.of("1.0.2"),
                        Optional.of(true), Optional.of("VVSG 2021"), Optional.empty()),

                new VotingEquipmentModel("DemocracyWorks", "Ballot Marking Device", "DW Mark I",
                        Optional.of(true), Optional.of(2006), Optional.of(2012),
                        Optional.of("Custom RTOS"), Optional.of("0.9"),
                        Optional.of(false), Optional.of("VVSG 2002"), Optional.of("Lacked paper trail")),
                new VotingEquipmentModel("DemocracyWorks", "Optical Scan", "DW Scan Pro",
                        Optional.of(false), Optional.of(2014), Optional.empty(),
                        Optional.of("Linux 3.10"), Optional.of("3.5"),
                        Optional.of(true), Optional.of("VVSG 2005"), Optional.empty()),

                new VotingEquipmentModel("ElectroVote", "DRE", "EV-1000",
                        Optional.of(true), Optional.of(1998), Optional.of(2005),
                        Optional.of("Windows 95"), Optional.of("1.0.3"),
                        Optional.of(false), Optional.of("VVSG 2002"), Optional.of("Obsolete crypto libraries")),
                new VotingEquipmentModel("ElectroVote", "DRE", "EV-500",
                        Optional.of(true), Optional.of(2002), Optional.of(2010),
                        Optional.of("Windows XP"), Optional.of("2.5"),
                        Optional.of(false), Optional.of("VVSG 2002"), Optional.of("Unpatched OS vulnerabilities")),
                new VotingEquipmentModel("ElectroVote", "Hybrid", "EV-Hybrid 1",
                        Optional.of(false), Optional.of(2018), Optional.empty(),
                        Optional.of("Linux 4.15"), Optional.of("2.3"),
                        Optional.of(true), Optional.of("VVSG 2005"), Optional.empty()),

                new VotingEquipmentModel("LibertyTech", "Hybrid", "FreedomMark IV",
                        Optional.of(false), Optional.of(2015), Optional.empty(),
                        Optional.of("Windows 10"), Optional.of("2.1.0"),
                        Optional.of(true), Optional.of("VVSG 2005"), Optional.empty()),
                new VotingEquipmentModel("LibertyTech", "Optical Scan", "FreedomScan Pro",
                        Optional.of(false), Optional.of(2016), Optional.empty(),
                        Optional.of("Linux 3.18"), Optional.of("4.0"),
                        Optional.of(true), Optional.of("VVSG 2005"), Optional.empty()),

                new VotingEquipmentModel("SecureBallot", "Optical Scan", "ScanMaster 200",
                        Optional.of(false), Optional.of(2008), Optional.empty(),
                        Optional.of("Linux 2.6"), Optional.of("3.4.7"),
                        Optional.of(true), Optional.of("VVSG 2005"), Optional.empty()),
                new VotingEquipmentModel("SecureBallot", "DRE", "TouchVote 3000",
                        Optional.of(true), Optional.of(2004), Optional.of(2011),
                        Optional.of("Windows CE"), Optional.of("1.2"),
                        Optional.of(false), Optional.of("VVSG 2002"), Optional.of("Lost ballot audit data")),
                new VotingEquipmentModel("SecureBallot", "Optical Scan", "ScanMaster Portable",
                        Optional.of(false), Optional.of(2011), Optional.empty(),
                        Optional.of("Linux 2.6"), Optional.of("2.1"),
                        Optional.of(true), Optional.of("VVSG 2005"), Optional.empty()),

                new VotingEquipmentModel("VoteSys", "Ballot Marking Device", "MarkIt 7",
                        Optional.of(false), Optional.of(2019), Optional.empty(),
                        Optional.of("Android 9"), Optional.of("7.0.1"),
                        Optional.of(true), Optional.of("VVSG 2005"), Optional.of("Potential supply chain issues")),
                new VotingEquipmentModel("VoteSys", "Optical Scan", "ScanLite 100",
                        Optional.of(false), Optional.of(2020), Optional.empty(),
                        Optional.of("Linux 5.10"), Optional.of("1.0.0"),
                        Optional.of(true), Optional.of("VVSG 2021"), Optional.empty()),
                new VotingEquipmentModel("VoteSys", "Hybrid", "MarkScan Duo",
                        Optional.of(false), Optional.of(2017), Optional.empty(),
                        Optional.of("Windows 10 IoT"), Optional.of("1.8"),
                        Optional.of(true), Optional.of("VVSG 2005"), Optional.empty())
        );

        dao = new VoterEquipmentInMemoryDAO(modelsList);
        service = new VoterEquipmentService(dao);
        controller = new VoterEquipmentController(service);
    }

    @Test
    void VoterEquipmentController_GetAll_Success() {
        // Arrange
        // Done already...

        // Act
        var allResults = controller.getAllVotingEquipment();

        // Assert
        Assertions.assertNotNull(modelsList);
        Assertions.assertEquals(modelsList.size(), allResults.size());
    }

    @Test
    void VoterEquipmentController_GetVotingEquipment_Success() {
        // Arrange
        // Done already...

        // Act
        var result = controller.getVotingEquipment("SecureBallot", "ScanMaster Portable");

        // Assert
        Assertions.assertNotNull(result);
        Assertions.assertTrue(result.isPresent());
    }

    @Test
    void VoterEquipmentController_GetVotingEquipment_Failure() {
        // Arrange
        // Done already...

        // Act
        var result = controller.getVotingEquipment("Nonexistent Manufacturer", "Nonexistent Model");

        // Assert
        Assertions.assertNotNull(result);
        Assertions.assertFalse(result.isPresent());
    }

    @ParameterizedTest
    @CsvSource({
            "CivicVote, 2",
            "DemocracyWorks, 2",
            "ElectroVote, 3",
            "LibertyTech, 2",
            "SecureBallot, 3",
            "VoteSys, 3"
    })
    void VoterEquipmentController_GetVotingEquipmentByManufacturer_RealManufacturer(
            String targetManufacturer,
            int expectedManufacturerCount) {
        // Act
        var result = controller.getAllVotingEquipmentByManufacturer(targetManufacturer);

        // Assert
        Assertions.assertNotNull(result);
        Assertions.assertEquals(expectedManufacturerCount, result.size());

        for (VotingEquipmentModel entry : result) {
            Assertions.assertNotNull(entry);
            Assertions.assertEquals(targetManufacturer, entry.manufacturer());
        }
    }

    @Test
    void VoterEquipmentController_GetVotingEquipmentByManufacturer_InvalidManufacturer() {
        // Act
        var result = controller.getAllVotingEquipmentByManufacturer("Does not exist!");

        // Assert
        Assertions.assertNotNull(result);
        Assertions.assertEquals(0, result.size());
    }

    @ParameterizedTest
    @CsvSource({
            "Optical Scan, 6",
            "DRE, 3",
            "Hybrid, 3",
            "Ballot Marking Device, 3"
    })
    void VoterEquipmentController_GetVotingEquipmentByType_Success(
            String targetType,
            int expectedTypeCount
    ) {
        // Act
        var result = controller.getAllVotingEquipmentByType(targetType);

        // Assert
        Assertions.assertNotNull(result);
        Assertions.assertEquals(expectedTypeCount, result.size());

        for (VotingEquipmentModel entry : result) {
            Assertions.assertNotNull(entry);
            Assertions.assertEquals(targetType, entry.equipmentType());
        }
    }

    void VoterEquipmentController_GetVotingEquipmentByType_Failure() {
        // Act
        var result = controller.getAllVotingEquipmentByType("Does not exist!");

        // Assert
        Assertions.assertNotNull(result);
        Assertions.assertEquals(0, result.size());
    }
}
