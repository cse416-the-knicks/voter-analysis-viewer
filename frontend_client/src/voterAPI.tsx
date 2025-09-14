import axios from 'axios';

export const BACK_END_URL = ""
export const TEST_ENDPOINT = "/test1"

export function getTestEndpoint()
{
    const res = axios.get(`${BACK_END_URL}${TEST_ENDPOINT}`)
    return res
}