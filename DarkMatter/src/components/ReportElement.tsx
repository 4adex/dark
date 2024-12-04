function EvaluateReviews() {
  const handleClick = async () => {
    let [tab] = await chrome.tabs.query({ active: true });
    // giving generic params to executeScript for handling args
    chrome.scripting.executeScript<string[], void>({
      target: { tabId: tab.id! },
      args: [],
      func: selectElement,
    });
  };

  const selectElement = () => {
    let previousElement: HTMLElement | null = null;
    let previousElementStyles: {
      background: string;
      borderRadius: string;
    } | null = null;

    const mouseMoveHandler = (event: MouseEvent) => {
      const element = document.elementFromPoint(
        event.clientX,
        event.clientY
      ) as HTMLElement;
      if (element) {
        if (previousElement) {
          previousElement.style.background =
            previousElementStyles?.background || "";
          previousElement.style.borderRadius =
            previousElementStyles?.borderRadius || "";
          previousElement.classList.remove("highlighted-element");
        }

        previousElement = element;
        previousElementStyles = {
          background: element.style.background,
          borderRadius: element.style.borderRadius,
        };

        element.classList.add("highlighted-element");
        element.style.background = "#FFDBC6";
        element.style.borderRadius = "8px";
      }
    };

    const clickHandler = async (event: MouseEvent) => {
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("click", clickHandler);
      if (previousElement) {
        previousElement.style.background =
          previousElementStyles?.background || "";
        previousElement.style.borderRadius =
          previousElementStyles?.borderRadius || "";
        previousElement.classList.remove("highlighted-element");
      }
      const element = document.elementFromPoint(
        event.clientX,
        event.clientY
      ) as HTMLElement;
      console.log("Selected element:", element);

      if (element) {
        const attributes: { [key: string]: string } = {};
        for (const { name, value } of element.attributes) {
          attributes[name] = value;
        }

        const textWithinElement = element.innerText;
        console.log("Text within the element:", textWithinElement);
      }

      // Eleemnt select hogya ab uska data send karna hai
      var div = document.createElement("div");
      div.id = "clickjack-popup";
      div.style.position = "fixed";
      div.style.minHeight = "200px";
      div.style.minWidth = "360px";
      div.style.top = "50%";
      div.style.left = "50%";
      div.style.transform = "translate(-50%, -50%)";
      div.style.zIndex = "999999";
      div.style.borderRadius = "8px";
      div.style.border = "2px solid #3A3A3A";
      div.style.padding = "8px 16px";
      div.style.background =
        "linear-gradient(-7deg,#2A2A2A 0%,#2A2A2A 41%,#DA5302 244%)";
      div.style.boxShadow = "0px 0px 16px rgba(0, 0, 0, 0.25)";
      div.style.display = "flex";
      div.style.flexDirection = "column";
      div.style.maxWidth = "400px";

      var heading = document.createElement("h1");
      heading.innerText = "Report Element";
      heading.style.color = "white";
      heading.style.fontFamily = "'Line Seed Sans', sans-serif";
      heading.style.fontWeight = "500";
      heading.style.fontSize = "24px";
      heading.style.marginTop = "16px";

      var input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Enter your report here";
      input.style.padding = "8px";
      input.style.borderRadius = "8px";
      input.style.border = "1px solid #3A3A3A";
      input.style.minHeight = "100px";
      input.style.borderRadius = "4px";
      input.style.background = "#1E1E1E";
      input.style.color = "white";
      input.style.fontFamily = "'Line Seed Sans', sans-serif";
      input.style.wordWrap = "break-word";
      input.style.overflowWrap = "break-word";
      input.style.whiteSpace = "pre-wrap";
      input.style.outlineColor = "2px solid DA5302";

      input.addEventListener("focus", () => {
        input.style.outlineColor = "2px solid DA5302";
        input.style.outlineOffset = "0px";
      });

      input.addEventListener("blur", () => {
        input.style.border = "1px solid #3A3A3A";
        input.style.outlineOffset = "0px";
      });

      const submitHandler = async () => {
        const report = input.value;
        // await fetch("https://localhost:8000", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({ input: report, element: element }),
        // });
        console.log("Report submitted:", report);
        alert(
          "You have reported the element. Thank you for your contribution."
        );
        document.body.removeChild(div);
      };

      var submit = document.createElement("button");
      submit.innerText = "Submit";
      submit.style.borderRadius = "4px";
      submit.onclick = submitHandler;
      submit.style.fontFamily = "'Monocode', sans-serif";
      submit.style.fontWeight = "600";
      submit.style.fontSize = "16px";
      submit.style.padding = "10px 20px";
      submit.style.background = "#DA5302";
      submit.style.margin = "8px";
      submit.style.color = "white";
      submit.style.border = "none";

      div.appendChild(heading);
      div.appendChild(input);
      div.appendChild(submit);

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
      close.onclick = function () {
        document.body.removeChild(div);
      };

      div.appendChild(close);

      document.body.appendChild(div);
    };
    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("click", clickHandler);

  };

  return (
    <div className="report-wrapper">
      <p className="report-label"> Want to report an element?</p>
      <button className="report-button" onClick={handleClick}>
        Report Element
      </button>
    </div>
  );
};

export default EvaluateReviews;
