// import ColorThief from "../libs/ColorThief.mjs"
import { playingType, showMusicWave } from "./handleSpotifyControllers.js"

const albumCover = document.querySelector("[data-js=album-cover]")
const songName = document.querySelector("[data-js=song__name]")
const songArtists = document.querySelector("[data-js=song__artists]")
const mainContainer = document.querySelector("[data-js=main]")
const song = document.querySelector("[data-js=song]")

const fillVolume = document.querySelector("[data-js=fill-volume]")

let timeoutArr = []
let intervalArr = []

const colorThief = new ColorThief();

export const updateSongDOM = (data) => {

  if (playingType === "track") {
    const imageUrl = data.item.album.images.filter(x => x.width === 300)[0].url
    albumCover.src = imageUrl

    songArtists.innerHTML = generateArtistsHTML(data.item.artists)
  }

  if (playingType === "episode") {
    const imageUrl = data.item.images.filter(x => x.width === 300)[0].url
    albumCover.src = imageUrl;

    songArtists.innerHTML = `<a href="${data.item.show.external_urls.spotify}" target="_blank">${data.item.show.name}</a>`
  }

  if (data.is_playing) {
    showMusicWave();
  }

  songName.innerText = data.item.name;
  songName.href = data.item.external_urls.spotify


  // clear possible timeouts and intervals 
  clearSlideState();

  // Make sure image is finished loading
  if (albumCover.complete) {
    setColor(colorThief.getColor(albumCover))
  } else {
    albumCover.addEventListener('load', function () {
      setColor(colorThief.getColor(albumCover))
    }, { once: true });
  }

  function setColor(color) {
    mainContainer.style.background = `rgb(${color[0]},${color[1]},${color[2]})`

    // Check color brightness
    const luma = 0.2126 * color[0] + 0.7152 * color[1] + 0.0722 * color[2]; // per ITU-R BT.709

    if (luma < 50) {
      fillVolume.style.background = "white"
    } else {
      fillVolume.style.background = `rgb(${color[0]},${color[1]},${color[2]})`
    }

  }

  handleSongNameSlide()
}

function handleSongNameSlide() {
  const SONG_WIDTH = song.offsetWidth;
  const NAME_WIDTH = songName.offsetWidth;
  const ARTIST_WIDTH = songArtists.offsetWidth;

  if (NAME_WIDTH > SONG_WIDTH) {
    // Calculate animation time
    const LENGTH = NAME_WIDTH - SONG_WIDTH

    // Change these values for different slide speed & delay
    const ANIMATION_TIME = LENGTH / 20;
    const intervalDelay = 2500;

    createAnimationLoop(songName, LENGTH, ANIMATION_TIME, intervalDelay)

  }

  if (ARTIST_WIDTH > SONG_WIDTH) {
    // Calculate animation time
    const LENGTH = ARTIST_WIDTH - SONG_WIDTH

    // Change these values for different slide speed & delay
    const ANIMATION_TIME = LENGTH / 24;
    const intervalDelay = 2500;

    createAnimationLoop(songArtists, LENGTH, ANIMATION_TIME, intervalDelay)
  }


  function createAnimationLoop(slideElement, LENGTH, ANIMATION_TIME, intervalDelay) {

    slideElement.style.transition = `${ANIMATION_TIME}s linear`

    const timeout1 = setTimeout(() => {
      slideElement.style.transform = `translate3d(-${LENGTH}px, 0, 0)`

      const timeout2 = setTimeout(() => {
        slideElement.style.transform = `translate3d(0, 0, 0)`

        const interval2 = setInterval(() => {
          slideElement.style.transform = "translate3d(0, 0, 0)"
        }, ((ANIMATION_TIME * 1000) * 2) + intervalDelay * 2)

        intervalArr.push(interval2)

      }, (ANIMATION_TIME * 1000) + intervalDelay)

      timeoutArr.push(timeout2)

      const interval1 = setInterval(() => {
        slideElement.style.transform = `translate3d(-${LENGTH}px, 0, 0)`
      }, ((ANIMATION_TIME * 1000) * 2) + intervalDelay * 2)

      intervalArr.push(interval1)

    }, 2000)

    timeoutArr.push(timeout1)


  }

}

function clearSlideState() {
  timeoutArr.forEach((id) => clearTimeout(id))
  intervalArr.forEach((id) => clearInterval(id))
  timeoutArr = []
  intervalArr = []

  // Clear dom
  songName.style.transition = ""
  songArtists.style.transition = ""
  songName.style.transform = ""
  songArtists.style.transform = ""

}

function generateArtistsHTML(artists) {
  let html = "";

  artists.forEach((artist, idx) => {
    html += `<a href=${artist.external_urls.spotify} target="_blank">${artist.name}</a>${idx === artists.length - 1 ? "" : ", "}`
  })

  return html;
}