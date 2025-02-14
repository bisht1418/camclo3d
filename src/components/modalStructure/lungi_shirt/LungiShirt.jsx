import React, { useRef, useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { useThreeScene } from "../useThreeScene";
import ModelStyleSelector from "../ModelStyleSelector";
import PropertySlider from "../PropertySlider";
import ResolutionSelector from "../ResolutionSelector";
import * as THREE from "three";

const LungiWithShirt = ({
  currentStep,
  item,
  modalWidth = "500px",
  modalHeight = "800px",
}) => {
  const refContainer = useRef(null);
  const [modelIndex, setModelIndex] = useState(0);
  const [selectedResolution, setSelectedResolution] = useState({
    width: null,
    height: null,
  });
  const [properties, setProperties] = useState({
    brightness: 0.59,
    contrast: 1,
    saturation: 1,
    exposure: 1,
    shine: 1,
  });

  const lungiWithShirtTexture = useMemo(
    () => ({
      lungi: item?.uploadOptions[1]?.image,
      shirt: item?.uploadOptions[0]?.image,
    }),
    [item]
  );

  const lungiWithShirt = item?.templates;
  let currentTextures =
    lungiWithShirtTexture || productData[1]?.textures[0].layerImage;

  const modelConfigs = useMemo(
    () => [
      {
        modelUrl: lungiWithShirt[modelIndex]?.lungi_glb,
        textureUrl: currentTextures?.lungi,
        position: {
          x: 0,
          y: -0.3,
          z: -2,
        },
        scale: {
          x: 0.3,
          y: 0.3,
          z: -1,
        },
        shadow: false,
      },
      {
        modelUrl: lungiWithShirt[modelIndex]?.lungi_shirt,
        textureUrl: currentTextures?.shirt,
        position: {
          x: 0,
          y: -0.3,
          z: -2,
        },
        scale: {
          x: 0.3,
          y: 0.3,
          z: -5,
        },
        shadow: false,
      },
      {
        modelUrl: lungiWithShirt[modelIndex]?.lungi_shirt,
        textureUrl: currentTextures?.shirt,
        position: {
          x: 0,
          y: -0.3,
          z: -2,
        },
        scale: {
          x: 0.3,
          y: 0.3,
          z: 0.5,
        },
        shadow: false,
      },
      {
        modelUrl: lungiWithShirt[modelIndex]?.lungi_body,
        textureUrl: lungiWithShirt[modelIndex]?.lungi_img,
        position: {
          x: 0,
          y: -0.3,
          z: -2,
        },
        scale: {
          x: 0.3,
          y: 0.3,
          z: 10,
        },
        shadow: true,
      },
      {
        modelUrl: "/Shirt_Template/DSC_0001/DSC_0001_BACKGROUND.glb",
        textureUrl: "shirt_textures/background.jpg",
        position: { x: 0, y: -1.6, z: modelIndex === 0 ? -21 : -21 },
        scale: { x: 1, y: 1, z: 1 },
        shadow: false,
      },
    ],
    [modelIndex, currentTextures]
  );

  const additionalInfo = "LungiWithShirt";
  const { renderer, scene, camera, loading, canvasSize, updateShaderUniforms } = useThreeScene(
    refContainer,
    modelConfigs,
    properties,
    additionalInfo
  );
  const handleChangeModel = useCallback((value) => {
    setModelIndex(value);
  }, []);

  const downloadImage = useCallback(() => {
    if (
      !selectedResolution.width ||
      !selectedResolution.height ||
      !renderer ||
      !scene ||
      !camera
    ) {
      toast.error(
        "Please ensure a resolution is selected and the 3D scene is loaded."
      );
      return;
    }

    const originalSize = renderer.getSize(new THREE.Vector2());
    const downloadWidth = Math.floor(selectedResolution.width);
    renderer.setSize(downloadWidth, selectedResolution.height);
    renderer.render(scene, camera);

    const originalBackgroundColor = scene.background
      ? scene.background.clone()
      : null;

    scene.background = new THREE.Color(0xffffff);

    renderer.render(scene, camera);

    renderer.domElement.toBlob((blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `model-image-${downloadWidth}x${selectedResolution.height}.png`;
      link.click();
      URL.revokeObjectURL(link.href);
    });

    scene.background = originalBackgroundColor;
    renderer.setSize(originalSize.width, originalSize.height);
    renderer.render(scene, camera);
  }, [renderer, scene, camera, selectedResolution]);

  return (
    <div className="bg-[#f3f2f7] relative w-full">
      <div className="flex flex-row gap-10 w-full justify-center items-start bg-white  relative ">
        <div
          ref={refContainer}
          style={{
            position: "relative",
            height: modalHeight,
            width: modalWidth,
            visibility: loading ? "hidden" : "visible",
          }}
        >
          {currentStep !== 3 && (
            <div className="text-xl font-bold absolute top-[-50px]  ">
              Visualizer Image
            </div>
          )}{" "}
          {currentStep !== 3 && (
            <img
              className="absolute top-0 left-0 h-[100%] w-[100%] opacity-30 "
              src="/watermark.png"
              alt="Watermark"
            />
          )}
        </div>
        {loading && (
          <div className="flex loader absolute top-[50%] left-[25%] text-primary font-bold text-xl   z-50">
            Loading
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}
        {currentStep !== 3 ? (
          <div className="w-[600px] max-h-[650px] flex-col justify-start items-start gap-9">
            {Object.entries(properties).map(([property, value]) => (
              <PropertySlider
                key={property}
                property={property}
                value={value}
                onChange={updateShaderUniforms}
                updateShaderUniforms={updateShaderUniforms}
              />
            ))}
          </div>
        ) : (
          <ResolutionSelector
            setSelectedResolution={setSelectedResolution}
            downloadImage={downloadImage}
          />
        )}
      </div>
    </div>
  );
};

export default LungiWithShirt;
