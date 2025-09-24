package com.theknicks.voteranalysis_backend.controllers;

import java.util.*;

import com.theknicks.voteranalysis_backend.services.StateService;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.node.ObjectNode;
/**
 * This controller will service all the requests relating
 * to state-specific information, including but not limited to:
 *   - Geographical Data
 *   - EAVs State Data
 *   - Any Appropriate Detailed Data
 */
@RestController
@RequestMapping("/state")
public class StateController {
    private final Logger _logger = LoggerFactory.getLogger(StateController.class);
    private final StateService _service;

    public StateController(StateService service) {
        _logger.info("Created StateController.");
        _service = service;
    }

    @GetMapping("/{fipsCode}/geometry")
    @ApiResponse(
            responseCode = "200",
            description = "Get the geometry boundary of a state by FipsCode",
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(ref="../openapi-ext/geojson.yaml#/components/schema/GeoJsonObject", nullable=true)
            )
    )

    public Optional<ObjectNode> getStateGeometry(@PathVariable("fipsCode") String fipsCode) {
        return _service.getBoundaryGeometry(fipsCode);
    }
}
