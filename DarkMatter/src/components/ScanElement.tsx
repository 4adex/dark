import Card from "./card";
import manual from "../assets/Manual.png";
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


interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  confidence: number;
}

async function detectAndTranslate(
  text: string,
  targetLanguage: string,
  confidenceThreshold: number = 0.4
): Promise<TranslationResult> {
  try {
    // Create language detector
    //@ts-ignore
    const canDetect = await translation.canDetect();
    if (canDetect === 'no') {
      console.log("language detection not available")
      throw new Error('Language detection not available');
    }
  //@ts-ignore
    const detector = await translation.createDetector();
    
    // Detect language
    const detectionResults = await detector.detect(text);
    const detectedLanguage = detectionResults[0].detectedLanguage;

    console.log(detectedLanguage)
    const confidence = detectionResults[0].confidence;
    
    console.log(confidence)
    // If text is already in target language or confidence is too low, return original
    if (detectedLanguage === targetLanguage || confidence < confidenceThreshold) {
      return {
        originalText: text,
        translatedText: text,
        sourceLanguage: detectedLanguage || 'unknown',
        confidence
      };
    }

    // Check if translation is available
    //@ts-ignore
    const canTranslate = await translation.canTranslate({
      sourceLanguage: detectedLanguage!,
      targetLanguage
    });

    console.log(await canTranslate)

    if (canTranslate === 'no') {
      throw new Error('Translation not available for this language pair');
    }

    console.log("it can indeed translate")

    // Create translator and translate
    //@ts-ignore
    const translator = await translation.createTranslator({
      sourceLanguage: detectedLanguage!,
      targetLanguage
    });

    console.log("translator console")
    console.log(translator)

    const translatedText = await translator.translate(text);

    console.log("translated text is: ")
    console.log(translatedText)

    return {
      originalText: text,
      translatedText,
      sourceLanguage: detectedLanguage!,
      confidence
    };
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
  


}



async function handleSummarizeArbitrary(
  text: string,
  onStart: () => void,
  onComplete: (summary: string) => void,
  onError: (error: string) => void,
  onFinally: () => void
) {
  try {
    onStart();
    const summarizer = await ai.summarizer.create();
    const summary = await summarizer.summarize(text);
    onComplete(summary);
    summarizer.destroy();
  } catch (error) {
    console.error('Error in handleSummarizeArbitrary:', error);
    onError('Error summarizing arbitrary text');
  } finally {
    onFinally();
  }
}


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
        


        selected_element.style.border = '1px solid #FF6509';
        selected_element.style.background = '#DED8D5';
        selected_element.style.position = 'relative';
        selected_element.style.borderRadius = '13px';
        selected_element.style.padding = '4px';
        // selected_element.style.margin = '10px';


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
        boxDiv.style.background = '#FF6509';
        boxDiv.style.fontSize = '14px';
        boxDiv.style.fontFamily = "Line Seed Sans, sans-serif";
        boxDiv.style.fontWeight = '500';
        boxDiv.style.padding = '4px 16px';
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

      boxDiv.style.top = `${rect.top + scrollTop - boxDiv.offsetHeight*2}px`;
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
        // closeButton.style.fontSize = '14px';
        // closeButton.style.fontWeight = 'bold';
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
        console.log("----------------------------------------")
        console.log("textttttttttttttttttttttttt" + TextInElement)
        console.log("----------------------------------------")

        let result = await runPrompt(TextInElement);
        result = result.trim();
        console.log("Result from the model:", result);
        if (result == "Not Dark Pattern"){
            boxDiv.innerText = 'Safe, the element doesn\'t contain any dark patterns.';
            boxDiv.appendChild(closeButton);
            selected_element.style.background = '#D4FFDB';
        }
        else {
            boxDiv.innerText = 'Dark Pattern Detected: '+result;
            boxDiv.appendChild(closeButton);
            selected_element.style.background = '#FFD4D4';

            // Store the data in local storage
            const dataToStore = { type: result.trim().toLowerCase(), url: window.location.href, date: new Date().toISOString().split('T')[0] };
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
        }
        
    }
    };


    var session: ai.languageModel.Session | null = null;

    async function runPrompt(prompt: string): Promise<string> {
        try {
            const params = {
                //systemPrompt: 'Analyze the given text to identify whether it contains any dark patterns, which are deceptive or manipulative tactics aimed at influencing user behavior.\nCategorize the text as either "None (Safe)" if it does not appear to be a dark pattern, or "Dark Pattern" if it seems to be manipulative, even if the statement is technically true. Do not provide any explaination. \nConsider factors like creating false urgency, emotional manipulation, scarcity tactics, or attempts to mislead users.\nBe especially vigilant for subtle tactics that might exploit psychological biases or create a sense of urgency or fear of missing out.\nExamples of dark patterns include:\n"Hurry! Only 2 items left at this price!"\n"You have already saved $50! Complete your purchase now."\n"Thousands of people are viewing this product right now!"\n"Limited time offer: 10 minutes remaining!"',

                systemPrompt: 'Analyze the given text to identify whether it employs any dark patterns, which are deceptive or manipulative tactics aimed at influencing user behavior.\nClassify the text into one of the following categories:\n\nforced_action: Requires users to take an action they might not want to in order to proceed.\nmisdirection: Distracts or misleads users to make them take actions they might not otherwise take.\nnot_dark_pattern: Safe and does not contain manipulative tactics.\nobstruction: Makes it deliberately difficult for users to complete a task or opt-out of something.\nscarcity: Creates a false sense of limited availability to pressure users.\nsneaking: Hides information or sneaks something into the user’s experience without their knowledge.\nsocial_proof: Uses peer pressure or perceived popularity to influence decisions.\nfake_urgency: Instills a sense of time pressure to push immediate action.\n\nDo not provide any explanation; simply classify the text into one of the above categories. Be especially vigilant for subtle tactics that exploit psychological biases, such as creating urgency, fear of missing out, or leveraging social proof.\n\nExamples:\n1. Forced Action\n"To access your account, you must agree to receive promotional emails."\n\n2. Misdirection\n"Click here to confirm your refund." (Button actually signs up for a subscription instead of processing a refund.)\n\n3. Not Dark Pattern\n"Your session will expire in 10 minutes for security reasons. Please log in again to continue."\n\n4. Obstruction\n"To unsubscribe, please send a handwritten letter to our office."\n\n5. Scarcity\n"Only 3 items left in stock—order now to avoid missing out!"\n\n6. Sneaking\n"By clicking Accept, you also agree to a free trial subscription that auto-renews after 7 days."\n\n7. Social Proof\n"1,000 people have purchased this product in the last hour!"\n\n8. Fake Urgency\n"Hurry! This offer expires in the next 5 minutes!"',
                temperature: parseFloat('1'),  // Default to 0 if null
                topK: parseInt('3'),  // Default to 0 if null
              };
          if (!session) {
            console.log('Creating new session');
            session = await ai.languageModel.create(params);
          }

          console.log('Running prompt:', prompt);
        let result = await session.prompt(prompt);
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

//   const scanElement = () => {
//     selectElement();
//     console.log("Selected element returned to scanner is", selected_element);
//   };

  //   const uncheckAllCheckboxes = () => {
  //       // document.body.style.backgroundColor = colour;
  //       let count = 0;
  //       let allInputs = document.getElementsByTagName("input");
  //       if(allInputs.length > 0){
  //         for(let i=0; i<allInputs.length; i++){
  //           if (allInputs[i].type = 'checkbox'){
  //             allInputs[i].checked = true;
  //             count++;
  //           }
  //         }
  //       }
  //       alert("Unchecked " + allInputs.length + "boxes , which were a potential to be misled to be used.");
  //     }

  return (
    <>
      <Card
        heading="Scan Manually"
        primaryButton="Select Element"
        content="Select a specific suspicious element to check if it is a dark pattern or not."
        imageSrc={manual}
        onPrimaryButtonClick={handleClick}
      ></Card>
    </>
  );
}

export default Checkbox;
