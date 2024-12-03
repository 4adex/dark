import React, { useState } from "react";

function Slider({ onChange }) {
  const [sliderValue, setSliderValue] = useState(3); // Local state for display

  const handleInputChange = (event) => {
    const value = parseInt(event.target.value, 10); // Convert string to number
    setSliderValue(value); // Update local state
    console.log("DSHCJHDSKJKDLJC"+ value); 
    onChange(value); // Pass the value to the parent component
  };

  return (
    <div className="slider-wrapper">
      <h3 className="slider-label">Select depth</h3>
      <div >
          <input
            type="range"
            id="slider"
            min="1"
            max="5"
            value={sliderValue}
            step="1"
            onChange={handleInputChange}
            className="slider"
            
          />
        </div>
    </div> 
      
  );
}

export default Slider;
