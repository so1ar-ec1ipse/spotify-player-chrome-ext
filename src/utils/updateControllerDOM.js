
import { playIcon, pauseIcon, unlikeIcon, likeIcon } from "./svgIcons.js";

export const updateControllerDOM = ({ state, dom }) => {

  dom.stopTrackBtn.innerHTML = state.isPlaying ? pauseIcon() : playIcon();

  state.isLiked ? dom.heartBtn.innerHTML = unlikeIcon() : dom.heartBtn.innerHTML = likeIcon()

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
}