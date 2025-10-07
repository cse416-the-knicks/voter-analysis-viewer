package com.theknicks.voteranalysis_backend.enums;

public enum PoliticalParty {
    UNAFFILIATED,
    DEMOCRAT,
    REPUBLICAN,
    COUNT;

    public static PoliticalParty fromString(String value) {
	if (value.equals("R")) {
	    return PoliticalParty.REPUBLICAN;
	} else if (value.equals("D")) {
	    return PoliticalParty.DEMOCRAT;
	}

	return PoliticalParty.UNAFFILIATED;
    }
};
