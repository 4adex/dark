import React, { useState } from "react";

function Slider({ onChange }) {
  const [sliderValue, setSliderValue] = useState(1); // Local state for display

  const handleInputChange = (event) => {
    const value = parseInt(event.target.value, 10); // Convert string to number
    setSliderValue(value); // Update local state
    console.log("DSHCJHDSKJKDLJC"+ value); 
    onChange(value); // Pass the value to the parent component
  };

  return (
    <div style={{ marginTop: "20px", textAlign: "center" }}>
      <label htmlFor="slider">Data Fraction:</label>
      <input
        type="range"
        id="slider"
        min="1"
        max="4"
        step="1"
        value={sliderValue}
        onChange={handleInputChange}
        style={{ margin: "0 10px" }}
      />
      <span>
        {sliderValue === 1
          ? "1/4th"
          : sliderValue === 2
          ? "1/2"
          : sliderValue === 3
          ? "3/4th"
          : "Full"}
      </span>
    </div>
  );
}

export default Slider;
