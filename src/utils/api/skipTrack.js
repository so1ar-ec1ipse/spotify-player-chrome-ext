export const skipTrack = async (action, ACCESS_TOKEN) => {

  const res = await fetch(`https://api.spotify.com/v1/me/player/${action}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "Content-Type: application/json"
    }
  });

  if (res.status === 403 && action === "previous") {
    await fetch("https://api.spotify.com/v1/me/player/seek?position_ms=0", {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "Content-Type: application/json"
      }
    });
  }

  return false;
}