package com.theknicks.voteranalysis_backend.dao;

import java.io.*;
import java.util.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.*;

@Component
public class StateDAO implements IStateDAO {
    private final Logger _logger = LoggerFactory.getLogger(StateDAO.class);

    // TODO(jerry): fix later. @Value("${}")
    private final String preprocessedGeospatialPath = "../data_common/geospatial_processed/";

    public StateDAO() {
        _logger.info("Creating Concrete StateDAO");
        _logger.info(preprocessedGeospatialPath);
    }

    @Override
    public Optional<ObjectNode> getGeometryBoundary(String fipsCode) {
        var mapper = new ObjectMapper();
        _logger.info("Reading state with fips code: " + fipsCode);
        try (Reader reader = new FileReader(preprocessedGeospatialPath + "stateByFips/" + fipsCode + ".json")) {
	    var node = mapper.readValue(reader, ObjectNode.class);
            return Optional.of(node);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return Optional.empty();
    }
}
