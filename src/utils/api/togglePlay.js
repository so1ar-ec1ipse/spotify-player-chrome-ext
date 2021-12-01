export const togglePlay = async (action, ACCESS_TOKEN) => {
  await fetch(`https://api.spotify.com/v1/me/player/${action}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "Content-Type: application/json"
    }
  })
}