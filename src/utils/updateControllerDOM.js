
import { setVolumeIcon } from "./setVolumeIcon.js";
import { playIcon, pauseIcon, unlikeIcon, likeIcon } from "./svgIcons.js";

export const updateControllerDOM = ({ state, dom }, playingType) => {

  if (playingType === "episode") {
    dom.shuffleBtn.disabled = true
    dom.repeatBtn.disabled = true
    dom.heartBtn.disabled = true

    dom.shuffleBtn.style.cursor = "not-allowed"
    dom.repeatBtn.style.cursor = "not-allowed"
    dom.heartBtn.style.cursor = "not-allowed"
  }

  dom.stopTrackBtn.innerHTML = state.isPlaying ? pauseIcon() : playIcon();

  state.isLiked ? dom.heartBtn.innerHTML = likeIcon() : dom.heartBtn.innerHTML = unlikeIcon()

  if (!state.isPlaying) {
    dom.musicWave.style.visibility = "hidden";
    dom.musicBullet.style.display = "block";
  }

  if (state.isShuffle) {
    dom.shuffleIcon.style.stroke = "#1DB954";
    dom.shuffleBlob.style.display = "block";
  }

  if (state.repeatState === "context" || state.repeatState === "track") {
    dom.repeatIcon.style.stroke = "#1DB954";
    dom.repeatBlob.style.display = "block";
    if (state.repeatState === "track") {
      dom.repeatTrackBlob.style.display = "grid"
    }
  }

  setVolumeIcon(state.currentVolume)
}