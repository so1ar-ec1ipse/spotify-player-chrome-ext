import { CLIENT_ID } from "../clientId.js";
import { ACCESS_TOKEN, REFRESH_TOKEN, setTokens } from "../tokens.js"

const authorize = document.querySelector("[data-js=authorize]")

export const refreshToken = async () => {

  // Build data for new token request
  const data = new URLSearchParams();
  data.append("grant_type", "refresh_token");
  data.append("refresh_token", REFRESH_TOKEN);
  data.append("client_id", CLIENT_ID);

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })

  const resData = await res.json();

  if (resData.error) {
    authorize.style.display = "grid"
    return false
  }

  // Update access tokens
  setTokens(resData.access_token, resData.refresh_token ? resData.refresh_token : REFRESH_TOKEN)

  chrome.storage.sync.set({ "ACCESS_TOKEN": ACCESS_TOKEN });
  chrome.storage.sync.set({ "REFRESH_TOKEN": REFRESH_TOKEN });

  return true;
}