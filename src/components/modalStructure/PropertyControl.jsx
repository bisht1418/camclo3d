import { useState, useEffect } from 'react';
import PropertySlider from './PropertySlider';

const PropertyControls = ({ updateShaderUniforms, initialProperties, onPropertyChange }) => {
  const [properties, setProperties] = useState(initialProperties);
  const [resetKey, setResetKey] = useState(0);

  // Only set initial properties when component mounts
  useEffect(() => {
    if (!properties || Object.keys(properties).length === 0) {
      setProperties(initialProperties);
    }
  }, []); // Empty dependency array means this only runs once on mount

  const handlePropertyChange = (property, value) => {
    const updatedProperties = { ...properties, [property]: value };
    setProperties(updatedProperties);
    updateShaderUniforms({ [property]: value });
    onPropertyChange?.(updatedProperties); // Notify parent of property changes
  };

  const handleReset = () => {
    setProperties(initialProperties);
    updateShaderUniforms(initialProperties);
    onPropertyChange?.(initialProperties);
    setResetKey(prev => prev + 1);
  };

  return (
    <div className="space-y-4">
      {Object.entries(properties).map(([property, value]) => (
        <PropertySlider
          key={`${property}-${resetKey}`}
          property={property}
          value={value}
          onValueChange={(newValue) => handlePropertyChange(property, newValue)}
        />
      ))}
      <button
        onClick={handleReset}
        className="flex justify-center items-center w-full"
      >
        <div className="border border-primary bg-[#E1D9E9] text-[#381952] py-2 px-8 rounded-md hover:bg-primary-dark transition-colors">
          Reset
        </div>
      </button>
    </div>
  );
};

export default PropertyControls;