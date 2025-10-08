package com.theknicks.voteranalysis_backend.enums;

public enum FelonyDisenfranchisement {
    UNKNOWN,
    NO_DENIAL_OF_VOTING,
    RESTORATION_UPON_RELEASE_FROM_PRISON,
    RESTORATION_AFTER_PAROLE_AND_PROBATION,
    ADDITIONAL_ACTION_FOR_RESTORATION,
    COUNT;

    public static FelonyDisenfranchisement fromInteger(int n) {
	switch (n) {
	    case 1: return FelonyDisenfranchisement.NO_DENIAL_OF_VOTING;
	    case 2: return FelonyDisenfranchisement.RESTORATION_UPON_RELEASE_FROM_PRISON;
	    case 3: return FelonyDisenfranchisement.RESTORATION_AFTER_PAROLE_AND_PROBATION;
	    case 4: return FelonyDisenfranchisement.ADDITIONAL_ACTION_FOR_RESTORATION;
	}
	return FelonyDisenfranchisement.UNKNOWN;
    }
}
