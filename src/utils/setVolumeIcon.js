import { volumeMute, volumeLow, volumeMedium, volumeHigh } from "./svgIcons.js"
const animateVolume = document.querySelector("[data-js=animate-volume]")
const animateVolumeFill = document.querySelector("[data-js=animate-volume-fill]")
const volumeBtn = document.querySelector("[data-js=volume-btn]")

export const setVolumeIcon = (VOLUME) => {

  animateVolumeFill.style.transform = `translate3d(-${100 - VOLUME}%, 0, 0)`
  animateVolume.style.transform = `translate3d(-${100 - VOLUME}%, -50%, 0)`

  if (VOLUME === 0) {
    volumeBtn.innerHTML = volumeMute();
  } else if (VOLUME <= 33) {
    volumeBtn.innerHTML = volumeLow();
  } else if (VOLUME <= 66) {
    volumeBtn.innerHTML = volumeMedium();
  } else {
    volumeBtn.innerHTML = volumeHigh();
  }

}