import { spotifyNotOpenError } from "./spotifyNotOpenError.js"
import { updateSongDOM } from "./updateSongDOM.js"
import { updateControllerDOM } from "./updateControllerDOM.js"
import { activateDevice } from "./api/activateDevice.js"
import { sleep } from "./sleep.js"
import { playTrackAgain } from "./api/playTrackAgain.js"
import { refreshToken } from "./api/refreshToken.js"

import {
  setIsplaying, setIsShuffle,
  setCurrentVolume, setRepeatState, currentTrackId, setCurrentTrackId,
  playingType, setPlayingType
} from "./handleSpotifyControllers.js"

import { ACCESS_TOKEN } from "./tokens.js"
import { startProgress } from "./trackProgress.js"


// In some places we are re-invoking/recursing the same function
// So we keep this counter and when it gets too high we should stop
// To avoid infinite fetch requests
let invokeStateCount = 0;
// Get track state
export const currentTrackState = async () => {
  if (invokeStateCount >= 5) return // failsafe

  const res = await fetch("https://api.spotify.com/v1/me/player?additional_types=track,episode", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    }
  });
  // Error handling
  if (res.status === 204) { // If no content is returned (we need to activate device)
    // This function activates device
    const findDevices = await activateDevice()
    if (findDevices && findDevices.length === 0) {
      return spotifyNotOpenError(true);
    }
    await sleep(1000);
    invokeStateCount++;
    return currentTrackState()
  }

  const data = await res.json();

  if (data.error && data.error.status === 401) {
    const success = await refreshToken();
    if (success) return currentTrackState();
    invokeStateCount++;
  }

  setPlayingType(data.currently_playing_type);

  if (playingType === "unknown") {
    await sleep(1000);
    invokeStateCount++;
    return currentTrackState()
  }

  // Check if song is the same
  if (data && data.item && currentTrackId === data.item.id) {
    await playTrackAgain()
  }

  console.log(data)
  // Start track progress
  startProgress(data.progress_ms, data.is_playing);

  // UPDATE STATE
  setIsplaying(data.is_playing);
  setIsShuffle(data.shuffle_state);
  setRepeatState(data.repeat_state);
  setCurrentVolume(data.device.volume_percent);
  setCurrentTrackId(data.item.id);

  // Update DOM
  updateControllerDOM(data) // Update controller buttons
  updateSongDOM(data) // Update song info

  // Set isLiked after updateSongDOM because we this is async and is less priority
  // const getIsLiked = await checkIfTrackIsSaved(data.item.id);
  // setIsLiked(getIsLiked);

  // Hide loader
  spotifyNotOpenError(false)
}