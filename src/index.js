import { getAvailableDevices } from "./utils/api/getAvailableDevices.js"
import { spotifyNotOpenError } from "./utils/spotifyNotOpenError.js"
import { ListenForDevice } from "./utils/listenForDevice.js"
import { hideLoader } from "./utils/hideLoader.js"
import { handleSpotifyControllers } from "./utils/handleSpotifyControllers.js"
import { currentTrackState } from "./utils/currentTrackState.js"

import { ACCESS_TOKEN, REFRESH_TOKEN, setTokens } from "./utils/tokens.js"

// DOM
const authorizeContianer = document.querySelector("[data-js=authorize]")
const loginBtn = document.querySelector("[data-js=authorize__btn]")

// Logs in user automatically when page loads
window.addEventListener("load", () => {
  chrome.storage.sync.get(["ACCESS_TOKEN", "REFRESH_TOKEN"], function (result) {

    setTokens(result.ACCESS_TOKEN, result.REFRESH_TOKEN)

    prepareInit()
  });
})

// Log in manually
loginBtn.addEventListener("click", function () {
  chrome.runtime.sendMessage({ message: "login" }, function (response) {
    if (response.message === "success") {

      setTokens(response.ACCESS_TOKEN, response.REFRESH_TOKEN)

      prepareInit()
    }

    if (response.message === "fail") {
      const error = document.querySelector("[data-js=error]")
      error.style.display = "grid";
      error.innerText = response.description
    }
  })
})

// Check if device if available before invoking initPlayer()
async function prepareInit() {
  if (ACCESS_TOKEN && REFRESH_TOKEN) {

    let devices = await getAvailableDevices();

    if (devices && devices.length === 0) {
      spotifyNotOpenError(true)

      // Listen for a device for 5 seconds, if still no app is running, return script
      // This is useful if user opens spotify and extension at the same time
      // We want to make sure we wait until spotify is detected
      const foundADevice = await ListenForDevice(5000);
      if (!foundADevice) return

      devices = foundADevice
    }

    if (!devices) return hideLoader();

    initPlayer(devices)

  } else {
    hideLoader();
  }
}

// Init player
function initPlayer(devices) {
  currentTrackState(devices)
  handleSpotifyControllers(devices);
  authorizeContianer.style.display = "none"
}
