// let allInputs = document.getElementsByTagName("input");
//  if(allInputs.length > 0){
//      for(let i=0; i<allInputs.length; i++){
//          if (allInputs[i].type == 'checkbox'){
//            allInputs[i].checked = false;
//          //   count++;
//          }
//          }
//      }
//  alert("Unchecked " + allInputs.length + " boxes, which were a potential to be misled to be used.");



console.log('storageListener.js loaded');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'storeData') {
      const data = message.data;
      // Store data in chrome.storage
      chrome.storage.local.get(['darkPatterns'], (result) => {
        let darkPatterns = result.darkPatterns || [];
        darkPatterns.push(data);
        chrome.storage.local.set({ darkPatterns: darkPatterns }, () => {
          console.log('Data stored successfully');
        });
      });
    }
  });