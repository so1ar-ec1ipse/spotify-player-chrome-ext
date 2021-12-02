
import { playIcon, pauseIcon } from "./svgIcons.js";

export const updateControllerDOM = ({ state, dom }) => {
  // console.log(state)
  // console.log(dom)
  dom.stopTrackBtn.innerHTML = state.isPlaying ? pauseIcon() : playIcon();
  // dom.toggleTrackIcon.classList = state.isPlaying ? "fas fa-pause-circle" : "fas fa-play-circle"
}