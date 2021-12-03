import { CLIENT_ID } from "./clientId.js";

const authorize = document.querySelector("[data-js=authorize]")

export const refreshToken = async (REFRESH_TOKEN) => {

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

  console.log(resData)
  console.log("OLD REFRESH_TOKEN: " + REFRESH_TOKEN)
  if (resData.error) {
    authorize.style.display = "grid"
    return false
  }

  chrome.storage.sync.set({ "ACCESS_TOKEN": resData.access_token });
  if (resData.refresh_token) {
    chrome.storage.sync.set({ "REFRESH_TOKEN": resData.refresh_token });
  }

  return true;
}