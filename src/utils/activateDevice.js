
import { checkDeviceStatus } from "./checkDeviceStatus.js";
// Yes this function does not transfer playback state, it only activates device 
// so the "currently-playing" can set the current playback state
export const activateDevice = async (ACCESS_TOKEN, REFRESH_TOKEN, devices) => {

  const res = await fetch("https://api.spotify.com/v1/me/player", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ACCESS_TOKEN}`
    },
    body: JSON.stringify({ "device_ids": [devices[0].id] })
  })

  // Device will be activated even if we get 204 error
  if (res.status === 204) {
    return false
  }

  const data = await res.json();

  // Device not found
  if (data.error && data.error.status === 404) {
    const devices = await checkDeviceStatus(ACCESS_TOKEN, REFRESH_TOKEN)
    return devices
  }

}