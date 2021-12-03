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
import { playIcon, pauseIcon, likeIcon, unlikeIcon, volumeMute, volumeLow, volumeMedium, volumeHigh } from "./utils/svgIcons.js"
import { setRepeat } from "./utils/api/setRepeat.js"
import { toggleSaveTrack } from "./utils/api/toggleSaveTrack.js"
import { checkIfTrackIsSaved } from "./utils/api/checkIfTrackIsSaved.js"
import { hideLoader } from "./utils/hideLoader.js"
import { playTrackAgain } from "./utils/api/playTrackAgain.js"
import { setVolume } from "./utils/api/setVolume.js"
import { setVolumeIcon } from "./utils/setVolumeIcon.js"
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
const repeatBtn = document.querySelector("[data-js=repeat-btn]")
const shuffleIcon = document.querySelector("[data-js=shuffle-icon]")
const shuffleBlob = document.querySelector("[data-js=shuffle-blob]")
const repeatIcon = document.querySelector("[data-js=repeat-icon]")
const repeatBlob = document.querySelector("[data-js=repeat-blob]")
const repeatTrackBlob = document.querySelector("[data-js=repeat-track-blob]")
const musicWave = document.querySelector("[data-js=music-wave]")
const musicBullet = document.querySelector("[data-js=music-bullet]")
const heartBtn = document.querySelector("[data-js=heart-btn]")

const volumeInput = document.querySelector("[data-js=volume-input]")
const animateVolume = document.querySelector("[data-js=animate-volume]")
const animateVolumeFill = document.querySelector("[data-js=animate-volume-fill]")
const volumeBtn = document.querySelector("[data-js=volume-btn]")


// GLOBAL VARS
let isPlaying = false;
let isShuffle = false;
let isLiked = false;
let prevVolume = 10;
let currentVolume = 0; // range 0-100
let repeatState = "off";
let currentTrackId = "";
// In some places we are re-invoking/recursing the same function
// So we keep this counter and when it gets too high we should stop
// To avoid infinite fetch requests
let invokeStateCount = 0;

let playingType = ""; // either "track" or episode

// Get track state
const CurrentTrackState = async (devices) => {
  if (invokeStateCount >= 5) return

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
    const findDevices = await activateDevice(ACCESS_TOKEN, REFRESH_TOKEN, devices)
    if (findDevices && findDevices.length === 0) {
      return spotifyNotOpenError(true);
    }
    await sleep(1000);
    invokeStateCount++;
    return CurrentTrackState(devices)
  }

  const data = await res.json();

  playingType = data.currently_playing_type;

  if (playingType === "unknown") {
    await sleep(1000);
    invokeStateCount++;
    return CurrentTrackState(devices)
  }

  // Check if song is the same
  if (data && data.item && currentTrackId === data.item.id) {
    await playTrackAgain(ACCESS_TOKEN)
  }

  if (data.error && data.error.status === 401) { // If ACCESS_TOKEN is invalid
    // GENERATE NEW TOKEN
    console.log("OLD ACCESS_TOKEN: " + ACCESS_TOKEN)
    const wasSuccessful = await refreshToken(REFRESH_TOKEN);
    if (wasSuccessful) {
      console.log("Was Successful!")
      invokeStateCount++;
      return CurrentTrackState(devices)
    }

    hideLoader();
    authorizeContianer.style.display = "grid"; // make user login manually
    return
  }

  // UPDATE CONTROLLERS DOM
  isPlaying = data.is_playing;
  isShuffle = data.shuffle_state;
  repeatState = data.repeat_state;
  currentVolume = data.device.volume_percent;
  console.log(data)
  isLiked = await checkIfTrackIsSaved(data.item.id, ACCESS_TOKEN);

  const dom = {
    stopTrackBtn, shuffleIcon, shuffleBtn, shuffleBlob, repeatIcon, repeatBlob, repeatTrackBlob, repeatBtn,
    musicWave, musicBullet, heartBtn, volumeInput, animateVolume, animateVolumeFill,
  }
  const state = { isPlaying, isShuffle, repeatState, isLiked, currentVolume }

  updateControllerDOM({ state, dom }, playingType)

  // UPDATE SONG DOM
  currentTrackId = data.item.id
  updateSongDOM(data, playingType)

  // Hide loader
  spotifyNotOpenError(false)
}


