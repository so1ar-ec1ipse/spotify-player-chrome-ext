import { getAvailableDevices } from "./utils/api/getAvailableDevices.js"
import { spotifyNotOpenError } from "./utils/spotifyNotOpenError.js"
import { ListenForDevice } from "./utils/listenForDevice.js"
import { hideLoader, showLoader } from "./utils/hideLoader.js"
import { handleSpotifyControllers } from "./utils/handleSpotifyControllers.js"
import { currentTrackState } from "./utils/currentTrackState.js"

import { ACCESS_TOKEN, REFRESH_TOKEN, setTokens } from "./utils/tokens.js"

import "./styles/main.scss";

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
      showLoader()

      setTokens(response.ACCESS_TOKEN, response.REFRESH_TOKEN)

      prepareInit()
    }

    if (response.message === "fail") {
      const error = document.querySelector("[data-js=error]")
      error.style.display = "grid";
      error.innerText = response.description.message;
    }
  })
})

// Check if device if available before invoking initPlayer()
async function prepareInit() {
  if (ACCESS_TOKEN && REFRESH_TOKEN) {
    initPlayer()
  } else {
    hideLoader();
  }
}

// Init player
function initPlayer() {
  currentTrackState()
  handleSpotifyControllers();
  authorizeContianer.style.display = "none"
}
