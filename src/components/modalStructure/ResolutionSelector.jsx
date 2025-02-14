import { useState } from "react";

const multiplierOptions = [
  { value: 1, label: "1x  ", width: 1344, height: 2016 },
  { value: 2  , label: "2x"},
];

const ResolutionSelector = ({ setSelectedMultiplier }) => {
  const [selectedMultiplier, setSelectedMultiplierLocal] = useState(null);

  const handleMultiplierChange = (e) => {
    const selected = multiplierOptions.find(
      option => option.value === parseInt(e.target.value)
    );
    setSelectedMultiplierLocal(selected?.value || null);
    // Update parent component
    setSelectedMultiplier(selected?.value || null);
  };

  return (
    <div className="flex flex-col">
      <label
        htmlFor="multiplier-select"
        className="block mb-2 text-lg font-medium text-primary"
      >
        Select Resolution:
      </label>
      <select
        id="multiplier-select"
        value={selectedMultiplier || ""}
        onChange={handleMultiplierChange}
        className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
      >
        <option value="">Select a resolution</option>
        {multiplierOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ResolutionSelector;