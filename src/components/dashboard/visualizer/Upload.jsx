import { useCallback, useMemo, useRef, useState } from "react";
import { useEffect } from "react";
import UploadPopup from "./UploadPopup";
import Tooltip from "./Tooltip";
import { FaEdit, FaTrash } from 'react-icons/fa';
const Upload = ({ uploadOptions, setItem, setCurrentTextures, handleCategory }) => {
  const [items, setItems] = useState(uploadOptions?.uploadOptions.map(item => ({
    ...item,
    editState: item.editState || null,
    originalImage: item.originalImage || null,
    cropData: item.cropData || null,
    image: item.image || null,
    hasBeenOpened: false
  })) || []);

  const [open, setOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [currentItem, setCurrentItem] = useState({
    id: null,
    name: "",
    editState: null,
    cropData: null,
    originalImage: null
  });
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const fabricUploadCount = useMemo(() => {
    return items.filter((item) => item.image).length;
  }, [items]);

   // Validate if all items are ready to proceed
   const canProceed = useMemo(() => {
    return items.every(item => 
      item.image !== null && // Image must be uploaded
      item.hasBeenOpened // Must have been opened at least once
    );
  }, [items]);


  const fileInputRefs = useRef([]);

  const getRelatedItemName = (name) => {
    const relatedItems = {
      'Saree Body': 'Add Pallu',
      'Add Pallu': 'Saree Body',
      'Dupatta Pallu': 'Dupatta Body',
      'Dupatta Body': 'Dupatta Pallu'
    };
    return relatedItems[name];
  };

  const handleImageClick = useCallback(
    (item, index) => {
      if (item.image) {
        handleEdit(item);
      } else {
        fileInputRefs.current[index]?.click();
      }
    },
    [fileInputRefs]
  );

  const handleImageUpload = useCallback(
    (e, id, name, index) => {
      const file = e.target.files[0];
      if (!file) return;

      const imageURL = URL.createObjectURL(file);
      
      const relatedItemName = getRelatedItemName(name);
      const relatedItem = relatedItemName ? 
        items.find(item => item.name === relatedItemName) : 
        null;

      const imageData = {
        image: imageURL,
        originalImage: imageURL,
        editState: null,
        cropData: null,
        hasBeenOpened: false
      };

      const updatedItems = items.map(item => {
        if (item.id === id || (relatedItem && item.id === relatedItem.id)) {
          return {
            ...item,
            ...imageData
          };
        }
        return item;
      });

      setItems(updatedItems);

      setItem(prev => ({
        ...prev,
        uploadOptions: prev.uploadOptions.map(item => {
          if (item.id === id || (relatedItem && item.id === relatedItem.id)) {
            return {
              ...item,
              ...imageData
            };
          }
          return item;
        })
      }));

      const textureUpdates = {
        [id]: imageData
      };

      if (relatedItem) {
        textureUpdates[relatedItem.id] = imageData;
      }

      setCurrentTextures(prev => ({
        ...prev,
        ...textureUpdates
      }));

      setPreviewImage(imageURL);
      setCurrentItem({
        id,
        name,
        editState: null,
        cropData: null,
        originalImage: imageURL
      });
      setOpen(true);

      if (fileInputRefs.current[index]) {
        fileInputRefs.current[index].value = "";
      }
    },
    [items, setItem, setCurrentTextures]
  );


  const handleSave = useCallback(
    (img, editState, cropData) => {
      const updatedItem = {
        image: img?.main || img,
        editState,
        cropData,
        originalImage: currentItem.originalImage,
        hasBeenOpened: true
      };

      // Find related item based on current item's name
      const relatedItemName = getRelatedItemName(currentItem.name);
      const relatedItem = relatedItemName ? 
        items.find(item => item.name === relatedItemName) : 
        null;

      // Update items including the related item if it exists
      setItems(prevItems =>
        prevItems.map(item => {
          if (item.id === currentItem.id) {
            return {
              ...item,
              ...updatedItem,
              sleeve: img?.sleeve
            };
          }
          // Apply the same rotation to related item if it exists
          if (relatedItem && item.id === relatedItem.id) {
            return {
              ...item,
              editState: {
                ...item.editState,
                rotation: editState?.rotation || 0 // Sync rotation
              }
            };
          }
          return item;
        })
      );

      // Update uploadOptions state
      setItem(prevItems => ({
        ...prevItems,
        uploadOptions: prevItems.uploadOptions.map(item => {
          if (item.id === currentItem.id) {
            return {
              ...item,
              ...updatedItem,
              sleeve: img?.sleeve
            };
          }
          // Apply the same rotation to related item if it exists
          if (relatedItem && item.id === relatedItem.id) {
            return {
              ...item,
              editState: {
                ...item.editState,
                rotation: editState?.rotation || 0 // Sync rotation
              }
            };
          }
          return item;
        })
      }));

      // Update textures including the related item
      const textureUpdates = {
        [currentItem.id]: updatedItem
      };

      if (relatedItem) {
        textureUpdates[relatedItem.id] = {
          ...relatedItem,
          editState: {
            ...relatedItem.editState,
            rotation: editState?.rotation || 0 // Sync rotation
          }
        };
      }

      setCurrentTextures(prevTextures => ({
        ...prevTextures,
        ...textureUpdates
      }));

      setOpen(false);
      setPreviewImage(null);
      setCurrentItem({
        id: null,
        name: "",
        editState: null,
        cropData: null,
        originalImage: null
      });
    },
    [currentItem, setItem, setCurrentTextures, items]
  );

  const handleCancel = useCallback(() => {
    // Find the current item in items state to check if it's a new upload or edit
    const existingItem = items.find(item => item.id === currentItem.id);
    const isNewUpload = existingItem && !existingItem.editState && !existingItem.cropData;
  
    if (isNewUpload) {
      // Get related item name if exists
      const relatedItemName = getRelatedItemName(currentItem.name);
      const relatedItem = relatedItemName ? 
        items.find(item => item.name === relatedItemName) : 
        null;
  
      // Clear the image data from all states only for new uploads
      setItems(prevItems =>
        prevItems.map(item =>
          (item.id === currentItem.id || (relatedItem && item.id === relatedItem.id))
            ? {
              ...item,
              image: null,
              editState: null,
              cropData: null,
              originalImage: null,
              sleeve: null
            }
            : item
        )
      );
  
      setCurrentTextures(prevTextures => {
        const newTextures = { ...prevTextures };
        delete newTextures[currentItem.id];
        if (relatedItem) {
          delete newTextures[relatedItem.id];
        }
        return newTextures;
      });
  
      // Only clear session storage on new uploads
      sessionStorage.removeItem("palluTop");
      sessionStorage.removeItem("sariBottom");
    }
  
    // Always reset these states regardless of new upload or edit
    setPreviewImage(null);
    setCurrentItem({
      id: null,
      name: "",
      editState: null,
      cropData: null,
      originalImage: null
    });
    setOpen(false);
  }, [currentItem, items, setItem, setCurrentTextures]);
  
  const handleCategoryChange = useCallback(
    (direction) => {
      if (direction === "Previous") {
        // Always allow going to previous stage
        handleCategory(0);
      } else {
        // Only allow going to next stage if all conditions are met
        if (canProceed) {
          handleCategory(2);
        } else {
          // Optional: Add error handling or user feedback
          alert("Please handle related items before proceeding.");
        }
      }
    },
    [canProceed, handleCategory]
  );
  
  const handleEdit = useCallback((item) => {
    setPreviewImage(item.originalImage || item.image);
    setCurrentItem({
      id: item.id,
      name: item.name,
      editState: item.editState,
      cropData: item.cropData,
      originalImage: item.originalImage || item.image,
    });
    setOpen(true);
  }, []);

  const handleDelete = useCallback(
    (id, name) => {
      const relatedItems = {
        "Saree Body": "Add Pallu",
        "Add Pallu": "Saree Body",
        "Dupatta Pallu": "Dupatta Body",
        "Dupatta Body": "Dupatta Pallu"
      };
  
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id || item.name === relatedItems[name]
            ? { ...item, image: null, sleeve: null, editState: null, originalImage: null, cropData: null }
            : item
        )
      );
  
      setItem((prevItems) => ({
        ...prevItems,
        uploadOptions: prevItems.uploadOptions.map((item) =>
          item.id === id || item.name === relatedItems[name]
            ? { ...item, image: null, sleeve: null, editState: null, cropData: null }
            : item
        ),
      }));
  
      setCurrentTextures((prevTextures) => {
        const newTextures = { ...prevTextures };
        delete newTextures[id];
        const relatedItem = items.find((item) => item.name === relatedItems[name]);
        if (relatedItem) {
          delete newTextures[relatedItem.id];
        }
        return newTextures;
      });
  
      // Remove "palluTop" if "pallu" is deleted
      if (name === "Add Pallu" || name === "Saree Body" || name === "Dupatta Pallu"|| name === "Dupatta Body") {
        sessionStorage.removeItem("palluTop");
      }
  
      // Remove "sariBottom" if "sari" is deleted 
      if (name === "Saree Body" || name === "Add Pallu" || name === "Dupatta Pallu"|| name === "Dupatta Body") {
        sessionStorage.removeItem("sariBottom");
      }
    },
    [setItem, setCurrentTextures, items]
  );
  
  

  useEffect(() => {
    if (uploadOptions?.uploadOptions) {
      setItems(uploadOptions.uploadOptions.map(item => ({
        ...item,
        editState: item.editState || null,
        originalImage: item.originalImage || null,
        cropData: item.cropData || null,
        image: item.image || null
      })));
    }
  }, [uploadOptions]);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", open);
    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);
  const description = uploadOptions?.description;
  const videolUrl = uploadOptions?.videoUrl;
  return (
    <>
      <UploadPopup
        open={open}
        onClose={() => setOpen(false)}
        image={currentItem.originalImage}
        itemName={currentItem.name}
        onSave={handleSave}
        onCancel={handleCancel}
        editState={currentItem.editState}
        cropData={currentItem.cropData}
      />

      <div className="flex justify-between px-[3.125rem]">
        <h3 className="font-[700] text-[1.625rem] leading-[1.95rem] text-secondary Barlow">
          Upload Image
        </h3>
        <Tooltip
          setTooltipVisible={setTooltipVisible}
          tooltipVisible={tooltipVisible}
          description={description}
          videoUrl={videolUrl}
        />
      </div>
      <div className="flex flex-col justify-center px-[3.125rem] py-[3.130rem]">
        <div className="flex flex-wrap gap-[1.5rem]">
          {items.map((item, index) => (
            <div
              key={item.id}
              onClick={() => handleImageClick(item, index)}
              className={`flex flex-col items-center justify-center overflow-auto max-h-[400px] ${item.image
                  ? "border border-1 border-primaryInputBorder"
                  : "outline-dotted outline-1 outline-primary"
                } rounded-[.5rem] bg-[#F3F0FF] md:w-[calc((100%/3)-1.125rem)] sm:w-[calc(50%-1.125rem)] w-full min-h-[15.875rem] cursor-pointer relative`}
              style={{ height: "200px" }}
            >
              <div className="w-full h-full flex flex-col items-center justify-center">
                {item.image ? (
                  <img
                    src={item.image}
                    className="max-w-full max-h-full object-contain"
                    alt={item.name}
                  />
                ) : (
                  <>
                    <img
                      src="/uploadIcon.png"
                      className="w-[4rem] h-[4rem] py-[0.75rem] object-contain cursor-pointer"
                      alt="Upload Icon"
                    />
                    <span className="text-secondary font-[500] text-[1.1rem] leading-[1.463rem] Barlow pb-[1.5rem]">
                      {item.name}
                    </span>
                  </>
                )}
                <input
                  id={`file-upload-${item.id}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={(el) => (fileInputRefs.current[index] = el)}
                  onChange={(e) => handleImageUpload(e, item.id, item.name, index)}
                />
              </div>
              {item.image && (
                <div className="absolute top-2 right-2 flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-primary text-white p-2 rounded-full hover:bg-opacity-80 transition-colors"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.name)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-opacity-80 transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-6 pt-[3.130rem]">
          <button
            onClick={() => handleCategoryChange("Previous")}
            className="btn-primary"
          >
            Previous
          </button>
          <button
            disabled={fabricUploadCount !== items.length}
            onClick={() => handleCategoryChange("Next")}
            className={`btn-primary ${fabricUploadCount !== items.length && !canProceed
                ? "cursor-not-allowed !bg-primaryLight"
                : "bg-primaryLight"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default Upload;