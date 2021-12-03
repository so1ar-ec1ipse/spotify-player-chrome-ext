export const checkIfTrackIsSaved = async (songId, ACCESS_TOKEN) => {
  const res = await fetch(`https://api.spotify.com/v1/me/tracks/contains?ids=${songId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    }
  })
  const data = await res.json();

  return data[0]
}