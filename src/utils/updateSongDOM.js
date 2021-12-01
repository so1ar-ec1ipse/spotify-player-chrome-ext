const albumCover = document.querySelector("[data-js=album-cover]")
const songName = document.querySelector("[data-js=song__name]")
const songArtists = document.querySelector("[data-js=song__artists]")
const mainContainer = document.querySelector("[data-js=main]")

export const updateSongDOM = (data) => {
  let commaSeperatedArtists = ""
  data.item.artists.forEach((obj, idx) => {
    commaSeperatedArtists += `${obj.name}${idx === data.item.artists.length - 1 ? "" : ","} `
  })

  albumCover.src = data.item.album.images[0].url;
  songName.innerText = data.item.name;
  songArtists.innerText = commaSeperatedArtists;

  const colorThief = new ColorThief();

  // Make sure image is finished loading
  if (albumCover.complete) {
    setColor(colorThief.getColor(albumCover))
  } else {
    albumCover.addEventListener('load', function () {
      setColor(colorThief.getColor(albumCover))
    });
  }

  function setColor(color) {
    mainContainer.style.background = `linear-gradient(90deg, rgb(${color[0]},${color[1]},${color[2]}) 0%, rgb(25,20,20) 80%)`
  }
}