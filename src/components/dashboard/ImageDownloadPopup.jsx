import React, { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import FileDownload from "../../../public/file_download.svg";

const ImageDownloadPopup = ({ imageDownload, handleDownload }) => {
  const [selectedResolution, setSelectedResolution] = useState("1x");

  const resolutions = ["1x", "2x"];

  const handleDownloadImage = async () => {
    const scale = selectedResolution === "2x" ? 2 : 1;

    try {
      const response = await fetch(imageDownload, {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
          "Content-Type": "application/octet-stream",
        },
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = URL.createObjectURL(blob);

      img.onload = () => {
        const width = img.width * scale;
        const height = img.height * scale;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;

        // Draw the image with the selected resolution scale
        ctx.drawImage(img, 0, 0, width, height);

        // Create a download link after drawing the image
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `image_${width}x${height}.png`;
        link.click();

        // Clean up the object URL to avoid memory leaks
        URL.revokeObjectURL(img.src);
      };

      img.onerror = (error) => {
        console.error("Failed to load image due to CORS or other issues:", error);
        alert("Unable to load the image for download. Please check CORS settings.");
      };
    } catch (error) {
      console.error("Error fetching image:", error);
      alert("Unable to fetch the image for download.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-[20px] shadow-lg overflow-hidden max-w-[1000px] w-full">
        {/* Header Section */}
        <div className="flex justify-between items-center p-4 border-b-2 border-gray-30">
          <h2 className="font-bold text-xl text-secondary">Image Resolution</h2>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleDownload();
            }}
            className="text-gray-600 hover:text-gray-900"
          >
            <IoCloseOutline
              size={20}
              className="text-[white] !bg-primary rounded-[100%]"
            />
          </button>
        </div>

        {/* Body Section */}
        <div className="p-[30px] flex justify-between items-start gap-8">
          {/* Image Section */}
          <div className="w-2/3 border border-[#E1D9E9] p-3">
            <img
              src={imageDownload}
              alt="Selected item"
              className="max-w-full max-h-[474px] m-auto"
              onError={() => {
                console.error("Error loading image");
              }}
            />
          </div>

          {/* Resolution Dropdown */}
          <div className="w-1/3">
            <label className="block mb-2 text-primary font-semibold">
              Resolution:
            </label>
            <div className="resolution-selectBox">
              <select
                value={selectedResolution}
                onChange={(e) => setSelectedResolution(e.target.value)}
                className="border border-secondary rounded-md p-2 w-full focus:outline-none text-secondary pink-dropdown"
              >
                {resolutions.map((res, index) => (
                  <option key={index} value={res}>
                    {res}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="flex justify-end py-5 px-[30px] border-t-2 border-gray-300">
          <button
            onClick={handleDownloadImage}
            className="btn-outline font-bold border-[0.063rem] rounded-[0.5rem] flex items-center gap-2"
          >
            Download
            <img className="" src={FileDownload} alt="" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageDownloadPopup;
