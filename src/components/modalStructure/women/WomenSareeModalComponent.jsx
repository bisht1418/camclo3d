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
import ModelStyleSelector from "../ModelStyleSelector";
import { useImageDownload } from "../../dashboard/Download";
import { generatedImageService } from "../../../services/visualizerService";
import { useImageProcessing } from "../downloadFunction";
import PropertyControls from "../PropertyControl";
import FileDownload from "../../../../public/file_download.svg";

const WomenSareeModalComponent = ({
  currentStep,
  item,
  modalWidth = "600px",
  modalHeight = "800px",
}) => {
  const refContainer = useRef(null);
  const [modelIndex, setModelIndex] = useState(0);
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
  const [finalMergedImage, setFinalMergedImage] = useState("");

  const mergeSareeImages = useCallback((bodyImage, palluImage) => {
    return new Promise((resolve, reject) => {
      const bodyImg = new Image();
      const palluImg = new Image();

      bodyImg.onload = () => {
        palluImg.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Set canvas width based on the body image width
          const canvasWidth = bodyImg.width;

          // Calculate final canvas height for 1:3 aspect ratio
          const canvasHeight = canvasWidth * 3;

          // Set canvas dimensions
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;

          // Calculate the space needed for pattern
          const mainBodyHeight = bodyImg.height;
          const remainingHeight = canvasHeight - mainBodyHeight;

          // Calculate how many times we need to repeat the pallu
          const palluHeight = palluImg.height;
          const repetitions = Math.ceil(remainingHeight / palluHeight);

          // Draw pallu pattern repeatedly to fill the top space
          for (let i = 0; i < repetitions; i++) {
            const yPosition = i * palluHeight;
            const heightToDraw = Math.min(
              palluHeight,
              remainingHeight - (i * palluHeight)
            );

            // Draw pallu image scaled to match canvas width
            ctx.drawImage(
              palluImg,
              0, 0, palluImg.width, heightToDraw,
              0, yPosition, canvasWidth, heightToDraw
            );
          }

          // Draw the main body image at the bottom
          ctx.drawImage(
            bodyImg,
            0, 0, bodyImg.width, bodyImg.height,
            0, remainingHeight, canvasWidth, mainBodyHeight
          );

          // Convert to base64
          const mergedImageBase64 = canvas.toDataURL("image/png");

          // Create download link
          // const downloadLink = document.createElement("a");
          // downloadLink.href = mergedImageBase64;
          // downloadLink.download = "merged_saree.png";
          // document.body.appendChild(downloadLink);
          // downloadLink.click();
          // document.body.removeChild(downloadLink);

          resolve(mergedImageBase64);
        };

        palluImg.onerror = () =>
          reject(new Error("Failed to load pallu image"));
        palluImg.src = palluImage;
      };

      bodyImg.onerror = () =>
        reject(new Error("Failed to load body image"));
      bodyImg.src = bodyImage;
    });
  }, []);

  useEffect(() => {
    const bodyImageBase64 = item?.uploadOptions[2]?.image;
    const palluImageBase64 = item?.uploadOptions[1]?.image;

    if (bodyImageBase64 && palluImageBase64) {
      mergeSareeImages(palluImageBase64,bodyImageBase64)
        .then((mergedImage) => {
          setFinalMergedImage(mergedImage);
        })
        .catch((error) => {
          console.error("Error merging images:", error);
        });
    }
  }, [item, mergeSareeImages]);

  const womenSareeTexture = useMemo(
    () => ({
      blouseFabric: item?.uploadOptions[0]?.image,
      sleeveTexture: item?.uploadOptions[0]?.sleeve,
      palluFabric: item?.uploadOptions[1]?.image,
      sariFabric: item?.uploadOptions[2]?.image,
      finalSaree: finalMergedImage,
    }),
    [item, finalMergedImage]
  );

  const womenSareeTemplate = item?.templates;

  const currentTextures =
    womenSareeTexture || productData[1]?.textures[0].layerImage;

    const modelConfigs = useMemo(() => {
      const configs = [
        {
          modelUrl: womenSareeTemplate[modelIndex]?.saree_body,
          textureUrl: currentTextures?.finalSaree,
          shadowTextureUrl: womenSareeTemplate[modelIndex]?.shadow_png,
        },
        {
          modelUrl: womenSareeTemplate[modelIndex]?.add_blouse,
          textureUrl: currentTextures?.blouseFabric,
          sleeveUrl: currentTextures?.sleeveTexture,
          shadowTextureUrl: womenSareeTemplate[modelIndex]?.shadow_png,
        },
        {
          modelUrl: womenSareeTemplate[modelIndex]?.body_glb,
          textureUrl: womenSareeTemplate[modelIndex]?.body_png,
        },
      ];
    
      // Add background model configuration conditionally
      if (womenSareeTemplate[modelIndex]?.background_glb) {
        configs.push({
          modelUrl: womenSareeTemplate[modelIndex]?.background_glb,
          textureUrl: womenSareeTemplate[modelIndex]?.background_png,
        });
      }
    
      return configs;
    }, [modelIndex, currentTextures, womenSareeTemplate]);
    

  const additionalInfo = "WomenSaree";
  let currentModelIndex = modelIndex;

  const { renderer, scene, camera, loading, updateShaderUniforms } = useThreeScene(
    refContainer,
    modelConfigs,
    globalProperties,
    additionalInfo,
    currentModelIndex,
    finalMergedImage,
  );
  const handlePropertyChange = useCallback((newProperties) => {
    setGlobalProperties(newProperties);
    updateShaderUniforms(newProperties);
  }, [updateShaderUniforms]);

  const handleChangeModel = useCallback((value) => {
    setModelIndex(value);
    // Apply current global properties to new model
    updateShaderUniforms(globalProperties);
  }, [globalProperties, updateShaderUniforms]);

  const downloadImage = useImageDownload(renderer, scene, camera, item);

  const { processImage } = useImageProcessing(renderer, scene, camera, item);
  useEffect(() => {
    if (currentStep === 3) {
      processImage();
    }
  }, [currentStep, processImage]);

  const totalCredit = localStorage.getItem("totalCredit");

  // Check if watermark should be displayed in step 3
  const shouldShowWatermark = (currentStep === 2) || (currentStep === 3 && totalCredit <= 10);

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
            <ModelStyleSelector
              menShirtTemplate={womenSareeTemplate}
              handleChangeModel={handleChangeModel}
              modelIndex={modelIndex}
              item={item}
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

export default WomenSareeModalComponent;
