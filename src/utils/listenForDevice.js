import { getAvailableDevices } from "./api/getAvailableDevices.js";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./tokens.js";

export const ListenForDevice = (ms) => {
  return new Promise((resolve) => {
    const interval = setInterval(async () => {
      const devices = await getAvailableDevices(ACCESS_TOKEN, REFRESH_TOKEN);
      if (devices && devices.length > 0) {
        clearInterval(interval)
        resolve(devices)
      }
    }, 1000)
    setTimeout(() => {
      clearInterval(interval)
      resolve(false)
    }, ms);
  })
}