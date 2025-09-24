package com.theknicks.voteranalysis_backend.services;

import com.theknicks.voteranalysis_backend.dao.IStateDAO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.*;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.util.*;
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
    private final IStateDAO _dao;

    public StateService(IStateDAO dao) {
        _logger.info("Creating StateService...");
        _dao = dao;
    }

    public Optional<ObjectNode> getBoundaryGeometry(String fipsCode) {
        return _dao.getGeometryBoundary(fipsCode);
    }
}
