import { useEffect, useState } from "react";
import Tooltip from "./Tooltip";
import VisulaizerModel from "./VisulaizerModel"

const Category = ({ items, handleCategory, setItem }) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [viewedItems, setViewedItems] = useState([]);

  // Initialize viewed items from session storage
  useEffect(() => {
    const storedViewedItems = JSON.parse(sessionStorage.getItem('viewedItems') || '[]');
    setViewedItems(storedViewedItems);
  }, []);

  // Handle modal scroll lock
  useEffect(() => {
    if (showModal) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showModal]);

  // Reset state when items change
  useEffect(() => {
    setSelectedItem(null);
    setDescription("");
    setVideoUrl("");
    setShowModal(false);
  }, [items]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setItem(item);

    const hasBeenViewed = viewedItems.includes(item.name);

    if (!hasBeenViewed) {
      setShowModal(true);
      const updatedViewedItems = [...viewedItems, item.name];
      sessionStorage.setItem('viewedItems', JSON.stringify(updatedViewedItems));
      setViewedItems(updatedViewedItems);
    }

    setDescription(item.description || "");
    setVideoUrl(item.videoUrl || "");

    // Clear specific session storage items
    sessionStorage.removeItem("palluTop");
    sessionStorage.removeItem("sariBottom");
  };
  const handleNext = () => {
    if (!selectedItem) return;

      handleCategory(1);
  };

  return (
    <>
      {showModal && (
        <VisulaizerModel
          open={showModal}
          onClose={() => setShowModal(false)}
          selectedItem={selectedItem}
        />
      )}

      <div className="w-full">
        <div className="w-full flex justify-end xl:px-[3.125rem] px-8">
          <Tooltip
            setTooltipVisible={setTooltipVisible}
            tooltipVisible={tooltipVisible}
            description={description}
            videoUrl={videoUrl}
          />
        </div>

        <div className="flex max-w-[90rem] flex-col justify-center xl:px-[3.125rem] xl:py-[3.130rem] px-8 pt-8">
          <div className="flex flex-wrap gap-[1.5rem]">
            {items?.map((item, index) => (
              <div
                key={index}
                className={`
                flex flex-col !min-w-[250px] cursor-pointer 
                items-center justify-center border rounded-[.5rem] 
                w-full sm:w-[calc(50%-0.75rem)] 
                md:w-[calc((100%/3)-1.125rem)] 
                xl:w-[calc(25%-1.125rem)]
                hover:border-primary transition-colors duration-200
                ${selectedItem?.name === item.name ? "border-primary" : ""}
                `}
                onClick={() => handleItemClick(item)}
              >
                <div className="relative w-full h-[18rem] p-2">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                  {viewedItems.includes(item.name) && (
                    <div className="absolute top-2 right-2 rounded-full w-3 h-3"
                      title="Previously viewed"
                    />
                  )}
                </div>
                <span className="text-primary font-[600] text-[1.1rem] leading-[1.35rem] Barlow pb-[1.5rem]">
                  {item.name}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-[3.130rem]">
        <button
          disabled={!selectedItem}
          onClick={handleNext}
          className={`
            btn-primary transition-all duration-200
            ${!selectedItem && "opacity-50 cursor-not-allowed"}
            ${selectedItem && "hover:opacity-90"}
          `}
        >
           Next
        </button>
      </div>
        </div>
      </div>
    </>
  );
};

export default Category;
