import { ACCESS_TOKEN, refreshFailed, setRefreshFailed } from "../tokens.js";
import { refreshToken } from "./refreshToken.js";

export const checkIfTrackIsSaved = async (songId) => {
  if (refreshFailed) return

  const res = await fetch(`https://api.spotify.com/v1/me/tracks/contains?ids=${songId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    }
  })

  const data = await res.json();

  // Access token failed
  if (data.error && data.error.status === 401) {
    const success = await refreshToken();
    if (success) return checkIfTrackIsSaved(songId);
    return setRefreshFailed(true)
  }

  // Device not found
  if (data.error && data.error.status === 404) {
    const spotifyOpener = document.querySelector("[data-js=spotify-opener]");
    return spotifyOpener.style.display = "grid";
  }

  return data[0]
}

