import React, {
  useRef,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { toast } from "react-toastify";
import { useThreeScene } from "../useThreeScene";
import ResolutionSelector from "../ResolutionSelector";
import * as THREE from "three";
import { useImageDownload } from "../../dashboard/Download";
import {
  generatedImageService,
} from "../../../services/visualizerService";
import { useImageProcessing } from "../downloadFunction";
import PropertyControls from "../PropertyControl";
import FileDownload from "../../../../public/file_download.svg";

const KurtiModalComponent = ({
  currentStep,
  item,
  modalWidth = "600px",
  modalHeight = "800px",
}) => {
  const refContainer = useRef(null);
  const [selectedResolution, setSelectedResolution] = useState(null);
  const [globalProperties, setGlobalProperties] = useState({
    brightness: 0.59,
    contrast: 1,
    saturation: 1,
    exposure: 1,
    shadowStrength: 1.64,
    highlightImprovement: 1.64,
  });

  const initialProperties = {
    brightness: 0.59,
    contrast: 1,
    saturation: 1,
    exposure: 1,
    shadowStrength: 1.64,
    highlightImprovement: 1.64
  };

  const womenKurtiTemplate = item?.templates;
  const [index, setIndex] = useState(0);

  const womenKurtiTexture = useMemo(
    () => ({
      suitFront: item?.uploadOptions[0]?.image,
      suitSleeve: item?.uploadOptions[0]?.sleeve,
      suitBack: item?.uploadOptions[1]?.back?.image,
      salwarFabric: item?.uploadOptions[2]?.image,
      dupatta: item?.uploadOptions[3]?.image,
      dupattaExt: item?.uploadOptions[4]?.image,
    }),
    [item]
  );
  const totalCredit = localStorage.getItem("totalCredit");

  // Check if watermark should be displayed in step 3
  const shouldShowWatermark = (currentStep === 2) || (currentStep === 3 && totalCredit <= 10);

  const mergeDupattaImages = useCallback((dupattaImageSrc, dupattaExtImageSrc) => {
    return new Promise((resolve, reject) => {
      const dupattaImage = new Image();
      const dupattaExtImage = new Image();

      dupattaImage.onload = () => {
        dupattaExtImage.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Set canvas width based on the main dupatta image
          const canvasWidth = dupattaImage.width;

          // Calculate final canvas height for 1:3 aspect ratio
          const canvasHeight = canvasWidth * 3;

          // Set canvas dimensions
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;

          // Calculate the space needed for extension pattern
          const mainDupattaHeight = dupattaImage.height;
          const remainingHeight = canvasHeight - mainDupattaHeight;

          // Calculate how many times we need to repeat the extension
          const extensionHeight = dupattaExtImage.height;
          const repetitions = Math.ceil(remainingHeight / extensionHeight);

          // Draw extension pattern repeatedly to fill the top space
          for (let i = 0; i < repetitions; i++) {
            const yPosition = i * extensionHeight;
            const heightToDraw = Math.min(
              extensionHeight,
              remainingHeight - (i * extensionHeight)
            );

            // Draw extension image scaled to match canvas width
            ctx.drawImage(
              dupattaExtImage,
              0, 0, dupattaExtImage.width, heightToDraw,
              0, yPosition, canvasWidth, heightToDraw
            );
          }

          // Draw the main dupatta image at the bottom
          ctx.drawImage(
            dupattaImage,
            0, 0, dupattaImage.width, dupattaImage.height,
            0, remainingHeight, canvasWidth, mainDupattaHeight
          );

          // Convert to base64
          const mergedImageBase64 = canvas.toDataURL("image/png");

          // Create download link
          // const downloadLink = document.createElement("a");
          // downloadLink.href = mergedImageBase64;
          // downloadLink.download = "merged_dupatta.png";
          // document.body.appendChild(downloadLink);
          // downloadLink.click();
          // document.body.removeChild(downloadLink);

          resolve(mergedImageBase64);
        };

        dupattaExtImage.onerror = () =>
          reject(new Error("Failed to load dupatta extension image"));
        dupattaExtImage.src = dupattaExtImageSrc;
      };

      dupattaImage.onerror = () =>
        reject(new Error("Failed to load dupatta image"));
      dupattaImage.src = dupattaImageSrc;
    });
  }, []);

  // Example usage:
  const handleMergeDupattaImages = async (dupattaImageUrl, dupattaExtImageUrl) => {
    try {
      await mergeDupattaImages(dupattaExtImageUrl, dupattaImageUrl);
      console.log("Dupatta images merged and downloaded successfully!");
    } catch (error) {
      console.error("Error merging dupatta images:", error);
    }
  };
  handleMergeDupattaImages()

  const [finalMergedImage, setFinalMergedImage] = useState("");

  useEffect(() => {
    const dupattaImageBase64 = item?.uploadOptions[3]?.image;
    const dupattaExtImageBase64 = item?.uploadOptions[4]?.image;

    if (dupattaImageBase64 && dupattaExtImageBase64) {
      mergeDupattaImages(dupattaExtImageBase64, dupattaImageBase64)
        .then(setFinalMergedImage)
        .catch((error) => console.error("Error merging images:", error));
    } else {
      console.warn("Dupatta Pallu images are not available for merging.");
    }
  }, [item, mergeDupattaImages]);

  const modelConfigs = useMemo(() => {
    const configs = [
      {
        modelUrl: womenKurtiTemplate[index]?.suit_front,
        textureUrl: womenKurtiTexture.suitFront,
        sleeveUrl: womenKurtiTexture.suitSleeve,
        shadowTextureUrl: womenKurtiTemplate[index]?.shadow_png,
      },
      {
        modelUrl: womenKurtiTemplate[index]?.bottom,
        textureUrl: womenKurtiTexture.salwarFabric,
        shadowTextureUrl: womenKurtiTemplate[index]?.shadow_png,
      },
      {
        modelUrl: womenKurtiTemplate[index]?.dupatta_body,
        textureUrl: finalMergedImage,
        shadowTextureUrl: womenKurtiTemplate[index]?.shadow_png,
      },
      {
        modelUrl: womenKurtiTemplate[index]?.dupatta_body,
        textureUrl: finalMergedImage,
        shadowTextureUrl: womenKurtiTemplate[index]?.shadow_png,
      },
      {
        modelUrl: womenKurtiTemplate[index]?.body_glb,
        textureUrl: womenKurtiTemplate[index]?.body_png,
      },
    ];
  
    // Add background model configuration conditionally
    if (womenKurtiTemplate[index]?.background_glb) {
      configs.push({
        modelUrl: womenKurtiTemplate[index]?.background_glb,
        textureUrl: womenKurtiTemplate[index]?.background_png,
      });
    }
  
    return configs;
  }, [womenKurtiTemplate, womenKurtiTexture, finalMergedImage, index]);
  

  const { renderer, scene, camera, loading, updateShaderUniforms } =
    useThreeScene(refContainer, modelConfigs, globalProperties, "WomenKurti");
  const downloadImage = useImageDownload(renderer, scene, camera, item);

  const handlePropertyChange = useCallback((newProperties) => {
    setGlobalProperties(newProperties);
    updateShaderUniforms(newProperties);
  }, [updateShaderUniforms]);

  const handleChangeModel = useCallback((value) => {
    setIndex(value);
    // Apply current global properties to new model
    updateShaderUniforms(globalProperties);
  }, [globalProperties, updateShaderUniforms]);


  const { processImage } = useImageProcessing(renderer, scene, camera, item);
  useEffect(() => {
    if (currentStep === 3) {
      processImage();
    }
  }, [currentStep, processImage]);

  return (
    <div className="bg-white p-6">
      <div className="flex flex-col md:flex-row justify-center gap-10 items-start bg-white p-4 rounded-lg">
        <div
          className="relative w-full md:w-1/2 shirtCanvas flex items-center justify-center overflow-hidden"
          ref={refContainer}
          style={{
            // height: modalHeight,
            visibility: loading ? "hidden" : "visible",
            aspectRatio: "2 / 3", // Set aspect ratio for modern browsers
            maxWidth: "100%", // Responsive width constraint
            height: "auto", // Let height adjust based on aspect ratio
          }}
        >
          {currentStep !== 3 && (
            <div className="absolute top-[-40px] text-2xl font-bold">
              Visualizer Image
            </div>
          )}
          {shouldShowWatermark && (
            <img
              className="absolute top-0 left-0 h-full w-full opacity-100"
              src="/watermark.png"
              alt="Watermark"
            />
          )}
        </div>

        {loading && (
          <div className="flex items-center justify-center absolute top-[50%] left-[22%] z-50">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <span className="ml-2 text-xl font-bold">Loading...</span>
          </div>
        )}

        {currentStep !== 3 ? (
          <div className="flex flex-col gap-6 w-full sm:w-1/2">
            <PropertyControls
              updateShaderUniforms={updateShaderUniforms}
              initialProperties={initialProperties}
              onPropertyChange={handlePropertyChange}
            />
          </div>
        ) : (
          <ResolutionSelector
            setSelectedMultiplier={setSelectedResolution}
            downloadImage={() => downloadImage(selectedResolution)}
          />
        )}
      </div>

      {currentStep === 3 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => downloadImage(selectedResolution)}
            className="btn-outline font-bold border-[0.063rem] rounded-[0.5rem] flex items-center gap-2 mt-4 mr-[350px]"
          >
            Download
            <img src={FileDownload} alt="Download icon" className="w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default KurtiModalComponent;
