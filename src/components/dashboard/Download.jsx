import { useCallback } from 'react';
import { toast } from 'react-toastify';

export const useImageDownload = (renderer, scene, viewCamera, items) => {
  const downloadImage = useCallback((multiplier) => {
    if (!multiplier) {
      toast.error("Please select a resolution multiplier.");
      return;
    }

    if (!renderer || !scene || !viewCamera) {
      toast.error("Please ensure the 3D scene is properly loaded.");
      return;
    }

    // More Robust Base Dimension Handling
    const BASE_DIMENSIONS = {
      Bedsheet: { width: 1600, height: 1760 },
      Curtain: { width: 1600, height: 1760 },
      Default: { width: 1344, height: 2016 }
    };

    const { width: BASE_WIDTH, height: BASE_HEIGHT } =
      BASE_DIMENSIONS[items.name] || BASE_DIMENSIONS.Default;

    const renderWidth = BASE_WIDTH * multiplier;
    const renderHeight = BASE_HEIGHT * multiplier;

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

    try {
      // Store original renderer properties
      const originalSize = {
        width: renderer.domElement.width,
        height: renderer.domElement.height
      };
      const originalPixelRatio = renderer.getPixelRatio();

      // Create off-screen canvas
      const offScreenCanvas = document.createElement('canvas');
      const context = offScreenCanvas.getContext('2d');
      offScreenCanvas.width = renderWidth;
      offScreenCanvas.height = renderHeight;

      // Set the renderer size temporarily for off-screen rendering
      renderer.setSize(renderWidth, renderHeight, false);
      renderer.setPixelRatio(window.devicePixelRatio);

      // Render the scene to the off-screen canvas
      renderer.render(scene, glbCamera);

      // Draw the rendered image onto the off-screen canvas
      context.drawImage(renderer.domElement, 0, 0, renderWidth, renderHeight);

      // Check if watermark should be added
      const totalCredit = localStorage.getItem("totalCredit");
      const shouldShowWatermark = totalCredit <= 10;

      if (shouldShowWatermark) {
        // Create and load watermark image
        const watermark = new Image();
        watermark.src = "/watermark.png";

        // Wait for watermark to load before proceeding
        watermark.onload = () => {
          // Draw watermark scaled to match the canvas size
          context.drawImage(watermark, 0, 0, renderWidth, renderHeight);

          // Create download after watermark is added
          offScreenCanvas.toBlob((blob) => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `model-image-${multiplier}x.png`;
            link.click();
            URL.revokeObjectURL(link.href);
            toast.success(`Image downloaded at ${multiplier}x resolution.`);
          }, 'image/png');
        };

        watermark.onerror = () => {
          toast.error("Failed to load watermark. Please try again.");
        };
      } else {
        // Download without watermark
        offScreenCanvas.toBlob((blob) => {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `model-image-${multiplier}x.png`;
          link.click();
          URL.revokeObjectURL(link.href);
          toast.success(`Image downloaded at ${multiplier}x resolution.`);
        }, 'image/png');
      }

      // Restore renderer settings
      renderer.setPixelRatio(originalPixelRatio);
      renderer.setSize(originalSize.width, originalSize.height, false);
      renderer.render(scene, viewCamera);

    } catch (error) {
      console.error('Error during image download:', error);
      toast.error("Failed to download image. Please try again.");
    }
  }, [renderer, scene, viewCamera, items]);

  return downloadImage;
};