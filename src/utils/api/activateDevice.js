
import { getAvailableDevices } from "./getAvailableDevices.js";
import { ACCESS_TOKEN, refreshFailed, setRefreshFailed } from "../tokens.js";
import { refreshToken } from "./refreshToken.js";
import { spotifyNotOpenError } from "../spotifyNotOpenError.js";
import { ListenForDevice } from "../listenForDevice.js";

// Yes this function does not return playback state, it only activates device 
export const activateDevice = async () => {
  if (refreshFailed) return

  // GET DEVICE BEFORE WE ACTIVATE IT
  let devices = await getAvailableDevices();

  if (devices && devices.length === 0) {
    spotifyNotOpenError(true)

    // Listen for a device for 5 seconds, if still no app is running, return script
    // This is useful if user opens spotify and extension at the same time
    // We want to make sure we wait until spotify is detected
    const foundADevice = await ListenForDevice(5000);
    console.log(foundADevice)
    if (!foundADevice) return [];

    devices = foundADevice
  }

  // if (!devices) return hideLoader();

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

  // Access token failed
  if (res.status === 401) {
    const success = await refreshToken();
    if (success) return activateDevice(devices);
    return setRefreshFailed(true)
  }

  // Device not found
  if (res.status === 404) {
    const devices = await getAvailableDevices()
    return devices
  }

}