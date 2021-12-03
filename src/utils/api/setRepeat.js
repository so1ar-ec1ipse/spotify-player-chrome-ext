export const setRepeat = async (action, ACCESS_TOKEN) => {

  await fetch(`https://api.spotify.com/v1/me/player/repeat?state=${action}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    }
  })

  return false;
}