// When Action Icon is clicked
chrome.action.onClicked.addListener((tab) => {
    
    // Open Side Panel
    chrome.sidePanel.open({ tabId: tab.id }, () => {
        console.log("Side Panel Opened");
    });
});


// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     console.log('clickjack ka received message');
//     if (request.action === 'possibleClickjack' && request.susIframes) {
//       chrome.storage.local.set({ 'susIframes': request.susIframes }, function() {
//         // chrome.action.openPopup();
//       });
//     }
// });