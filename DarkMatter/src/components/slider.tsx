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
    <div style={{display:"flex", flexDirection:"row", gap:"16px", justifyContent:"center", alignItems:"center", marginTop:"40px"}}>
      <h3 style={{ color: '#7F56D9', fontFamily:"Poppins, sans-serif",fontWeight:"600", fontSize:"14px"}}>Select depth</h3>
      <div >
          <input
            type="range"
            id="slider"
            min="1"
            max="5"
            value={sliderValue}
            step="1"
            onChange={handleInputChange}
            style={{ width:"300px",accentColor: '#7F56D9' }}
          />
        </div>
    </div> 
      
  );
}

export default Slider;
