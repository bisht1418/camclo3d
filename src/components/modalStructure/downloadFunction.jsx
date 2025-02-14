import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { generatedImageService } from '../../services/visualizerService';
import * as THREE from "three";

export const useImageProcessing = (renderer, scene, viewCamera, item) => {
  const base64ToBlob = (base64String, contentType = 'image/png') => {
    const base64Data = base64String.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    const binaryString = atob(base64Data);
    const arrayBuffer = new ArrayBuffer(binaryString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    
    for (let i = 0; i < binaryString.length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }
    
    return new Blob([uint8Array], { type: contentType });
  };

  const uploadCroppedImage = async (blob, itemName) => {
    try {
      const formData = new FormData();
      formData.append("template_id", "6762c8444f1c6daaf40dac78");
      formData.append("template_model_id", "670500063c17cb22620964bb");
      formData.append("model_img_slug", itemName);
      formData.append("image", blob, "image.png");
    } catch (error) {
      console.error(`Error uploading image '${itemName}':`, error);
    }
  };

  const processImage = useCallback(() => {
    // Validate inputs
    if (!renderer || !scene || !viewCamera) {
      toast.error("Please ensure the 3D scene is properly loaded.");
      return;
    }
  
    // Find camera in the scene
    let glbCamera = null;
    scene.traverse((object) => {
      if (object.isCamera) {
        glbCamera = object;
      }
    });
  
    if (!glbCamera) {
      toast.error("No camera found in the GLB file.");
      return;
    }
  
    // Store current state
    const originalPixelRatio = renderer.getPixelRatio();
    const currentWidth = renderer.domElement.width;
    const currentHeight = renderer.domElement.height;
  
    // Predefined base dimensions
    const BASE_WIDTH = 1344;
    const BASE_HEIGHT = 2016;
  
    try {
      // Set up rendering
      const originalBackgroundColor = scene.background
        ? scene.background.clone()
        : null;
      scene.background = new THREE.Color(0xffffff);
  
      // Multiply pixel ratio for higher resolution
      const resolutionMultiplier = 2;
      renderer.setPixelRatio(originalPixelRatio * resolutionMultiplier);
  
      // Render with GLB camera
      renderer.render(scene, glbCamera);
  
      // Create canvas to capture image
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = BASE_WIDTH;
      canvas.height = BASE_HEIGHT;
      context.drawImage(renderer.domElement, 0, 0, BASE_WIDTH, BASE_HEIGHT);

      // Check if watermark should be added
      const totalCredit = localStorage.getItem("totalCredit");
      const shouldShowWatermark = totalCredit <= 10;

      if (shouldShowWatermark) {
        // Create and load watermark image
        const watermark = new Image();
        watermark.src = "/watermark.png";

        watermark.onload = () => {
          // Draw watermark scaled to match the canvas size
          context.drawImage(watermark, 0, 0, BASE_WIDTH, BASE_HEIGHT);
          
          // Process image with watermark
          canvas.toBlob((blob) => {
            if (blob) {
              processImageBlob(blob);
            }
          }, 'image/png');
        };

        watermark.onerror = () => {
          toast.error("Failed to load watermark. Processing without watermark.");
          canvas.toBlob((blob) => {
            if (blob) {
              processImageBlob(blob);
            }
          }, 'image/png');
        };
      } else {
        // Process without watermark
        canvas.toBlob((blob) => {
          if (blob) {
            processImageBlob(blob);
          }
        }, 'image/png');
      }

      const processImageBlob = (blob) => {
        const formData = new FormData();
        formData.append("template_model_id", "6762c8444f1c6daaf40dac78");
        formData.append("image", blob, "image.png");

        (async () => {
          try {
            const res = await generatedImageService(formData);

            if (!item?.uploadOptions?.length) return;

            const uploadPromises = item.uploadOptions.flatMap((ele) => {
              if (Array.isArray(ele.image)) {
                return ele.image.map((img, index) => {
                  const fabricImageBlob = base64ToBlob(img);
                  return uploadCroppedImage(fabricImageBlob, `${ele.name}_${index}`);
                });
              } else {
                const fabricImageBlob = base64ToBlob(ele.image);
                return uploadCroppedImage(fabricImageBlob, ele.name);
              }
            });

            // Uncomment if you want to wait for uploads
            // const uploadedFabrics = await Promise.all(uploadPromises);
          } catch (error) {
            console.error("Error during image upload:", error);
          }
        })();
      };
  
      // Restore background
      if (originalBackgroundColor) {
        scene.background = originalBackgroundColor;
      }
    } catch (error) {
      console.error('Error during image processing:', error);
      toast.error("Failed to process image. Please try again.");
    } finally {
      // Restore renderer pixel ratio and size
      renderer.setPixelRatio(originalPixelRatio);
      renderer.setSize(currentWidth, currentHeight, false);
      // Render one final frame with the view camera to restore the view
      renderer.render(scene, viewCamera);
    }
  }, [renderer, scene, viewCamera, item]);

  return { processImage };
};