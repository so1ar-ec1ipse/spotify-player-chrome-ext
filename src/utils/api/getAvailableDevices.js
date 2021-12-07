import { refreshToken } from "./refreshToken.js"
import { ACCESS_TOKEN, refreshFailed, setRefreshFailed } from "../tokens.js";

export const getAvailableDevices = async () => {
  if (refreshFailed) return

  const res = await fetch("https://api.spotify.com/v1/me/player/devices", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    }
  })
  const data = await res.json()

  // REFRESH ACCESS TOKEN
  if (data.error && data.error.status === 401) {
    const success = await refreshToken();
    if (success) return getAvailableDevices();
    setRefreshFailed(true)
    return false;
  }

  return data.devices
}