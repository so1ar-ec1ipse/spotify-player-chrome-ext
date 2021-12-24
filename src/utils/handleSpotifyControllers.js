// Import DOM
import { playIcon, pauseIcon, unlikeIcon, likeIcon } from "./svgIcons.js";

import { togglePlay } from "./api/togglePlay.js"
import { setRepeat } from "./api/setRepeat.js"
import { setVolume } from "./api/setVolume.js"
import { skipTrack } from "./api/skipTrack.js"
import { toggleSaveTrack } from "./api/toggleSaveTrack.js"
import { toggleShuffle } from "./api/toggleShuffle.js"
import { setVolumeIcon } from "./setVolumeIcon.js";

import { sleep } from "./sleep.js";

import { currentTrackState } from "./currentTrackState.js";

import {
  prevTrackBtn, stopTrackBtn, nextTrackBtn, shuffleBtn, shuffleIcon, shuffleBlob,
  repeatBtn, repeatIcon, repeatBlob, repeatTrackBlob, musicBullet, musicWave,
  volumeBtn, volumeInput, heartBtn
} from "./spotifyControllerDOM.js";

let prevVolume = 10;

export let isPlaying = false;
export let isShuffle = false;
export let isLiked = false;
export let currentVolume = 0; // range 0-100
export let repeatState = "off";
export let currentTrackId = "";
export let playingType = ""; // either "track" or episode

export const setIsplaying = (bool) => isPlaying = bool;
export const setIsShuffle = (bool) => isShuffle = bool;
export const setIsLiked = (bool) => isLiked = bool;
export const setCurrentVolume = (int) => currentVolume = int;
export const setRepeatState = (str) => repeatState = str;
export const setCurrentTrackId = (str) => currentTrackId = str;
export const setPlayingType = (str) => playingType = str;

export const showMusicWave = () => {
  musicWave.style.visibility = "visible";
  musicBullet.style.display = "none";
}

export const handleSpotifyControllers = () => {
  let isSubmitting = false;

  // PREVIOUS TRACK
  prevTrackBtn.addEventListener("click", async () => {
    if (isSubmitting) return;
    isSubmitting = true;
    await skipTrack("previous");
    isSubmitting = false;

    await sleep(playingType === "track" ? 300 : 1000)
    currentTrackState()
  })
  // NEXT TRACK
  nextTrackBtn.addEventListener("click", async () => {
    if (isSubmitting) return;
    isSubmitting = true;
    await skipTrack("next");
    isSubmitting = false

    await sleep(playingType === "track" ? 300 : 1000)
    currentTrackState()
  })

  // TOGGLE STOP/PLAY
  stopTrackBtn.addEventListener("click", async () => {
    if (isSubmitting) return;
    isSubmitting = true;

    if (isPlaying) {
      stopTrackBtn.innerHTML = playIcon();
      musicWave.style.visibility = "hidden";
      musicBullet.style.display = "block";
      await togglePlay("pause");
    } else {
      stopTrackBtn.innerHTML = pauseIcon();
      musicWave.style.visibility = "";
      musicBullet.style.display = "";
      await togglePlay("play");
    }
    isSubmitting = false;
    isPlaying = !isPlaying;
  })

  // TOGGLE SHUFFLE
  shuffleBtn.addEventListener("click", async () => {
    if (isSubmitting) return;
    isSubmitting = true;

    if (isShuffle) {
      shuffleIcon.style.stroke = "";
      shuffleBlob.style.display = "";
      await toggleShuffle(false);
    } else {
      shuffleIcon.style.stroke = "#1DB954";
      shuffleBlob.style.display = "block";
      const status = await toggleShuffle(true);
      if (status === 403) {
        shuffleIcon.style.stroke = "";
        shuffleBlob.style.display = "";
        isSubmitting = false;
        return
      }
    }
    isSubmitting = false;
    isShuffle = !isShuffle;
  })

  repeatBtn.addEventListener("click", async () => {
    if (isSubmitting) return;
    isSubmitting = true;

    if (repeatState === "off") {
      repeatIcon.style.stroke = "#1DB954";
      repeatBlob.style.display = "block";

      const status = await setRepeat("context")
      if (status === 403) {
        repeatIcon.style.stroke = "";
        repeatBlob.style.display = "";
        repeatTrackBlob.style.display = ""
        isSubmitting = false;
        return
      }
      repeatState = "context"
    } else if (repeatState === "context") {
      repeatTrackBlob.style.display = "grid"

      const status = await setRepeat("track")
      if (status === 403) {
        repeatIcon.style.stroke = "";
        repeatBlob.style.display = "";
        repeatTrackBlob.style.display = ""
        isSubmitting = false;
        return
      }
      repeatState = "track"
    } else {
      repeatIcon.style.stroke = "";
      repeatBlob.style.display = "";
      repeatTrackBlob.style.display = ""

      await setRepeat("off")
      repeatState = "off"
    }
    isSubmitting = false;

  })

  heartBtn.addEventListener("click", async () => {
    if (isSubmitting) return;
    isSubmitting = true;

    isLiked ? heartBtn.innerHTML = unlikeIcon() : heartBtn.innerHTML = likeIcon()
    if (!isLiked) {
      heartBtn.classList.add("like-animation")
      setTimeout(() => heartBtn.classList.remove("like-animation"), 400)
    }

    await toggleSaveTrack(isLiked, currentTrackId)
    isSubmitting = false;
    isLiked = !isLiked;
  })


  volumeInput.addEventListener("change", async (e) => {
    if (isSubmitting) return;
    isSubmitting = true;

    const VOLUME = parseInt(e.target.value)
    await setVolume(VOLUME)
    isSubmitting = false;
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
      await setVolume(prevVolume)
      currentVolume = prevVolume;
    } else {
      setVolumeIcon(0)
      await setVolume(0)
      prevVolume = currentVolume;
      currentVolume = 0;
    }
    isSubmitting = false;

  })

}