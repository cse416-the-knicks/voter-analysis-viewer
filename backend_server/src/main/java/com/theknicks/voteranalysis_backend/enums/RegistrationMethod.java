package com.theknicks.voteranalysis_backend.enums;

public enum RegistrationMethod {
    NONE,
    OPT_IN,
    OPT_OUT,
    COUNT;

    public static RegistrationMethod fromString(String value) {
	if (value.equals("opt-in")) {
	    return RegistrationMethod.OPT_IN;
	} else if (value.equals("opt-out")) {
	    return RegistrationMethod.OPT_OUT;
	}

	return RegistrationMethod.NONE;
    }
}
