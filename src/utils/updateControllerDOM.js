

export const updateControllerDOM = ({ state, dom }) => {
  // console.log(state)
  // console.log(dom)
  dom.toggleTrackIcon.classList = state.isPlaying ? "fas fa-pause-circle" : "fas fa-play-circle"
}