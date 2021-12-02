import { togglePlay } from "./utils/api/togglePlay.js"
import { skipTrack } from "./utils/api/skipTrack.js"
import { checkDeviceStatus } from "./utils/checkDeviceStatus.js"
import { spotifyNotOpenError } from "./utils/spotifyNotOpenError.js"
import { updateSongDOM } from "./utils/updateSongDOM.js"
import { updateControllerDOM } from "./utils/updateControllerDOM.js"
import { toggleShuffle } from "./utils/api/toggleShuffle.js"
// import { verifyAccess } from "./utils/verifyAccess.js"
import { refreshToken } from "./utils/refreshToken.js"
import { activateDevice } from "./utils/activateDevice.js"
import { ListenForDevice } from "./utils/listenForDevice.js"
import { sleep } from "./utils/sleep.js"
// import { ACCESS_TOKEN, REFRESH_TOKEN } from "./background.js"
let ACCESS_TOKEN = "";
let REFRESH_TOKEN = "";

// Init background script
// background();

// DOM
const authorizeContianer = document.querySelector("[data-js=authorize]")
const loginBtn = document.querySelector("[data-js=authorize__btn]")
const toggleTrackIcon = document.querySelector("[data-js=toggle-track-icon]")

const prevTrackBtn = document.querySelector("[data-js=prev-track]")
const stopTrackBtn = document.querySelector("[data-js=stop-track]")
const nextTrackBtn = document.querySelector("[data-js=next-track]")
const shuffleBtn = document.querySelector("[data-js=shuffle-btn]")
const shuffleSvg = document.querySelector("[data-js=shuffle-svg]")

// GLOBAL VARS
let isPlaying = false;
let isShuffle = false;
let currentTrackId = "";
// In some places we are re-invoking/recursing the same function
// So we keep this counter and when it gets too high we should stop
// To avoid infinite fetch requests
let invokeStateCount = 0;

// Get track state
const CurrentTrackState = async (devices) => {
  if (invokeStateCount >= 5) return

  const res = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  });

  // Error handling
  if (res.status === 204) { // If no content is returned (we need to activate device)
    // This function activates device
    const findDevices = await activateDevice(ACCESS_TOKEN, REFRESH_TOKEN, devices)
    if (findDevices && findDevices.length === 0) {
      return spotifyNotOpenError(true);
    }
    await sleep(1000);
    invokeStateCount++;
    return CurrentTrackState(devices)
  }

  const data = await res.json();

  if (data.error && data.error.status === 401) { // If ACCESS_TOKEN is invalid
    // GENERATE NEW TOKEN
    const wasSuccessful = await refreshToken(REFRESH_TOKEN);
    if (wasSuccessful) {
      invokeStateCount++;
      return CurrentTrackState(devices)
    }
    return authorizeContianer.style.display = "grid"; // make user login manually
  }

  // UPDATE CONTROLLERS DOM
  isPlaying = data.is_playing

  const dom = { toggleTrackIcon }
  const state = { isPlaying }

  updateControllerDOM({ state, dom })

  // UPDATE SONG DOM
  currentTrackId = data.item.uri
  updateSongDOM(data)
}

const SpotifyControllers = () => {
  let isSubmitting = false;

  // PREVIOUS TRACK
  prevTrackBtn.addEventListener("click", async () => {
    if (isSubmitting) return;
    isSubmitting = true;

    isSubmitting = await skipTrack("previous", ACCESS_TOKEN);
    await sleep(300)
    CurrentTrackState()
  })
  // NEXT TRACK
  nextTrackBtn.addEventListener("click", async () => {
    if (isSubmitting) return;
    isSubmitting = true;

    isSubmitting = await skipTrack("next", ACCESS_TOKEN);
    await sleep(300)
    CurrentTrackState()
  })

  // TOGGLE STOP/PLAY
  stopTrackBtn.addEventListener("click", async () => {
    if (isSubmitting) return;
    isSubmitting = true;

    if (isPlaying) {
      toggleTrackIcon.classList = "fas fa-play-circle"
      isSubmitting = await togglePlay("pause", ACCESS_TOKEN);
    } else {
      toggleTrackIcon.classList = "fas fa-pause-circle"
      isSubmitting = await togglePlay("play", ACCESS_TOKEN);
    }
    isPlaying = !isPlaying;
  })

  // TOGGLE SHUFFLE
  shuffleBtn.addEventListener("click", async () => {
    if (isSubmitting) return;
    isSubmitting = true;

    if (isShuffle) {
      shuffleSvg.style.fill = "#ffffff";
      isSubmitting = await toggleShuffle(false, ACCESS_TOKEN);
    } else {
      shuffleSvg.style.fill = "#1DB954";
      isSubmitting = await toggleShuffle(true, ACCESS_TOKEN);
    }
    isShuffle = !isShuffle;
  })
}

// Logs in user automatically when page loads
window.addEventListener("load", () => {
  chrome.storage.sync.get(["ACCESS_TOKEN", "REFRESH_TOKEN"], function (result) {
    ACCESS_TOKEN = result.ACCESS_TOKEN
    REFRESH_TOKEN = result.REFRESH_TOKEN

    prepareInit(ACCESS_TOKEN, REFRESH_TOKEN)
  });
})

// Log in manually
loginBtn.addEventListener("click", function () {
  chrome.runtime.sendMessage({ message: "login" }, function (response) {
    if (response.message === "success") {
      ACCESS_TOKEN = response.ACCESS_TOKEN
      REFRESH_TOKEN = response.REFRESH_TOKEN

      prepareInit(ACCESS_TOKEN, REFRESH_TOKEN)
    }
  })
})

// Check if device if available before invoking initPlayer()
async function prepareInit(ACCESS_TOKEN, REFRESH_TOKEN) {
  if (ACCESS_TOKEN && REFRESH_TOKEN) {
    let devices = await checkDeviceStatus(ACCESS_TOKEN, REFRESH_TOKEN);
    if (devices && devices.length === 0) {
      spotifyNotOpenError(true)

      // Listen for a device for 5 seconds, if still no app is running, return script
      // This is useful if user opens spotify and extension at the same time
      // We want to make sure we wait until spotify is detected
      const foundADevice = await ListenForDevice(5000, ACCESS_TOKEN, REFRESH_TOKEN);
      if (!foundADevice) return
      spotifyNotOpenError(false)
      devices = foundADevice
    }

    initPlayer(devices)
  }
}

// Init player
function initPlayer(devices) {
  CurrentTrackState(devices)
  SpotifyControllers();
  authorizeContianer.style.display = "none"
}
