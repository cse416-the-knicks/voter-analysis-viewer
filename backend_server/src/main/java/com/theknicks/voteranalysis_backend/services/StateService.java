package com.theknicks.voteranalysis_backend.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.*;
import com.google.gson.*;
/**
 * State Service layer,
 *
 * Handles BusinessLogic for the State Controller, which
 * currently means loading a GeoJSON file and doing some preprocessing
 * to return the exact stuff that we need to render.
 */
@Service
public class StateService {
    private final Logger _logger = LoggerFactory.getLogger(StateService.class);

    public StateService() {
        _logger.info("Creating StateService...");
    }
}
