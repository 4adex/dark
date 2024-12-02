
// console.log('storageListener.js loaded');

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === 'storeData') {
//       const data = message.data;
//       // Store data in chrome.storage
//       chrome.storage.local.get(['darkPatterns'], (result) => {
//         let darkPatterns = result.darkPatterns || [];
//         darkPatterns.push(data);
//         chrome.storage.local.set({ darkPatterns: darkPatterns }, () => {
//           console.log('Data stored successfully');
//         });
//       });
//     }
//   });