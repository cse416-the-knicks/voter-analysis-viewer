const DETAIL_STATE_TYPE_NONE = "DETAIL_STATE_TYPE_NONE";
const DETAIL_STATE_TYPE_OPTIN = "DETAIL_STATE_TYPE_OPTIN";
const DETAIL_STATE_TYPE_OPTOUT = "DETAIL_STATE_TYPE_OPTOUT";
const DETAIL_STATE_TYPE_DEMOCRAT = "DETAIL_STATE_TYPE_DEMOCRAT";
const DETAIL_STATE_TYPE_REPUBLICAN = "DETAIL_STATE_TYPE_REPUBLICAN";
const DETAIL_STATE_TYPE_VOTER_REGISTRATION = "DETAIL_STATE_TYPE_VOTER_REGISTRATION";

type DetailStateType =
typeof DETAIL_STATE_TYPE_NONE |
typeof DETAIL_STATE_TYPE_OPTIN |
typeof DETAIL_STATE_TYPE_OPTOUT |
typeof DETAIL_STATE_TYPE_DEMOCRAT |
typeof DETAIL_STATE_TYPE_REPUBLICAN |
typeof DETAIL_STATE_TYPE_VOTER_REGISTRATION;

function getDetailStateType(
  fipsCode: string,
): DetailStateType {
  switch (fipsCode) {
    case "48": {
      return DETAIL_STATE_TYPE_OPTIN;
    } break;
    case "13": {
      return DETAIL_STATE_TYPE_OPTOUT;
    } break;
    case "36": {
      return DETAIL_STATE_TYPE_DEMOCRAT;
    } break;
    case "40": {
 return DETAIL_STATE_TYPE_REPUBLICAN;
    } break;
    case "18": {
      return DETAIL_STATE_TYPE_VOTER_REGISTRATION;
    } break;
  }
  return DETAIL_STATE_TYPE_NONE;
}

function isDetailState(
  fipsCode: string,
): boolean  {
  return (getDetailStateType(fipsCode) !== DETAIL_STATE_TYPE_NONE);
}

export type { DetailStateType };
export {
    getDetailStateType,
    isDetailState,
    DETAIL_STATE_TYPE_NONE,
    DETAIL_STATE_TYPE_OPTIN,
    DETAIL_STATE_TYPE_OPTOUT,
    DETAIL_STATE_TYPE_DEMOCRAT,
    DETAIL_STATE_TYPE_REPUBLICAN,
    DETAIL_STATE_TYPE_VOTER_REGISTRATION,
};
