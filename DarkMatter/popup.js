document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get('susIframes', function(data) {
      const iframeList = document.getElementById('iframeList');
      if (data.susIframes && data.susIframes.length > 0) {
        data.susIframes.forEach(function(iframe) {
          const li = document.createElement('li');
          li.textContent = iframe.src;
          iframeList.appendChild(li);
        });
      } else {
        iframeList.textContent = 'No suspicious iframes found.';
      }
    });
  });