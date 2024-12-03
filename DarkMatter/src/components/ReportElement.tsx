
function EvaluateReviews() {
  const handleClick = async () => {
    let [tab] = await chrome.tabs.query({ active: true });
    // giving generic params to executeScript for handling args
    chrome.scripting.executeScript<string[], void>({
      target: { tabId: tab.id! },
      args: [],
      func: reportElement,
    });
  };

  const reportElement = () => {
    // code to scan and show iframes.
      };

  return (
    <div className="report-wrapper">
      <p className="report-label"> Want to report an element?</p>
      <button className="report button" onClick={handleClick}>Report Element</button>
    </div>
  );
}

export default EvaluateReviews;
