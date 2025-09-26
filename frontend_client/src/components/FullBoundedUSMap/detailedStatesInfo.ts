enum DetailStateType {
  NONE,
  OPTIN,
  OPTOUT,
  DEMOCRAT,
  REPUBLICAN,
  VOTER_REGISTRATION,
  COUNT,
};

function getDetailStateType(
  fipsCode: string,
): DetailStateType {
  switch (fipsCode) {
    case "13": {
      return DetailStateType.OPTIN;
    } break;
    case "48": {
      return DetailStateType.OPTOUT;
    } break;
    case "36": {
      return DetailStateType.DEMOCRAT;
    } break;
    case "40": {
      return DetailStateType.REPUBLICAN;
    } break;
    case "18": {
      return DetailStateType.VOTER_REGISTRATION;
    } break;
  }
  return DetailStateType.NONE;
}

function isDetailState(
  fipsCode: string,
): boolean  {
  return (getDetailStateType(fipsCode) !== DetailStateType.NONE);
}

export type { DetailStateType };
export {
    getDetailStateType,
    isDetailState,
};
