import { useState, useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";

const ModelStyleSelector = ({
  menShirtTemplate,
  handleChangeModel,
  modelIndex,
  item,
  onNext
}) => {

  const [showPopup, setShowPopup] = useState(false);
  const [selectedModels, setSelectedModels] = useState(
    modelIndex !== undefined ? [modelIndex] : []
  );
  const isBulkUpload = sessionStorage.getItem("isBulkUpload") === "true";

  const handleModelClick = (index) => {
    if (index === 9) {
      setShowPopup(true);
    } else if (isBulkUpload) {
      setSelectedModels(prev => {
        if (prev.includes(index)) {
          return prev.filter(i => i !== index);
        }
        return [...prev, index];
      });
    } else {
      handleChangeModel(index);
    }
  };

  const handleApplyClick = () => {
    if (isBulkUpload) {
      // If no models are selected, keep the current selection
      if (selectedModels.length === 0 && modelIndex !== undefined) {
        setSelectedModels([modelIndex]);
      }
    } else {
      handleChangeModel(selectedModels);
    }
    setShowPopup(false);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const handleNextClick = () => {
    if (onNext && selectedModels.length > 0) {
      onNext(selectedModels);
    }
  };

  const toggleModelSelection = (index) => {
    if (isBulkUpload) {
      setSelectedModels(prev => {
        if (prev.includes(index)) {
          return prev.filter(i => i !== index);
        }
        return [...prev, index];
      });
    } else {
      setSelectedModels([index]);
    }
  };

  useEffect(() => {
    if (showPopup) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showPopup]);
  return (
    <div className="w-full z-100">
      <div className="max-w-[677px] m-auto flex flex-col">
        <div className="font-semibold text-xl font-barlow m-4 ">{item.name} Style</div>
        <div className="flex flex-wrap gap-4 justify-center items-center ">
          {menShirtTemplate?.slice(0, 10).map((item, index) => (
            <div
            key={index}
            className={`relative w-[120px] h-[120px] flex ${
              index === modelIndex && "border border-primary"
            } items-center justify-center shadow-lg rounded-lg transition-all duration-300 transform hover:scale-110 ${
              index === 9
              ? "before:content-[''] before:absolute before:top-0 before:left-0 before:bg-[#8C2A8D] before:w-[100%] before:h-[100%] before:opacity-50"
              : ""
            }`}
            >
              <button
                className="text-white p-[5px] w-full h-full flex items-center justify-center"
                onClick={() => handleModelClick(index)}
                >
                <img
                  src={item?.template_png}
                  width="70px"
                  height="70px"
                  className="object-cover bg-white object-center rounded-lg mix-blend-multiply"
                  alt={`Template ${index + 1}`}
                  />
                {index === 9 && (
                  <p className="text-sm text-white text-center pb-[1.25rem] absolute bottom-5 right-[50%] left-[50%] text-nowrap flex justify-center items-center font-bold">
                    View All
                  </p>
                )}
              </button>
              {isBulkUpload && selectedModels.includes(index) && index !== 9 && (
                <div className="absolute top-2 right-2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">
                  {selectedModels.indexOf(index) + 1}
                </div>
              )}
            </div>
          ))}
        </div>

        {isBulkUpload && (
          <div className="flex justify-between items-center mt-8">
            <div className="text-sm text-gray-600">
              Selected: {selectedModels.length} template{selectedModels.length !== 1 ? 's' : ''}
            </div>
            <button
              onClick={handleNextClick}
              disabled={selectedModels.length === 0}
              className={`px-10 py-2 rounded-md font-semibold ${
                selectedModels.length > 0
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              } transition-colors`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-[45%] h-[80%] flex flex-col">
            <div className="p-4 border-b shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl text-[#381952] font-bold">{item.name} Style</p>
                  {isBulkUpload && (
                    <p className="text-sm text-gray-600 mt-1">
                      Selected: {selectedModels.length} template{selectedModels.length !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                <button
                  className="hover:text-[#92278F]"
                  onClick={handlePopupClose}
                >
                  <IoCloseOutline
                    size={20}
                    className="text-white bg-primary rounded-full"
                  />
                </button>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto p-6">
              <div className="grid grid-cols-5 gap-4">
                {menShirtTemplate?.map((template, index) => (
                  <div
                    key={index}
                    className={`relative flex items-center justify-center p-4 border ${
                      selectedModels.includes(index) ? "border-2 border-primary" : "border-gray-200"
                    } transition-transform duration-300 transform hover:scale-105 cursor-pointer`}
                    onClick={() => toggleModelSelection(index)}
                  >
                    <img
                      src={template.data?.img}
                      width="120px"
                      height="120px"
                      className="object-cover object-center rounded-lg bg-[#f9fafc]"
                      alt={`Template ${index + 1}`}
                    />
                    {isBulkUpload && selectedModels.includes(index) && (
                      <div className="absolute top-2 right-2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">
                        {selectedModels.indexOf(index) + 1}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t shadow-custom">
              <div className="flex justify-end gap-4">
                {isBulkUpload && (
                  <button
                    onClick={handleNextClick}
                    disabled={selectedModels.length === 0}
                    className={`px-10 py-2 rounded-md font-semibold ${
                      selectedModels.length > 0
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    } transition-colors`}
                  >
                    Next
                  </button>
                )}
                <button
                  className="bg-white text-primary border border-primary px-10 py-2 rounded-md font-semibold hover:bg-primary/10"
                  onClick={handleApplyClick}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelStyleSelector;