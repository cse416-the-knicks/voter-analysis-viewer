package com.theknicks.voteranalysis_backend.models;

import com.theknicks.voteranalysis_backend.enums.*;

/**
 * This is the prepared version of the data in the states table, and the version of data that is
 * given to calling clients.
 */
public record StateInformationModel(
    String fipsCode,
    String name,
    RegistrationMethod registrationMethod,
    FelonyDisenfranchisement felonyDisenfranchisement,
    int populationTotal,
    int cvapTotal,
    PoliticalParty affiliation) {
  public static StateInformationModel fromRaw(StateInformationDataRowModel rowModel) {
    return new StateInformationModel(
        Integer.toString(rowModel.state_id()),
        rowModel.name(),
        RegistrationMethod.fromString(rowModel.registration_method()),
        FelonyDisenfranchisement.fromInteger(rowModel.felony_disenfranchisement()),
        rowModel.population_total(),
        rowModel.citizens_of_voting_age_population(),
        PoliticalParty.fromString(rowModel.dominant_party()));
  }
}
