import { checkDeviceStatus } from "./checkDeviceStatus.js";

export const ListenForDevice = (ms, ACCESS_TOKEN, REFRESH_TOKEN) => {
  return new Promise((resolve) => {
    const interval = setInterval(async () => {
      const devices = await checkDeviceStatus(ACCESS_TOKEN, REFRESH_TOKEN);
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