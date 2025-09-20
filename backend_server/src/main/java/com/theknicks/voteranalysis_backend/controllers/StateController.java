package com.theknicks.voteranalysis_backend.controllers;

import java.util.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import com.google.gson.*;
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

    public StateController() {
        _logger.info("Created StateController.");
    }

    @GetMapping("/{fipsCode}/geometry")
    public JsonObject getGeometry(@PathVariable("fipsCode") String fipsCode) {
        JsonObject result = new JsonObject();
        JsonPrimitive primitive = new JsonPrimitive(3.1415);
        result.add("abc", primitive);
        return result;
    }
}
