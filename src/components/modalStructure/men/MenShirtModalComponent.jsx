import { useRef, useState, useCallback, useMemo, useEffect } from "react";
import { useThreeScene } from "../useThreeScene";
import ModelStyleSelector from "../ModelStyleSelector";
import ResolutionSelector from "../ResolutionSelector";
import { useImageProcessing } from "../downloadFunction";
import { useImageDownload } from "../../dashboard/Download";
import PropertyControls from "../PropertyControl";
import FileDownload from "../../../../public/file_download.svg";

const MenShirtModalComponent = ({
  currentStep,
  item,
  modalWidth = "500px",
  modalHeight = "800px",
}) => {
  const menShirtTemplate = item?.templates;
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
    highlightImprovement: 1.64,
  };

  const currentTextures = item?.uploadOptions[0]?.image || menShirtTemplate[modelIndex]?.defaultTexture;
  const modelConfigs = useMemo(() => {
    const configs = [
      {
        modelUrl: menShirtTemplate[modelIndex]?.shirt_fabric,
        textureUrl: currentTextures,
        shadowTextureUrl: menShirtTemplate[modelIndex]?.shadow_png,
      },
      {
        modelUrl: menShirtTemplate[modelIndex]?.body_glb,
        textureUrl: menShirtTemplate[modelIndex]?.body_png,
      },
    ];
  
    if (menShirtTemplate[modelIndex]?.background_glb) {
      configs.push({
        modelUrl: menShirtTemplate[modelIndex]?.background_glb,
        textureUrl: menShirtTemplate[modelIndex]?.background_png,
      });
    }
  
    return configs;
  }, [modelIndex, currentTextures, menShirtTemplate]);
  

  const additionalInfo = "MenShirt";

  const { renderer, scene, camera, loading, updateShaderUniforms } = useThreeScene(
    refContainer,
    modelConfigs,
    globalProperties,
    additionalInfo
  );

  const handlePropertyChange = useCallback((newProperties) => {
    setGlobalProperties(newProperties);
    updateShaderUniforms(newProperties);
  }, [updateShaderUniforms]);

  const handleChangeModel = useCallback((value) => {
    setModelIndex(value);
    updateShaderUniforms(globalProperties);
  }, [globalProperties, updateShaderUniforms]);

  const { processImage } = useImageProcessing(renderer, scene, camera, item);

  useEffect(() => {
    if (currentStep === 3) {
      processImage();
    }
  }, [currentStep, processImage]);

  const downloadImage = useImageDownload(renderer, scene, camera, item);

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
    aspectRatio: "2 / 3",
    maxWidth: "100%",
    height: "auto",
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
              menShirtTemplate={menShirtTemplate}
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

export default MenShirtModalComponent;