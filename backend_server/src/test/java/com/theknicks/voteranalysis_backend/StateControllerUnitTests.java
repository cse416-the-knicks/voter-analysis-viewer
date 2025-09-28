package com.theknicks.voteranalysis_backend;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.theknicks.voteranalysis_backend.controllers.StateController;
import com.theknicks.voteranalysis_backend.services.StateService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.util.Assert;

import java.util.Optional;

import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(StateController.class)
public class StateControllerUnitTests {
    @Autowired
    private MockMvc _mvc;

    @MockitoBean
    private StateService service;

    void TestSetup_GetBoundaryGeometry(Optional<ObjectNode> result) {
        Mockito.when(service.getBoundaryGeometry(ArgumentMatchers.anyString())).thenReturn(
                result
        );
    }

    /**
     * Simple Unit Test Scenario, assuming the state exists.
     */
    @Test
    void StateController_getStateGeometry_Success() {
        // Arrange
        var controller = new StateController(service);
        TestSetup_GetBoundaryGeometry(Optional.of(new ObjectNode(null)));

        // Act
        var result = controller.getStateGeometry("validFipsCode");

        // Assert
        Assert.isTrue(result.isPresent(), "Expecting valid fips code to be non-empty");
        Mockito.verify(service).getBoundaryGeometry(ArgumentMatchers.anyString());
    }

    /**
     * Simple Unit Test Scenario, assumes we get a state that doesn't exist.
     */
    @Test
    void StateController_getStateGeometry_Failure() {
        // Arrange
        var controller = new StateController(service);
        TestSetup_GetBoundaryGeometry(Optional.empty());

        // Act
        var result = controller.getStateGeometry("invalidFipsCode");

        // Assert
        Assert.isTrue(result.isEmpty(), "Expecting invalid fips code to be empty");
        Mockito.verify(service).getBoundaryGeometry(ArgumentMatchers.anyString());
    }

    @Test
    void StateController_getStateGeometry_ResponseSuccess() throws Exception {
        // Arrange
        TestSetup_GetBoundaryGeometry(Optional.of(new ObjectNode(null)));

        // Act
        _mvc.perform(MockMvcRequestBuilders.get(
                        "/state/{fipsCode}/geometry", "1"))
        // Assert
                .andExpect(status().isOk())
                .andExpect(content().string(notNullValue()));
    }


    @Test
    void StateController_getStateGeometry_ResponseInvalid() throws Exception {
        // Arrange
        TestSetup_GetBoundaryGeometry(Optional.empty());

        // Act
        _mvc.perform(MockMvcRequestBuilders.get(
                        "/state/{fipsCode}/geometry", "3.141592654"))
        // Assert
                .andExpect(status().isOk())
                .andExpect(content().string("null"));
    }
}
