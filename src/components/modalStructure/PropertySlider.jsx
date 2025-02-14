import { useState, useEffect } from 'react';
import { CiBrightnessUp } from "react-icons/ci";
import { RiContrastDrop2Fill } from "react-icons/ri";
import { TfiShine } from "react-icons/tfi";
import { CiDroplet } from "react-icons/ci";
import { TbExposure } from "react-icons/tb";



const PropertySlider = ({ property, value, onValueChange }) => {
  const [sliderValue, setSliderValue] = useState(value);

  useEffect(() => {
    setSliderValue(value);
  }, [value]);

  const getSliderConfig = (prop) => {
    switch (prop) {
      case "brightness":
        return { min: 0.18, max: 1, middle: 0.59 };
      case "shadowStrength":
        return { min: 0, max: 3, middle: 1.64 };
      case "highlightImprovement":
        return { min: 0, max: 3, middle: 1.64 };
      default:
        return { min: 0, max: 2, middle: 1 };
    }
  };

  const { min, max } = getSliderConfig(property);

  const calculatePercentage = (value) => {
    if (property === "shadowStrength" || property === "highlightImprovement") {
      return Math.round((value / max) * 300);
    }
    return Math.round(((value - min) / (max - min)) * 100);
  };

  const calculateVisualPercentage = (value) => {
    return Math.round(((value - min) / (max - min)) * 100);
  };

  const updateBackground = (value) => {
    const percentage = calculateVisualPercentage(value);
    return `linear-gradient(to right, #8c2a8d ${percentage}%, #e1d8e9 ${percentage}%)`;
  };

  const handleSliderValueChange = (newValue) => {
    setSliderValue(newValue);
    onValueChange(newValue);
  };

  const getPropertyIcon = () => {
    switch (property) {
      case "brightness":
        return <CiBrightnessUp className="text-xl text-white" />;
      case "contrast":
        return <RiContrastDrop2Fill className="text-xl text-white" />;
      case "highlightImprovement":
        return <TfiShine className="text-xl text-white" />;
      case "saturation":
        return <CiDroplet className="text-xl text-white" />;
      default:
        return <TbExposure className="text-xl text-white" />;
    }
  };

  return (
    <div className="relative">
      <label className="absolute top-[-20px] left-[50px] capitalize">
        {property === "shadowStrength" ? "Shadow" : property === "highlightImprovement" ? "Shine" : property}
      </label>
      <div className="flex gap-3 items-center w-full p-2 my-5">
        <div className="bg-[#E1D9E9] h-8 w-8 rounded-full flex justify-center items-center">
          {getPropertyIcon()}
        </div>
        <div className="w-full relative">
          <input
            type="range"
            min={min}
            max={max}
            step={0.01}
            value={sliderValue}
            style={{ background: updateBackground(sliderValue) }}
            className="w-full rounded-lg"
            onChange={(e) => handleSliderValueChange(parseFloat(e.target.value))}
          />
          <span className="absolute right-0 bottom-6 text-sm text-primary">
            {calculatePercentage(sliderValue)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default PropertySlider;