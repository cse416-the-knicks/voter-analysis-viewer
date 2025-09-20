package com.theknicks.voteranalysis_backend.dao;

import java.io.*;
import com.google.gson.*;
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
    public JsonObject getGeometryBoundary(String fipsCode) {
        var gson = new Gson();
        _logger.info("Reading state with fips code: " + fipsCode);
        try (Reader reader = new FileReader(preprocessedGeospatialPath + "stateByFips/" + fipsCode + ".json")) {
            var geoJsonObject = gson.fromJson(reader, JsonObject.class);
            var metaDataWrapper = new JsonObject();
            metaDataWrapper.add("geoJson", geoJsonObject);
            return metaDataWrapper;
        } catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }
}
