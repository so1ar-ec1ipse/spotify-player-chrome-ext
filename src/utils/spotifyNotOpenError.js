import { hideLoader } from "./hideLoader.js";

export const spotifyNotOpenError = (bool) => {
  const authorize = document.querySelector("[data-js=authorize]")
  const spotifyOpener = document.querySelector("[data-js=spotify-opener]")

  if (bool) {
    authorize.style.display = "none";
    spotifyOpener.style.display = "grid";
  } else {
    authorize.style.display = "none";
    spotifyOpener.style.display = "none";
  }

  hideLoader();

}