import { useEffect, useState } from "react";
import Curtain from "../../modalStructure/Curtain/Curtain";
import Bedsheet from "../../modalStructure/Bedsheet/Bedsheet";
import Dhoti from "../../modalStructure/Dhoti/Dhoti";
import KurtiModalComponent from "../../modalStructure/kurti/Kurti";
import LungiWithShirt from "../../modalStructure/lungi_shirt/LungiShirt";
import LungiWithoutShirt from "../../modalStructure/lungi_without_shirt/LungiWithoutShirt";
import MenShirtModalComponent from "../../modalStructure/men/MenShirtModalComponent";
import WomenSaree from "../../modalStructure/women/WomenSaree";
import { useSelector } from "react-redux";
import { editProfile } from "../../../services/authService";

const VisualizerImage = ({
  handleCategory,
  item,
  currentStep,
  currentTextures,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sure, setSure] = useState(false);
  const user = useSelector((store) => store.auth.user);
  const remaningCredit = useSelector(
    (store) => store.dashboard.dashboard.remaining_credit
  );

  useEffect(() => {
    if (isModalOpen && !user?.default_popup) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isModalOpen]);

  const handleSure = async () => {
    if (sure) {
      const formData = new FormData();
      formData.append("first_name", user?.first_name);
      formData.append("last_name", user?.last_name);
      formData.append("email", user?.email);
      formData.append("mobile_no", user?.mobile_no);
      formData.append("default_popup", sure);
      const response = await editProfile(formData);
    }
  };

  const currentTexture = currentTextures[item?.id];
  
  // Make sure to pass the editState to your modal components
  const getModalProps = () => ({
    currentStep,
    currentTextures,
    item: {
      ...item,
      editState: currentTexture?.editState || null,
      cropData: currentTexture?.cropData || null,
      originalImage: currentTexture?.originalImage || null
    }
  });


  return (
    <>
      {
        <div className=" ">
          <div className="">
            {item?.name === "Shirt" ? (
              <div>
                <MenShirtModalComponent
                  {...getModalProps()}
                  currentStep={currentStep}
                  currentTextures={currentTextures}
                  item={item}
                />
              </div>
            ) : item?.name === "Saree" ? (
              <div>
                <WomenSaree
                {...getModalProps()}
                  currentStep={currentStep}
                  currentTextures={currentTextures}
                  item={item}
                />
              </div>
            ) : item?.name === "Kurti" ? (
              <div>
                <KurtiModalComponent
                {...getModalProps()}
                  currentStep={currentStep}
                  currentTextures={currentTextures}
                  item={item}
                />
              </div>
            ) : item?.name === "Lungi" ? (
              <div>
                <LungiWithoutShirt
                {...getModalProps()}
                  currentStep={currentStep}
                  currentTextures={currentTextures}
                  item={item}
                />
              </div>
            ) : item?.name === "Lungi-Shirt" ? (
              <div>
                <LungiWithShirt
                {...getModalProps()}
                  currentStep={currentStep}
                  currentTextures={currentTextures}
                  item={item}
                />
              </div>
            ) : item?.name === "Dhoti" ? (
              <div>
                <Dhoti
                {...getModalProps()}
                  currentStep={currentStep}
                  currentTextures={currentTextures}
                  item={item}
                />
              </div>
            ) : item?.name === "Curtain" ? (
              <div>
                <Curtain
                {...getModalProps()}
                  currentStep={currentStep}
                  currentTextures={currentTextures}
                  item={item}
                />
              </div>
            ) : item?.name === "Bedsheet" ? (
              <div>
                <Bedsheet
                {...getModalProps()}
                  currentStep={currentStep}
                  currentTextures={currentTextures}
                  item={item}
                />
              </div>
            ) : (
              <div>Others Component Modals</div>
            )}
          </div>
          {currentStep === 3 ? (
            ""
          ) : (
            <div className="flex gap-2 justify-end md:pr-20 pt-[3.130rem]">
              <button
                // disabled={fabricUploadCount !== items?.length}
                onClick={() => handleCategory(1)}
                className={`btn-primary `}
              >
                Pervious
              </button>
              <button
                onClick={() => {
                  {
                    user?.default_popup
                      ? handleCategory(3)
                      : setIsModalOpen(true);
                  }
                }}
                className="btn-primary"
              >
                Finalize
              </button>
            </div>
          )}
        </div>
      }

      {isModalOpen && !user?.default_popup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black opacity-80 fixed inset-0"></div>
          <div className="bg-white rounded-lg shadow-lg p-6 z-10 max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Confirm Action</h2>
            <p className="mb-6">
              Credit will be deducted and the changes cannot be reversed!,
              If selects this option, the pop-up won’t appear again when they
              finalize.
            </p>
            <div className="flex items-center mb-4">
              <input
                id="default-checkbox"
                type="checkbox"
                value=""
                onChange={() => setSure("true")}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="default-checkbox"
                className="ms-2 text-sm font-medium !text-black dark:text-gray-300"
              >
                Don’t show again
              </label>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleCategory(3);
                  setIsModalOpen(false);
                  setSure(false);
                  handleSure();
                }}
                className="bg-primary   text-white px-4 py-2 rounded-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VisualizerImage;
