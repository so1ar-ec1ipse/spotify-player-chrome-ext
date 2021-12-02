export const toggleShuffle = async (bool, ACCESS_TOKEN) => {
  await fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${bool}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "Content-Type: application/json"
    }
  })

  return false;
}