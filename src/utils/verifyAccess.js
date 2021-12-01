// export const verifyAccess = async (state) => {
//   let savedState = "";
//   chrome.storage.sync.get(["state"], function (result) {
//     savedState = result.state
//   });

//   let codeVerifier = "";
//   chrome.storage.sync.get(['codeVerifier'], function (result) {
//     codeVerifier = result.codeVerifier
//   });

//   async function waitForStorageSync() {
//     return await new Promise((resolve) => {
//       const interval = setInterval(() => {
//         if (codeVerifier && state === savedState) {
//           clearInterval(interval);
//           resolve();
//         }
//       }, 50);
//     });
//   };

//   setTimeout(() => {
//     if (!codeVerifier || state !== savedState) {
//       return alert("Something went wrong. Try again later")
//     }
//   }, 1000 * 10)

//   await waitForStorageSync();

//   return codeVerifier
// }