import { ACCESS_TOKEN, refreshFailed, setRefreshFailed } from "../tokens.js";
import { refreshToken } from "./refreshToken.js";
import { PROGRESS_MS, setNewProgress } from "../trackProgress.js";

export const seekToPosition = async (seek_amount_seconds) => {
  if (refreshFailed) return

  let seekPosition = PROGRESS_MS + seek_amount_seconds;
  if (seekPosition < 0) seekPosition = 0;

  const res = await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${seekPosition}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    }
  });

  if (res.status === 401) {
    const success = await refreshToken();
    if (success) return seekToPosition(seek_amount_seconds);
    return setRefreshFailed(true)
  }

  // Device not found
  if (res.status === 404) {
    const spotifyOpener = document.querySelector("[data-js=spotify-opener]");
    return spotifyOpener.style.display = "grid";
  }

  setNewProgress(seekPosition);

  return false;
}