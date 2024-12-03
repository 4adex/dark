import Card from "./card";
import reviews from "../assets/Review.png";
function EvaluateReviews(isDarkMode: any) {
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
        boxDiv.style.fontSize = '13px';
        boxDiv.style.fontFamily = "Poppins, sans-serif";
        boxDiv.style.fontWeight = '520';
        boxDiv.style.padding = '8px 22px';
        boxDiv.style.fontSize = '12px';
        boxDiv.style.borderRadius = '6px';
        boxDiv.style.width = 'auto';
        boxDiv.style.minWidth = '100px';
        boxDiv.style.maxWidth = '240px';
        boxDiv.style.cursor = 'default';
        boxDiv.style.boxShadow = '0px 4px 10.7px 0px rgba(0, 0, 0, 0.25)';
        boxDiv.style.position = 'absolute';
        boxDiv.innerText = 'Detecting: Please wait...';
        document.body.appendChild(boxDiv);

      // Position boxDiv at the top right corner of the selected element
      const rect = selected_element.getBoundingClientRect();
      const scrollTop = window.scrollY;
      const scrollLeft = window.scrollX;

      boxDiv.style.top = `${rect.top + scrollTop - boxDiv.offsetHeight}px`;
      boxDiv.style.right = `${scrollLeft + document.body.clientWidth - rect.right}px`;

        const closeButton = document.createElement('div');
        const closeIcon = document.createElement('img');
        closeIcon.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iOSIgdmlld0JveD0iMCAwIDEwIDkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xLjM5NTE0IDFMOC4xMDIyOSA3LjcwNzE1IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8cGF0aCBkPSJNMSA3LjcwNzE1TDcuNzA3MTUgMSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+Cg==';
        closeIcon.style.width = '12px';
        closeIcon.style.height = '12px';
        closeButton.appendChild(closeIcon);
        closeButton.style.padding = '8px 0px 16px 16px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.color = 'white';

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
            boxDiv.innerText = result;
            selected_element.style.background = '#FFD4D4';

            //Save that a fake review was detected in local storage
            const dataToStore = { type: 'fake_review', url: window.location.href, date: new Date().toISOString().split('T')[0] };
            console.log('Storing data:', dataToStore);

            chrome.storage.local.get(['darkPatterns'], (result) => {
              let darkPatterns = result.darkPatterns || [];
              // Enforce FIFO if entries exceed 50,000
              if (darkPatterns.length >= 50000) {
                darkPatterns.shift(); // Remove the oldest entry (first element)
              }

              darkPatterns.push(dataToStore); // Add the new entry
              chrome.storage.local.set({ darkPatterns: darkPatterns }, () => {
                console.log('Data stored successfully');
              });
            });


            chrome.storage.local.get(['darkPatterns'], (result) => {
              const darkPatterns = result.darkPatterns || [];
              console.log('retrievinnnnng data');
              console.log(darkPatterns);
              // Process the retrieved data
            });
            // Send data to background script
            // chrome.runtime.sendMessage({ action: 'storeData', data: dataToStore });

        }
        boxDiv.appendChild(closeButton);
        
    }
    };


    var session: ai.languageModel.Session | null = null;

    async function runPrompt(prompt: string): Promise<string> {
        try {
            const params = {
                systemPrompt: 'A fake review could be a paid endorsement, spam, or otherwise not written by an actual customer. Please analyze the following review and assess the probability (as a percentage) of it being fake. When making your determination, consider the following factors: \n Overuse of superlatives or overly positive/negative language: Does the review use exaggerated phrases like "the best ever" or "the worst product"? \n Lack of specific details: Does the review provide concrete, specific experiences with the product or service? \n Unusual writing patterns: Are there inconsistencies, repetitive phrases, or unnatural writing that deviate from typical customer reviews? \n Use chain-of-thought reasoning to walk through your analysis step-by-step. Provide a clear probability (e.g., 70% likely fake) and explain your reasoning in detail. \n Examples for Guidance \n Example 1 \n"This is literally the best phone ever! Its perfect in every way. The battery lasts forever, the screen is amazing, and its so fast. Everyone should buy this phone!" \n Analysis: \n Uses exaggerated language ("best phone ever," "perfect in every way"). \n Lacks specific details about personal use or product features. /n Probability: 90% likely fake. \n Example 2 \n "Dont waste your money on this product! Its completely useless and doesnt work at all. The worst purchase I have ever made." \n Analysis: \n Overly dramatic and negative ("completely useless," "worst purchase"). \n Provides no concrete examples of issues or personal experience. \n Probability: 85% likely fake. \n Your task is to give a probability of the review being fake.',
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
          console.log('................................');
          console.log('Result:', resultLines);
          console.log('................................');
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
        isDarkMode={isDarkMode}
        heading="Review Evaluation"
        primaryButton="Select Review"
        content="Product reviews can be fake as well as AI generated. Use this tool to know how trustable a review is."
        imageSrc={reviews}
        onPrimaryButtonClick={handleClick}
      ></Card>
    </>
  );
}

export default EvaluateReviews;
