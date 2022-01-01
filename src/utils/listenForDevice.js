import { getAvailableDevices } from "./api/getAvailableDevices.js";

export const ListenForDevice = (ms) => {
  return new Promise((resolve) => {
    const interval = setInterval(async () => {
      const devices = await getAvailableDevices();
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