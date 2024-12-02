import Card from "./card";
import tag from "../Tag.png"


function Checkbox({value}) {

    interface TreeNode {
      nid: string;
      tag: string;
      children: TreeNode[];
      content: string;
      nodeType: string; // adjust the type if needed
    }

  const handleClick = async () => {
    let [tab] = await chrome.tabs.query({ active: true });

  
    // Giving generic params to executeScript for handling args
    chrome.scripting.executeScript({

      target: { tabId: tab.id! },
      func: async (value) => {
        console.log("Value:", value);
        // ---- Initiate variables ----
        const rootElement = document.documentElement;
        const node: TreeNode = {
          nid: 'root',
          tag: rootElement.tagName,
          children: [],
          content: rootElement.textContent ?? "",
          nodeType: "HTML_ELEMENT",
        };
        const nodeIdContentMap = new Map<string, string>();
        const parentId = node.nid;
  
        // Set dark-id
        rootElement.setAttribute('dark-id', parentId);
        traverseAndUpdate(rootElement, parentId, node);
  
        // Populate the Map
        iterateAndPopulateMap(node, nodeIdContentMap);
        console.log("Node ID Map:", Array.from(nodeIdContentMap.entries()));
  
        // Make request
        

        const fraction = value;
        console.log("Fraction:", fraction);
  
        const results = await askNano(nodeIdContentMap, fraction);
        console.log("Result:", Array.from(results.entries()));
        
        // List of dark pattern types to display
        const allowedPatterns = [
          "Forced Action",
          "Misdirection",
          "Obstruction",
          "Scarcity",
          "Sneaking",
          "Social Proof",
          "Fake Urgency",
        ];
        
        // Helper function to normalize strings
        const normalize = (str) => 
          str.toLowerCase().replace(/[-_\s]+/g, ""); // Convert to lowercase and remove -, _, and spaces
        
        // Process and display results as needed
        results.forEach((value, key) => {
          console.log(`${key}: ${value}`);
          
          // Split the response into classification and explanation
          const [classification, ...explanationParts] = value.split("\n");
          const explanation = explanationParts.join(" ");
          console.log('Explanantion of the propmpt is:',explanation);
        
          // Normalize classification and check if it matches any allowed pattern
          if (!allowedPatterns.some(pattern => normalize(pattern) === normalize(classification))) {
            console.log(`Skipping element with key ${key} as it is not a relevant dark pattern.`);
            return; // Skip this iteration
          }

          const dataToStore = { type: classification, url: window.location.href, date: new Date().toISOString().split('T')[0] };

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
        
          // Select the element with the corresponding dark-id
          const element = document.querySelector(`[dark-id="${key}"]`) as HTMLElement;
          if (element) {
            // Style the element
            element.style.border = '1px solid #940CFF';
            element.style.background = '#DFD4FF';
            element.style.position = 'relative';
            element.style.borderRadius = '6px';
            // element.style.padding = '10px';
            element.style.margin = '15px';
        
            // Create the classification box
            const boxDiv = document.createElement('div');
            boxDiv.style.display = 'flex';
            boxDiv.style.zIndex = '9999';
            boxDiv.style.justifyContent = 'center';
            boxDiv.style.alignItems = 'center';
            boxDiv.style.color = 'white';
            boxDiv.style.background = '#940CFF';
            boxDiv.style.fontSize = '13px';
            boxDiv.style.fontFamily = "Poppins, sans-serif";
            boxDiv.style.fontWeight = '520';
            boxDiv.style.padding = '2px 16px';
            boxDiv.style.borderRadius = '6px';
            boxDiv.style.width = 'auto';
            boxDiv.style.minWidth = '100px';
            boxDiv.style.boxShadow = '0px 4px 10.7px 0px rgba(0, 0, 0, 0.25)';
            boxDiv.style.position = 'absolute';
            boxDiv.style.top = `-17px`;
            boxDiv.style.right = '0';
            boxDiv.innerText = classification;
            // document.body.appendChild(boxDiv);
            // const rect = element.getBoundingClientRect();
            // const scrollTop = window.scrollY;
            // const scrollLeft = window.scrollX;

            // boxDiv.style.top = `${rect.top + scrollTop - boxDiv.offsetHeight*2}px`;
            // boxDiv.style.right = `${scrollLeft + document.body.clientWidth - rect.right}px`;
        
            // Create the tooltip for the explanation
            const tooltip = document.createElement('div');
            tooltip.style.display = 'none'; // Changed from visibility to display
            tooltip.style.position = 'absolute';
            tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            tooltip.style.color = 'white';
            tooltip.style.padding = '15px';
            tooltip.style.borderRadius = '12px';
            tooltip.style.fontSize = '14px';
            tooltip.style.top = '150%';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translateX(-50%)';
            tooltip.style.boxShadow = '0px 4px 15px rgba(0, 0, 0, 0.3)';
            tooltip.style.zIndex = '100';
            tooltip.style.width = 'max-content';
            tooltip.style.maxWidth = '400px';
            tooltip.style.wordWrap = 'break-word';
            tooltip.style.textAlign = 'left';
            tooltip.style.lineHeight = '1.5';
            tooltip.innerText = explanation;

            




        
            // Show/hide tooltip on hover
            boxDiv.addEventListener('mouseenter', () => {
              tooltip.style.display = 'block'; // Show tooltip
            });
            boxDiv.addEventListener('mouseleave', () => {
              tooltip.style.display = 'none'; // Hide tooltip
            });
        
            // Append tooltip to the classification box
            boxDiv.appendChild(tooltip);
        
            // Append the classification box to the element
            element.appendChild(boxDiv);
        
            console.log(element.innerText);
          } else {
            console.log('Element not found');
          }
        });
         
        

            // ---- Helper Functions ----
            function traverseAndUpdate(element:any, parent:any, node:any) {
              for (var i = 0; i < element.children.length; i++) {

                var childElement = element.children[i];
                var childNid = parent + '-' + i;
                var IGNORE_ELEMENTS = ["SCRIPT", "STYLE", "LINK", "NOSCRIPT", "IFRAME", "OBJECT", "EMBED", "PARAM", "SOURCE", "CANVAS", "SVG", "USE", "TRACK", "INPUT", "TEXTAREA", "SELECT", "OPTION", "OPTGROUP", "BUTTON", "LABEL", "FIELDSET", "LEGEND", "BR", "HR"];
                var BLOCK_ELEMENTS = ["DIV", "P", "H1", "H2", "H3", "H4", "H5", "H6", "UL", "OL", "LI", "DL", "DT", "DD", "TABLE", "THEAD", "TBODY", "TFOOT", "TR", "TH", "TD", "FORM", "HEADER", "FOOTER", "NAV", "SECTION", "ARTICLE", "ASIDE", "DETAILS", "DIALOG", "SUMMARY", "FIGURE", "FIGCAPTION", "ADDRESS", "MAIN", "HR", "PRE", "BLOCKQUOTE"];
                var INLINE_ELEMENTS = ["SPAN", "A", "STRONG", "B", "I", "EM", "MARK", "SMALL", "DEL", "INS", "SUB", "SUP", "Q", "CITE", "DFN", "ABBR", "TIME", "CODE", "VAR", "SAMP", "KBD", "STRONG", "B", "I", "EM", "MARK", "SMALL", "DEL", "INS", "SUB", "SUP", "Q", "CITE", "DFN", "ABBR", "TIME", "CODE", "VAR", "SAMP", "KBD", "S", "U", "WBR", "IMG", "BR", "INPUT", "TEXTAREA", "SELECT", "OPTION", "OPTGROUP", "BUTTON", "LABEL", "FIELDSET", "LEGEND", "IFRAME", "OBJECT", "EMBED", "PARAM", "SOURCE", "CANVAS", "SVG", "USE", "TRACK", "INPUT", "TEXTAREA", "SELECT", "OPTION", "OPTGROUP", "BUTTON", "LABEL", "FIELDSET", "LEGEND"];
                var contents = [];
    
                childElement.setAttribute('dark-id', childNid);
                node.children.push({
                    nid: childElement.getAttribute('dark-id'),
                    tag: childElement.tagName,
                    children: [],
                    content: !IGNORE_ELEMENTS.includes(childElement.tagName) ? cleanText(childElement.textContent) : "",
                    nodeType: IGNORE_ELEMENTS.includes(childElement.tagName) ? "IGNORE_ELEMENT" : BLOCK_ELEMENTS.includes(childElement.tagName) ? "BLOCK_ELEMENT" : INLINE_ELEMENTS.includes(childElement.tagName) ? "INLINE_ELEMENT" : "TEXT_NODE"
                    });
                if (node.nodeType == "TEXT_NODE" || node.nodeType == "INLINE_ELEMENT" || node.nodeType == "BLOCK_ELEMENT" || node.nodeType == "IGNORE_ELEMENT"){
                    contents.push(node.content);
                }
                traverseAndUpdate(childElement, childNid, node.children[i]);
              }
            }

            function cleanText(text:any) {
              const continuousSpaceOverTwoCharactorRule = /\s{2,}/g;
              const newText = text.replace(continuousSpaceOverTwoCharactorRule, ' ').replace('\n', '');
              return newText;
            }

          function iterateAndPopulateMap(node: TreeNode, nodeIdContentMap: Map<string, string>): void {
            // Check if the node's content is clean
            if (cleanContent(node.content)) {
              // Add the node's ID and content to the Map
              nodeIdContentMap.set(node.nid, node.content);
            }
          
            // Recursively process each child node
            for (const child of node.children) {
              iterateAndPopulateMap(child, nodeIdContentMap);
            }
          }

          var session: ai.languageModel.Session | null = null;

          function calculateDistanceFromCenter(element: HTMLElement): number {
            // Get the viewport dimensions
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
          
            // Calculate the center of the viewport
            const centerX = viewportWidth / 2;
            const centerY = viewportHeight / 2;
          
            // Get the bounding rectangle of the element
            const rect = element.getBoundingClientRect();
          
            // Calculate the center point of the element
            const elementCenterX = rect.left + rect.width / 2;
            const elementCenterY = rect.top + rect.height / 2;
          
            // Calculate Euclidean distance from viewport center
            const distanceX = elementCenterX - centerX;
            const distanceY = elementCenterY - centerY;
            
            return Math.sqrt(distanceX * distanceX + distanceY * distanceY);
          }
          
          

          async function analyzeDarkPatterns(inputData: Map<string, string>): Promise<Map<string, string>> {
            console.log("Analyzing dark patterns...somyaaaaaaaaaaaaaaaaaaa");
            const results = new Map<string, string>();
          
            // Iterate through each sentence with its ID
            for (const [id, sentence] of inputData.entries()) {
              const prompt = sentence.trim();
          
              // Prepare parameters for API call
              const params = {
                systemPrompt: 'Analyze the given text to identify whether it employs any dark patterns, which are deceptive or manipulative tactics aimed at influencing user behavior.\nClassify the text into one of the following categories:\n\nforced_action: Requires users to take an action they might not want to in order to proceed.\nmisdirection: Distracts or misleads users to make them take actions they might not otherwise take.\nnot_dark_pattern: Safe and does not contain manipulative tactics.\nobstruction: Makes it deliberately difficult for users to complete a task or opt-out of something.\nscarcity: Creates a false sense of limited availability to pressure users.\nsneaking: Hides information or sneaks something into the user’s experience without their knowledge.\nsocial_proof: Uses peer pressure or perceived popularity to influence decisions.\nfake_urgency: Instills a sense of time pressure to push immediate action.\n\nDo not provide any explanation; simply classify the text into one of the above categories. Be especially vigilant for subtle tactics that exploit psychological biases, such as creating urgency, fear of missing out, or leveraging social proof.\n\nExamples:\n1. Forced Action\n"To access your account, you must agree to receive promotional emails."\n\n2. Misdirection\n"Click here to confirm your refund." (Button actually signs up for a subscription instead of processing a refund.)\n\n3. Not Dark Pattern\n"Your session will expire in 10 minutes for security reasons. Please log in again to continue."\n\n4. Obstruction\n"To unsubscribe, please send a handwritten letter to our office."\n\n5. Scarcity\n"Only 3 items left in stock—order now to avoid missing out!"\n\n6. Sneaking\n"By clicking Accept, you also agree to a free trial subscription that auto-renews after 7 days."\n\n7. Social Proof\n"1,000 people have purchased this product in the last hour!"\n\n8. Fake Urgency\n"Hurry! This offer expires in the next 5 minutes!".\n',
                temperature: 1, // Default to 1
                topK: 3, // Default to 3
              };
          
              try {

                const response = await runPrompt("The given string is: " + prompt, params);
                results.set(id, response); // Store response with the ID
              } catch (e) {
                results.set(id, "Error: " + (e instanceof Error ? e.message : "Unknown error")); // Handle error and return it for this sentence
              }
            }
          
            return results;
          }
          
          async function runPrompt(prompt: string, params: any): Promise<string> {
            try {
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


      
          
          

          function cleanupAndSortElements(inputDict: Map<string, string>): Map<string, string> {
              // First, perform the existing cleanup
              const filteredDict = cleanup(inputDict);
          
              console.log("---------filteredDict------------------------");
              console.log(filteredDict);
              console.log("-------------------------------------------------------");
          
              // Convert the filtered dictionary to an array of key-value pairs
              const entries = Array.from(filteredDict.entries());
          
              // Debugging array to store dark-id and distance pairs
              const debugArray: { darkId: string; distance: number }[] = [];
          
              // Sort the entries based on the distance of their corresponding elements from the screen center
              const sortedEntries = entries.sort(([key1], [key2]) => {
                  // Find the elements using their dark-id attributes
                  const element1 = document.querySelector(`[dark-id="${key1}"]`) as HTMLElement;
                  const element2 = document.querySelector(`[dark-id="${key2}"]`) as HTMLElement;
          
                  // Handle cases where elements are not found
                  if (!element1 && !element2) return 0;
                  if (!element1) return 1; // Push element1 down
                  if (!element2) return -1; // Push element2 down
          
                  // Calculate and compare distances from the screen center
                  const distance1 = calculateDistanceFromCenter(element1);
                  const distance2 = calculateDistanceFromCenter(element2);
          
                  // Add the distances to the debug array
                  debugArray.push({ darkId: key1, distance: distance1 });
                  debugArray.push({ darkId: key2, distance: distance2 });
          
                  return distance1 - distance2; // Sort ascending based on distance
              });
          
              // Sort the debug array by distance for clarity
              const sortedDebugArray = debugArray.sort((a, b) => a.distance - b.distance);
          
              console.log("Debug Array (dark-id with distances sorted by distance):");
              console.log(sortedDebugArray);
              console.log("-------------------------------------------------------");
          
              // Use a Map to maintain insertion order
              const uniqueEntries = new Map<string, string>();
              for (const { darkId } of sortedDebugArray) {
                  if (!uniqueEntries.has(darkId)) {
                      uniqueEntries.set(darkId, filteredDict.get(darkId)!);
                  }
              }
          
              console.log("Unique Entries (dark-id with strings):");
              console.log(uniqueEntries);
              console.log("-------------------------------------------------------");
          
              return uniqueEntries;
          }
          
          async function reset(): Promise<void> {
            if (session) {
              session.destroy();
            }
            session = null;
          }
          
          

          //First I will assume that I have an askNano function that takes the content map and returns the dark patterns ka map
          async function askNano(requestbody: Map<string, string>, fraction: number) {

            console.log(".............check................")
            const cleanedMap = cleanupAndSortElements(requestbody);

            cleanedMap.forEach((value, key) => {
              if (value.split(' ').length < 3) {
              cleanedMap.delete(key);
              }
            });
          
        
          
            if (requestbody) {
              const resultMap = new Map<string, string>();
          
              try {
                // Calculate the number of elements to process
                const limit = Math.ceil((cleanedMap.size * (fraction-1)) / 4);


                var partialMap = new Map([...cleanedMap].slice(0, limit));

                // const allowedValues = ["LIMITED TIME", "HURRY"];
                // const filteredMap = new Map<string, string>();

                // cleanedMap.forEach((value, key) => {
                //     if (allowedValues.some(allowedValue => value.includes(allowedValue))) {
                //     filteredMap.set(key, value);
                //     }
                // });

                // console.log("Filtered Map:", Array.from(filteredMap.entries()));

                // partialMap = filteredMap;
                
                console.log("Partial Map:", Array.from(partialMap.entries()));

          
                const darkPatternsResults = await analyzeDarkPatterns(partialMap);
                console.log("-----------------darkPatternsResults-----------------------");
                console.log(darkPatternsResults);
                console.log("-----------------darkPatternsResults-----------------------");
          
                // Populate resultMap with the responses from analyzeDarkPatterns
                darkPatternsResults.forEach((value, key) => {
                  resultMap.set(key, value); // Use the result or 'Unknown' if no result
                });
          
                return resultMap;
              } catch (e) {
                // Handle any errors that occur during the analysis
                return new Map([["error", "Error analyzing dark patterns: " + (e instanceof Error ? e.message : "Unknown error")]]);
              }
            }
          }
          
            
          function cleanup(inputDict: Map<string, string>): Map<string, string> {
            const filteredDict: Map<string, string> = new Map();
        
            inputDict.forEach((value, key) => {
                // Skip more aggressive filtering conditions
                if (
                    value === " " || 
                    value.indexOf('{') !== -1 || 
                    value.length > 156 ||
                    /^\d+['"]+-\d+['"].*$/i.test(value) || // Catches range measurements like "16''-22'' Width"
                    /^\d+[''"](?:-\d+[''"])?\s*(Height|Width|Plus)$/i.test(value) ||
                    /^(\d+\s*[-–]\s*\d+)/.test(value) // Catches numeric ranges
                ) {
                    return;
                }
        
                // Check if value starts with an alphanumeric character, a letter, or a space
                if (value && (value[0].match(/^[a-zA-Z0-9 ]$/) || value[0] === ' ')) {
                    filteredDict.set(key, value);
                }
            });
        
            // Further filter out keys where '{' is in the first 30 characters of the value
            for (let [key, value] of filteredDict) {
                if (value.substring(0, 30).includes('{')) {
                    filteredDict.delete(key);
                }
            }
        
            // Call cleanUsingTries on the filtered dictionary
            const cleanedMap = cleanUsingTries(filteredDict);
        
            return cleanedMap;
        }
        
        function cleanUsingTries(A: Map<string, string>): Map<string, string> {
            // Strip whitespace from values
            A.forEach((value, key) => {
                A.set(key, value.trim());
            });
        
            // Sort the keys lexicographically
            const L = Array.from(A.keys()).sort();
        
            // Initialize root trie and filtered result
            const root: { [key: number]: [Record<number, any>, string] } = {};
            const B: Map<string, string> = new Map();
        
            // Process each key in sorted order
            for (const l of L) {
                const V = l.split('-');
                if (V.length < 2) {
                    continue; // Skip keys without '-'
                }
        
                let pre: { [key: number]: [Record<number, any>, string] } | null = null;
                let cur: Record<number, any> = root;
                let shouldAdd = true;
        
                for (let i = 1; i < V.length; i++) {
                    const v = parseInt(V[i]);
                    if (isNaN(v)) {
                        shouldAdd = false; // Skip invalid numeric segments
                        break;
                    }
        
                    // If the node exists and contains a value, skip adding larger keys
                    if (v in cur) {
                        if (cur[v][1] !== "INVALID") {
                            shouldAdd = false; // Prevent adding larger keys
                            break;
                        }
                        pre = cur;
                        cur = cur[v][0];
                    } else {
                        // Create a new node if it doesn't exist
                        cur[v] = [{}, "INVALID"];
                        pre = cur;
                        cur = cur[v][0];
                    }
                }
        
                // If the key is valid and unique at this level, add it
                if (shouldAdd && pre !== null) {
                    const lastV = parseInt(V[V.length - 1]);
                    if (!isNaN(lastV)) {
                        pre[lastV][1] = A.get(l)!;
                        B.set(l, A.get(l)!);
                    }
                }
            }
        
            return B;
        }
      
      


        function cleanContent(content:string) : boolean {
          // write cleaning logic here
          if(content == null || content == "")
          {
            return false;
          }
          return true;
        }

        },  args: [value]
      });
    }

    return (
      <>



        <Card
          heading="Get Dark Patterns"
          primaryButton="Show Dark Patterns"
          content="This website has potential dark patterns present. Utilise a trained model to detect them."
          imageSrc={tag}
          onPrimaryButtonClick={handleClick}
        />
        
      </>
    );
  };
  
  export default Checkbox