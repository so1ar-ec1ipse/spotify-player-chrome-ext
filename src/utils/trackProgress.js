export let PROGRESS_MS = 0;
export let TRACK_IS_PLAYING = true;

export const startProgress = (currentProgress, isPlaying) => {
  PROGRESS_MS = currentProgress;
  TRACK_IS_PLAYING = isPlaying;

  if (!isPlaying) return;

  setInterval(async () => {
    if (!TRACK_IS_PLAYING) await pauseProgress()
    PROGRESS_MS += 500;
  }, 500)
}

export const setNewProgress = (newProgress) => {
  PROGRESS_MS = newProgress;
}

export const setTrackIsPlaying = (bool) => {
  TRACK_IS_PLAYING = bool;
}

const pauseProgress = () => {
  return new Promise(resolve => {
    while (TRACK_IS_PLAYING) {
      return resolve()
    }
  })
}