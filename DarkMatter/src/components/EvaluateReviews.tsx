import Card from "./card";
import tag from "../CheckSquare.png";
function Checkbox() {
  const handleClick = async () => {
    let [tab] = await chrome.tabs.query({ active: true });
    // giving generic params to executeScript for handling args
    chrome.scripting.executeScript<string[], void>({
      target: { tabId: tab.id! },
      args: [],
      func: selectElement,
    });
  };

  var selected_element: HTMLElement | null = null;

  

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
        element.style.background = "#DFD4FF";
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
    const element = document.elementFromPoint(event.clientX,event.clientY) as HTMLElement;
    console.log("Selected element:", element);
    selected_element = element;
    

    if (selected_element) {
        //First change the style of the selected div to match the style as we did before
        const properties_cache = {
            border: selected_element.style.border,
            background: selected_element.style.background,
            position: selected_element.style.position,
            borderRadius: selected_element.style.borderRadius,
            padding: selected_element.style.padding,
            margin: selected_element.style.margin,
        };
        


        selected_element.style.border = '1px solid red';
        selected_element.style.background = '#FFF3D4';
        selected_element.style.position = 'relative';
        selected_element.style.borderRadius = '13px';
        selected_element.style.padding = '4px';


        // Now the task is to select inner text to Gemini Nano wale functions
        const TextInElement = selected_element.innerText;
        console.log("Text within the element:", TextInElement);
        const boxDiv = document.createElement('div');
        boxDiv.style.display = 'flex';
        boxDiv.style.zIndex = '9999';
        boxDiv.style.justifyContent = 'center';
        boxDiv.style.alignItems = 'center';
        boxDiv.style.flexDirection = 'row';
        boxDiv.style.color = 'white';
        boxDiv.style.background = '#940CFF';
        boxDiv.style.fontSize = '12px';
        boxDiv.style.padding = '8px 22px';
        boxDiv.style.fontSize = '12px';
        boxDiv.style.borderRadius = '12px';
        boxDiv.style.width = 'auto';
        boxDiv.style.minWidth = '100px';
        boxDiv.style.cursor = 'default';
        boxDiv.style.boxShadow = '0px 4px 10.7px 0px rgba(0, 0, 0, 0.25)';
        boxDiv.style.position = 'absolute';
        boxDiv.style.right = '10%';
        boxDiv.style.top = '-40%';
        boxDiv.innerText = 'Detecting: Please wait...';
        document.body.appendChild(boxDiv);

      // Position boxDiv at the top right corner of the selected element
      const rect = selected_element.getBoundingClientRect();
      const scrollTop = window.scrollY;
      const scrollLeft = window.scrollX;

      boxDiv.style.top = `${rect.top + scrollTop - boxDiv.offsetHeight}px`;
      boxDiv.style.right = `${scrollLeft + document.body.clientWidth - rect.right}px`;

        const closeButton = document.createElement('div');
        closeButton.innerText = 'x';
        closeButton.style.padding = '0px 0px 24px 24px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.color = 'white';
        closeButton.style.fontSize = '14px';
        closeButton.style.fontWeight = 'bold';
        closeButton.addEventListener('click', () => {
          document.body.removeChild(boxDiv);
          if (selected_element) {
            selected_element.style.border = properties_cache.border;
            selected_element.style.background = properties_cache.background;
            selected_element.style.position = properties_cache.position;
            selected_element.style.borderRadius = properties_cache.borderRadius;
            selected_element.style.padding = properties_cache.padding;
            selected_element.style.margin = properties_cache.margin;
          }
        });
        boxDiv.appendChild(closeButton);

        let result = await runPrompt(TextInElement);
        result = result.trim();
        console.log("Result from the model:", result);

        if (result.includes('Genuine') || result.includes('genuine')) {
            boxDiv.innerText = 'Safe, Not a fake review';
            selected_element.style.background = '#D4FFDB';
        } else {
            boxDiv.innerText = 'Fake review detected';
            selected_element.style.background = '#FFD4D4';
        }
        boxDiv.appendChild(closeButton);
        
    }
    };


    var session: ai.languageModel.Session | null = null;

    async function runPrompt(prompt: string): Promise<string> {
        try {
            const params = {
                systemPrompt: 'fake review could be a paid endorsement, spam, or otherwise not written by an actual customer.\nPlease analyze the following review and classify it as genuine or fake. Provide clear reasoning for your decision. \nWhen making your determination, consider factors such as:\n    Overuse of superlatives or overly positive language\n    Lack of specific details about the product/service\n    Unusual patterns in the writing style\nUse chain-of-thought reasoning to walk through your analysis step-by-step.\nTo help guide your classification, consider the following examples:\nExample 1 (Fake): "This is literally the best phone ever! It\'s perfect in every way. The battery lasts forever, the screen is amazing, and it\'s so fast. Everyone should buy this phone!"\nReasoning: This review is likely fake because it uses exaggerated language, lacks specific details, and fails to mention any potential drawbacks.\nExample 2 (Fake): "Don\'t waste your money on this product! It\'s completely useless and doesn\'t work at all. The worst purchase I\'ve ever made."\nReasoning: This review is likely fake because it uses extreme language, fails to provide specific details about the product\'s shortcomings, and seems overly dramatic.\nWhen evaluating the review you\'re presented with, compare it to these examples and consider which characteristics it shares with genuine or fake reviews. Remember to look for red flags such as overuse of superlatives, generic language, and inconsistencies with typical customer experiences.\nKey Points to Emphasize\n    Look for specific details about the product or service\n    Be wary of reviews that are extremely positive or negative without justification',
                temperature: parseFloat('1'),
                topK: parseInt('3'),
              };
          if (!session) {
            console.log('Creating new session');
            session = await ai.languageModel.create(params);
          }

          console.log('Running prompt:', prompt);
        let result = await session.prompt('Review to evaluate is:'+prompt);
          const resultLines = result.split('\n');
            result = resultLines[0];
          return result;
        } catch (e) {
          console.log('Prompt failed');
          console.error(e);
          console.log('Prompt:', prompt);
          // Reset session
          await reset();
          throw e;
        }
      }
      
      async function reset(): Promise<void> {
        if (session) {
          session.destroy();
        }
        session = null;
      }

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("click", clickHandler);
  };

  return (
    <>
      <Card
        heading="Review Evaluation"
        primaryButton="Click to Scan"
        content="Scan a specific user review to know if it is fake or if AI generated."
        imageSrc={tag}
        onPrimaryButtonClick={handleClick}
      ></Card>
    </>
  );
}

export default Checkbox;
