import { ACCESS_TOKEN, refreshFailed, setRefreshFailed } from "../tokens.js";
import { refreshToken } from "./refreshToken.js";

export const skipTrack = async (action) => {
  if (refreshFailed) return

  const res = await fetch(`https://api.spotify.com/v1/me/player/${action}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    }
  });

  if (res.status === 401) {
    const success = await refreshToken();
    if (success) return skipTrack(action);
    return setRefreshFailed(true)
  }

  // Device not found
  if (res.status === 404) {
    const spotifyOpener = document.querySelector("[data-js=spotify-opener]");
    return spotifyOpener.style.display = "grid";
  }

  return false;
}