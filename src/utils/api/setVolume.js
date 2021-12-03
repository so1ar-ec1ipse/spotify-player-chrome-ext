export const setVolume = async (volume, ACCESS_TOKEN) => {

  await fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    }
  });

  // const data = await res.json()
  // console.log(data)


  return false;
}