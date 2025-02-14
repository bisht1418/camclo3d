import { useState } from "react";
import CropTool from "../CropTool";

const UploadPopup = ({ 
  open, 
  onClose, 
  image, 
  onSave, 
  itemName, 
  onCancel,
  editState,
  cropData,
}) => {
  const [croppedImageURL, setCroppedImageURL] = useState("");
  
  const handleCrop = (newCroppedImageURL, newEditState, newCropData) => {
    setCroppedImageURL(newCroppedImageURL);
    onSave(newCroppedImageURL, newEditState, newCropData);
  
    // Check if palluTop is being stored
    if (itemName === "Add Pallu" || itemName === "Dupatta Pallu") {
      // Only store if sariBottom doesn't exist
      if (!sessionStorage.getItem("sariBottom")) {
        const palluTop = newCropData.slice(0, 2);
        sessionStorage.setItem("palluTop", JSON.stringify(palluTop));
      }
    }
  
    // Check if sariBottom is being stored
    if (itemName === "Saree Body" || itemName === "Dupatta Body") {
      // Only store if palluTop doesn't exist
      if (!sessionStorage.getItem("palluTop")) {
        const sariBottom = newCropData.slice(2);
        sessionStorage.setItem("sariBottom", JSON.stringify(sariBottom));
      }
    }
  };
  
  
  
  

  if (!open) return null;
  
  return (
    <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-fit w-full mx-4">
        <div className="p-6">
          <CropTool 
            itemName={itemName} 
            image={image} 
            onCrop={handleCrop} 
            onCancel={onCancel} 
            onClose={onClose}
            editState={editState}
            cropData={cropData}
          />
        </div>
      </div>
    </div>
  );
};

export default UploadPopup;