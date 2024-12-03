import Card from "./card";
import reviews from "../assets/Clickjack.png";
function EvaluateReviews() {
  const handleClick = async () => {
    let [tab] = await chrome.tabs.query({ active: true });
    // giving generic params to executeScript for handling args
    chrome.scripting.executeScript<string[], void>({
      target: { tabId: tab.id! },
      args: [],
      func: scanForIframes,
    });
  };

  const scanForIframes = () => {
    // code to scan and show iframes.
    const iframes = document.querySelectorAll("iframe");
    var susIframes = [];
    var possibleClickjack = false;
    for(var i = 0; i < iframes.length; i++) {
      if (iframes[i].style.visibility != 'hidden' || iframes[i].style.display != 'none' || iframes[i].style.opacity != '0' || iframes[i].style.zIndex != '-999999') {
          if (iframes[i].src != location.hostname) {
              iframes[i].parentNode?.removeChild(iframes[i]);
              susIframes.push(iframes[i]);
              possibleClickjack = true;
          }
      }
    }
    if (possibleClickjack) {
      //Open up a chrome popup to show the user the possible clickjacking iframes
      console.log("Possible Clickjack detected and opening a window now");
      // var w = window.open('', 'Clickjacking Detected', 'width=400,height=200');
      // w.document.write("<h1>Clickjacking detected</h1>");
      // w.document.write("<p>Following iframes are detected which might be clickjacking:</p>");
      // for(var i = 0; i < susIframes.length; i++) {
      //   w.document.write("<p>" + susIframes[i].src + "</p>");
      // }
      // w.document.write("<style>body { margin: 0; overflow: hidden; }</style>");
      // w.document.write("<script>window.onload = function() { window.moveTo((screen.width - 400) / 2, (screen.height - 200) / 2); window.resizeTo(400, 200); window.location.hash = 'no-url'; };</script>");

      // Now I am trying popup wala approach


      // Third approach is ki ek absolute div attach kar du in the center of the screen and usme iframes ka list show kar du
      // const style = document.createElement("link");
      // style.rel = "stylesheet";
      // style.href = chrome.runtime.getURL("styles/popup-styles.css");
      // document.head.appendChild(style);
      
      var div = document.createElement("div");
      div.id = "clickjack-popup";
      div.style.position = "fixed";
      div.style.top = "50%";
      div.style.left = "50%";
      div.style.transform = "translate(-50%, -50%)";
      div.style.zIndex = "999999";
      div.style.borderRadius = "8px";
      div.style.border = "2px solid #3A3A3A";
      div.style.padding = "8px 16px";
      div.style.background = "linear-gradient(-7deg,#2A2A2A 0%,#2A2A2A 41%,#DA5302 244%)";
      div.style.boxShadow = "0px 0px 16px rgba(0, 0, 0, 0.25)";
      div.style.display = "flex";
      div.style.flexDirection = "column";
      div.style.maxWidth = "400px";


      var heading = document.createElement("h1");
      heading.innerText = "Clickjacking detected";
      heading.style.color = "white";
      heading.style.fontFamily = "'Line Seed Sans', sans-serif";
      heading.style.fontWeight = "500";
      heading.style.fontSize = "24px";
      heading.style.marginTop = "16px";

      var para = document.createElement("p");
      para.innerText = `${susIframes.length} probable clickjacking attempts detected and removed from the page.`;
      para.style.color = "#757575";
      para.style.fontFamily = "'Line Seed Sans', sans-serif";
      para.style.fontSize = "16px";
      para.style.fontWeight= "400";
      para.style.marginBottom= "16px";

      div.appendChild(heading);
      div.appendChild(para);

      



      var close = document.createElement("button");
      close.innerText = "x";
      close.style.position = "absolute";
      close.style.top = "8px";
      close.style.right = "24px";
      close.style.background = "none";
      close.style.border = "none";
      close.style.color = "white";
      close.style.fontFamily = "'Line Seed Sans', sans-serif";
      close.style.fontSize = "24px";
      close.style.cursor = "pointer";
      close.onclick = function() {
        document.body.removeChild(div);
      }

      div.appendChild(close);

      document.body.appendChild(div);

      





      };
    }

  return (
    <>
      <Card
        heading="Clickjack Detection"
        primaryButton="Start Scan"
        content="Certain websites can trigger unwanted clicks. Perform a scan to know about all hidden elements."
        imageSrc={reviews}
        onPrimaryButtonClick={handleClick}
      ></Card>
    </>
  );
}

export default EvaluateReviews;
