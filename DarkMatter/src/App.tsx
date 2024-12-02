import './App.css';
import ScanElement from './components/ScanElement';
import EvaluateReviews from './components/EvaluateReviews';
import Dom from './components/Dom';
import Checkprice from './components/CheckPrice';
import Stats from './components/stats';
import DarkLogo from "./assets/DarkLogo.svg";
import Close from "./assets/Close2.svg";
import { useEffect, useState } from 'react';
import DarkPatternSelector from './components/darkselector';


function App() {

  const [showDropdown, setShowDropdown] = useState(false); // State variable for dropdown visibility
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null); // State variable for selected dark pattern
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode

  const handlePatternSelect = (pattern: string) => {
    setSelectedPattern(pattern); // Update selected dark pattern
    setShowDropdown(false); // Hide dropdown
    // You can perform any further actions here, such as sending the selected pattern to a server
  };

  useEffect(() => {
    if (selectedPattern !== null) {
      sendreport();
      console.log("Selected pattern is: ", selectedPattern);
    }
  }, [selectedPattern]);

  const handleClick = () => {
    setShowDropdown(!showDropdown)
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const sendreport = async () => {
    setShowDropdown(!showDropdown)
    // chrome.storage.local.set({ "data": selectedPattern });
    
    let [tab] = await chrome.tabs.query({ active : true });

    chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      args: [selectedPattern],
      func: (selectedPattern) => {
          var hoveredElement: EventTarget | null = null;

          document.addEventListener('mouseover', function(event) {
              hoveredElement = event.target;
          });

            document.addEventListener('click', async function() {
              if (hoveredElement) {
                console.log(hoveredElement);

                const hoveredElementWithAttributes = hoveredElement as HTMLElement;

                const attributes: { [key: string]: string } = {};
                for (const { name, value } of hoveredElementWithAttributes.attributes) {
                  attributes[name] = value;
                }

                const textWithinElement = hoveredElementWithAttributes.innerText;
                console.log("Text within the element:", textWithinElement);

                // Construct object with element details including its attributes
                const elementDetails = {
                  tagName: hoveredElementWithAttributes.tagName,
                  attributes: attributes,
                  test: "hio",
                  darkpattern: selectedPattern,
                  text: textWithinElement,
                  url: window.location.href,
                };

                const apiUrl = 'http://127.0.0.1:5000/report';
                const requestOptions = {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(elementDetails)
                };
          
                try {
                  const response = await fetch(apiUrl, requestOptions);

                  if (!response.ok) {
                    throw new Error(`API request failed with status: ${response.status}`);
                  }
                  console.log(response.json());

                } catch (error) {
                  console.error('Error making API request:', error);
                }

                // Send message to background script to remove the content script
                chrome.runtime.sendMessage({ removeScript: true });

                alert("You have reported the element. Thank you for your contribution.");
              }
            });

            document.removeEventListener('mouseover', function(event) {
              hoveredElement = event.target;
            });
      }
    });
    // chrome.tabs.executeScript(tab.id!, {
    //   code: `
    //     document.removeEventListener('mouseover', function(event) {
    //       hoveredElement = event.target;
    //     });
    //     document.removeEventListener('click', function() {
    //       if (hoveredElement) {
    //         console.log(hoveredElement);
    //       }
    //     });
    //   `
    // });
  }

  return (
    <div style={{ background: isDarkMode ? "#1E1E1E" : "white", minHeight: "25rem", display: "flex", flexDirection: "column", overflow:"auto", minWidth:"20rem", padding:"1.5rem" }}>  
    <div style={{ background: isDarkMode ? "#1E1E1E" : "white", minHeight: "25rem", display: "flex", flexDirection: "column", overflow:"auto" }}>
  {/* <div style={{justifyContent:"space-between",display:"flex",height:"2rem",padding:"1rem"}}>        
  <div style={{ display: "flex", justifyContent: "left", alignItems: "center", gap: "1rem"}}>
    <img src={logo} style={{ height: "2em" }} alt="Logo" />
    <h1>DarkMatter</h1>
  </div>
  <div style={{color:"#9599A1",display:"flex",alignItems:"center",fontSize:"1.75rem",marginLeft:"1rem"}}>
    X
  </div>
  </div> */}
   <div style={{justifyContent:"space-between",display:"flex",padding:"1rem", alignItems:"center", minWidth:"440px"}}>
    <img src={DarkLogo} style={{ height: "3em" }} alt="Logo" />
      <h1 style={{fontSize:"28px"}}>DarkMatter</h1>
      <img src={Close} style={{height: "2em", cursor: "pointer", marginLeft:"0.5rem"}} alt="Close" onClick={() => {console.log("Close clicked"); setShowDropdown(false);}} />
    </div>
    <div style={{ display: "flex", flexDirection:"column"}}>
      <Stats />
    <Dom />
      <ScanElement />
      <EvaluateReviews />
      
      <Checkprice />
      {/* <FakeRevew/> */}
      {/* <Scrapper/> */}
      {/* <OCR/> */}
    </div>

    {/* <p className="read-the-docs">
      Click on the logo to visit the website.
    </p> */}
</div>
<div style={{color:'black',flexDirection:"row",justifyContent:"space-between", display:"flex",alignItems:"center"}} >
      <b>Detected something unusual? </b>
      <button className='tertiary-button' onClick={handleClick}>Report</button>
      {showDropdown && ( // Render dropdown only when showDropdown is true
        <DarkPatternSelector onSelect={handlePatternSelect} />
      )}
      {selectedPattern && <p>Selected Dark Pattern: {selectedPattern}</p>}
    </div>
    {/* <button
        style={{
          marginTop: "1rem",
          alignSelf: "center",
          padding: "0.5rem 1rem",
          backgroundColor: isDarkMode ? "gray" : "blue",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={toggleDarkMode}
      >
        {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </button> */}
    </div>
  );
}

export default App;
