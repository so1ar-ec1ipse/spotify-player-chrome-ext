export let ACCESS_TOKEN = "";
export let REFRESH_TOKEN = "";
export let refreshFailed = false;

export const setRefreshFailed = (bool) => {
  refreshFailed = bool;
}

export const setTokens = (access_token, refresh_token) => {
  ACCESS_TOKEN = access_token
  REFRESH_TOKEN = refresh_token
}
