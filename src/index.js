import { togglePlay } from "./utils/api/togglePlay.js"
import { skipTrack } from "./utils/api/skipTrack.js"
import { checkDeviceStatus } from "./utils/checkDeviceStatus.js"
import { spotifyNotOpenError } from "./utils/spotifyNotOpenError.js"
import { updateSongDOM } from "./utils/updateSongDOM.js"
import { updateControllerDOM } from "./utils/updateControllerDOM.js"
// import { verifyAccess } from "./utils/verifyAccess.js"
import { refreshToken } from "./utils/refreshToken.js"
import { activateDevice } from "./utils/activateDevice.js"
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

// GLOBAL VARS
let isPlaying = false;
let currentTrackId = "";
let localUpdate = false;
let authoAuthOFailed = false; // failsafe if refreshtoken fails
let deviceNotFound = false;

// Get track state
const CurrentTrackState = async (devices) => {
  if (authoAuthOFailed || deviceNotFound) return;

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
      spotifyNotOpenError(true);
      deviceNotFound = true;
      // This function will await forever until user opens spotify!
      devices = await ListenForSpotifyToOpen(ACCESS_TOKEN, REFRESH_TOKEN)
      spotifyNotOpenError(false)
      deviceNotFound = false;
    } else {
      devices = findDevices
    }
    return
  }

  const data = await res.json();

  if (data.error && data.error.status === 401) { // If ACCESS_TOKEN is invalid
    // GENERATE NEW TOKEN
    const wasSuccessful = await refreshToken(REFRESH_TOKEN);
    if (wasSuccessful) {
      return CurrentTrackState(devices)
    }
    // If we could not refresh token
    return authoAuthOFailed = true;
  }
  if (localUpdate) return; // When updating state on the popup extension, we dont want to update below vars

  // UPDATE CONTROLLERS DOM
  isPlaying = data.is_playing

  const dom = { toggleTrackIcon }
  const state = { isPlaying }

  updateControllerDOM({ state, dom })

  // UPDATE SONG DOM
  if (currentTrackId !== data.item.uri) {
    currentTrackId = data.item.uri
    updateSongDOM(data)
  }
}

const SpotifyControllers = () => {

  prevTrackBtn.addEventListener("click", async () => {
    skipTrack("previous", ACCESS_TOKEN);
  })
  stopTrackBtn.addEventListener("click", async () => {
    if (isPlaying) {
      togglePlay("pause", ACCESS_TOKEN);
      isPlaying = false;
      toggleTrackIcon.classList = isPlaying ? "fas fa-pause-circle" : "fas fa-play-circle"
    } else {
      togglePlay("play", ACCESS_TOKEN);
      isPlaying = true;
      toggleTrackIcon.classList = isPlaying ? "fas fa-pause-circle" : "fas fa-play-circle"
    }

    localUpdate = true;
    setTimeout(() => localUpdate = false, 1000)
  })
  nextTrackBtn.addEventListener("click", async () => {
    skipTrack("next", ACCESS_TOKEN);
  })
}


async function ListenForSpotifyToOpen() {
  return await new Promise((resolve) => {
    const interval = setInterval(async () => {
      const devices = await checkDeviceStatus(ACCESS_TOKEN, REFRESH_TOKEN)
      if (devices && devices.length > 0) {
        clearInterval(interval);
        resolve(devices);
      }
    }, 1000);
  });
};


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
      authoAuthOFailed = false;
      deviceNotFound = false;

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
      // This function will await forever until user opens spotify!
      devices = await ListenForSpotifyToOpen(ACCESS_TOKEN, REFRESH_TOKEN)
      spotifyNotOpenError(false)
    }

    initPlayer(devices)
  }
}

// Init player
function initPlayer(devices) {
  CurrentTrackState(devices)
  setInterval(() => {
    CurrentTrackState(devices);
  }, 1000);
  SpotifyControllers();
  authorizeContianer.style.display = "none"
}
