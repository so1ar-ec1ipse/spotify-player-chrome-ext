export const playTrackAgain = async (ACCESS_TOKEN) => {

  await fetch("https://api.spotify.com/v1/me/player/seek?position_ms=0", {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    }
  });

}