const SpotifyControllers = () => {
  let isSubmitting = false;

  // PREVIOUS TRACK
  prevTrackBtn.addEventListener("click", async () => {
    if (isSubmitting) return;
    isSubmitting = true;

    isSubmitting = await skipTrack("previous", ACCESS_TOKEN);
    await sleep(playingType === "track" ? 300 : 1000)
    CurrentTrackState()
  })
  // NEXT TRACK
  nextTrackBtn.addEventListener("click", async () => {
    if (isSubmitting) return;
    isSubmitting = true;

    isSubmitting = await skipTrack("next", ACCESS_TOKEN);
    await sleep(playingType === "track" ? 300 : 1000)
    CurrentTrackState()
  })

  // TOGGLE STOP/PLAY
  stopTrackBtn.addEventListener("click", async () => {
    if (isSubmitting) return;
    isSubmitting = true;

    if (isPlaying) {
      stopTrackBtn.innerHTML = playIcon();
      musicWave.style.visibility = "hidden";
      musicBullet.style.display = "block";
      isSubmitting = await togglePlay("pause", ACCESS_TOKEN);
    } else {
      stopTrackBtn.innerHTML = pauseIcon();
      musicWave.style.visibility = "";
      musicBullet.style.display = "";
      isSubmitting = await togglePlay("play", ACCESS_TOKEN);
    }
    isPlaying = !isPlaying;
  })

  // TOGGLE SHUFFLE
  shuffleBtn.addEventListener("click", async () => {
    if (isSubmitting) return;
    isSubmitting = true;

    if (isShuffle) {
      shuffleIcon.style.stroke = "";
      shuffleBlob.style.display = "";
      isSubmitting = await toggleShuffle(false, ACCESS_TOKEN);
    } else {
      shuffleIcon.style.stroke = "#1DB954";
      shuffleBlob.style.display = "block";
      isSubmitting = await toggleShuffle(true, ACCESS_TOKEN);
    }
    isShuffle = !isShuffle;
  })

  repeatBtn.addEventListener("click", async () => {
    if (isSubmitting) return;
    isSubmitting = true;

    if (repeatState === "off") {
      repeatIcon.style.stroke = "#1DB954";
      repeatBlob.style.display = "block";

      isSubmitting = await setRepeat("context", ACCESS_TOKEN)
      repeatState = "context"
    } else if (repeatState === "context") {
      repeatTrackBlob.style.display = "grid"

      isSubmitting = await setRepeat("track", ACCESS_TOKEN)
      repeatState = "track"
    } else {
      repeatIcon.style.stroke = "";
      repeatBlob.style.display = "";
      repeatTrackBlob.style.display = ""

      isSubmitting = await setRepeat("off", ACCESS_TOKEN)
      repeatState = "off"
    }

  })

  heartBtn.addEventListener("click", async () => {
    if (isSubmitting) return;
    isSubmitting = true;

    isLiked ? heartBtn.innerHTML = unlikeIcon() : heartBtn.innerHTML = likeIcon()
    if (!isLiked) {
      heartBtn.classList.add("like-animation")
      setTimeout(() => heartBtn.classList.remove("like-animation"), 400)
    }

    isSubmitting = await toggleSaveTrack(isLiked, currentTrackId, ACCESS_TOKEN)
    isLiked = !isLiked;
  })


  volumeInput.addEventListener("change", async (e) => {
    if (isSubmitting) return;
    isSubmitting = true;

    const VOLUME = parseInt(e.target.value)
    isSubmitting = await setVolume(VOLUME, ACCESS_TOKEN)
    currentVolume = VOLUME
  })

  volumeInput.addEventListener("input", (e) => {

    const VOLUME = parseInt(e.target.value)

    setVolumeIcon(VOLUME)

  })

  volumeBtn.addEventListener("click", async () => {
    if (isSubmitting) return;
    isSubmitting = true;

    if (currentVolume === 0) {
      setVolumeIcon(prevVolume)
      isSubmitting = await setVolume(prevVolume, ACCESS_TOKEN)
      currentVolume = prevVolume;
    } else {
      setVolumeIcon(0)
      isSubmitting = await setVolume(0, ACCESS_TOKEN)
      prevVolume = currentVolume;
      currentVolume = 0;
    }

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
      // spotifyNotOpenError(false)
      devices = foundADevice
    }

    initPlayer(devices)
  } else {
    hideLoader();
  }
}

// Init player
function initPlayer(devices) {
  CurrentTrackState(devices)
  SpotifyControllers();
  authorizeContianer.style.display = "none"
}
