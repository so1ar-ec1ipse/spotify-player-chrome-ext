export const toggleSaveTrack = async (isLiked, trackId, ACCESS_TOKEN) => {

  await fetch(`https://api.spotify.com/v1/me/tracks?ids=${trackId}`, {
    method: isLiked ? "DELETE" : "PUT",
    headers: {
      "Authorization": `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  })

  return false;
}