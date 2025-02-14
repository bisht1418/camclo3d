import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import cv from "opencv.js";
import AdjustmentPopup from "./visualizer/AdjustmentPopup";
import { Toolbar, PreviewPanel, Header, MainCanvas, Footer } from './visualizer/CropToolUtility/Footer';

const CropTool = ({ image, onCrop, itemName, onClose, onCancel, editState, cropData }) => {
  // State declarations
  const [imageObj, setImageObj] = useState(null);
  const [rotation, setRotation] = useState(editState?.rotation || 0);
  const [flip, setFlip] = useState(editState?.flip || { horizontal: false, vertical: false });
  const [cropMode, setCropMode] = useState(true);
  const [cropPoints, setCropPoints] = useState(cropData || []);
  const [draggedPointIndex, setDraggedPointIndex] = useState(null);
  const [isDraggingAll, setIsDraggingAll] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(null);
  const [scale, setScale] = useState(1);
  const [repeatedPattern, setRepeatedPattern] = useState(null);
  const [overlayImg, setOverlayImg] = useState(null);
  const [showAdjustmentPopup, setShowAdjustmentPopup] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [sleeveOverlayImg, setSleeveOverlayImg] = useState(null);
  const [dimensions, setDimensions] = useState({ scaledWidth: 0, scaledHeight: 0 });
  const [rotatedDimensions, setRotatedDimensions] = useState({ width: 0, height: 0 });
  const [cameraZoom, setCameraZoom] = useState(1);
  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });
  const [isDraggingCamera, setIsDraggingCamera] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(false);



  // Ref declarations
  const canvasRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const containerRef = useRef(null);

  // Memoized values
  const aspectRatios = useMemo(() => ({
    "Add Towel": 1 / 9,
    "Add Blouse": 1,
    "Suit Front": 1,
    "Suit Back": 1,
    "Dupatta Pallu": 1,
    "Add Pallu": 1,
    "Saree Body": 1 / 3,
    "Dupatta Body": 1 / 3,
    'Shirt Fabric': 2 / 3,
    Default: 1,
  }), []);

  // Utility functions
  const calculateScale = useCallback((img, rotationAngle = rotation) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use higher precision calculations
    const angleInRadians = Math.abs((rotationAngle * Math.PI) / 180);
    const imgWidth = img.width;
    const imgHeight = img.height;

    // Use precise trigonometric calculations
    const rotatedWidth = Math.abs(imgWidth * Math.cos(angleInRadians)) + Math.abs(imgHeight * Math.sin(angleInRadians));
    const rotatedHeight = Math.abs(imgWidth * Math.sin(angleInRadians)) + Math.abs(imgHeight * Math.cos(angleInRadians));

    // Calculate scale factors with higher precision
    const scaleWidth = (canvas.width * 0.85) / rotatedWidth;
    const scaleHeight = (canvas.height * 0.85) / rotatedHeight;
    const newScale = Math.min(scaleWidth, scaleHeight);

    setScale(newScale);
    setDimensions({
      scaledWidth: Math.round(imgWidth * newScale * 100) / 100,
      scaledHeight: Math.round(imgHeight * newScale * 100) / 100,
      rotatedWidth: Math.round(rotatedWidth * newScale * 100) / 100,
      rotatedHeight: Math.round(rotatedHeight * newScale * 100) / 100
    });
  }, [rotation]);

  const getImageBounds = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !dimensions.rotatedWidth || !dimensions.rotatedHeight) {
      return {
        minX: 0,
        maxX: canvas.width,
        minY: 0,
        maxY: canvas.height
      };
    }

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const halfWidth = dimensions.rotatedWidth / 2;
    const halfHeight = dimensions.rotatedHeight / 2;

    return {
      minX: centerX - halfWidth,
      maxX: centerX + halfWidth,
      minY: centerY - halfHeight,
      maxY: centerY + halfHeight
    };
  }, [dimensions]);

  const getCanvasCoordinates = useCallback((clientX, clientY) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (clientX - rect.left) * (canvasRef.current.width / rect.width);
    const y = (clientY - rect.top) * (canvasRef.current.height / rect.height);

    // Remove camera transform from coordinates when in crop mode
    if (cropMode) {
      const centerX = canvasRef.current.width / 2;
      const centerY = canvasRef.current.height / 2;
      return {
        x: ((x - centerX) / cameraZoom) + centerX - cameraOffset.x,
        y: ((y - centerY) / cameraZoom) + centerY - cameraOffset.y
      };
    }

    return { x, y };
  }, [cropMode, cameraZoom, cameraOffset]);

  const isInsideCropArea = useCallback((x, y) => {
    const [topLeft, topRight, bottomRight, bottomLeft] = cropPoints;
    return (
      x > Math.min(topLeft.x, bottomLeft.x) &&
      x < Math.max(topRight.x, bottomRight.x) &&
      y > Math.min(topLeft.y, topRight.y) &&
      y < Math.max(bottomLeft.y, bottomRight.y)
    );
  }, [cropPoints]);

  const drawCropOutline = useCallback((ctx) => {
    ctx.strokeStyle = "rgba(140, 42, 141, 1)";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 3]);
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 4;

    ctx.beginPath();
    ctx.moveTo(cropPoints[0].x, cropPoints[0].y);
    cropPoints.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
    ctx.closePath();
    ctx.stroke();

    cropPoints.forEach((point, index) => {
      ctx.beginPath();
      ctx.setLineDash([]);
      ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(255, 255, 255, 1)";
      ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
      ctx.shadowBlur = 6;
      ctx.fill();

      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(140, 42, 141, 1)";
      ctx.stroke();

      ctx.fillStyle = "rgba(140, 42, 141, 1)";
      ctx.font = "12px Arial";
      ctx.fillText(["TL", "TR", "BR", "BL"][index], point.x + 10, point.y - 10);
    });

    ctx.shadowBlur = 0;
  }, [cropPoints]);

  const updatePreview = useCallback(() => {
    if (!previewCanvasRef.current || !canvasRef.current || cropPoints.length !== 4) return;

    const previewCanvas = previewCanvasRef.current;
    const previewCtx = previewCanvas.getContext("2d", { alpha: false });
    const mainCanvas = canvasRef.current;

    previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);

    if (cropMode) {
      // Create temporary canvas for the cropped area
      const cropTempCanvas = document.createElement("canvas");
      const cropTempCtx = cropTempCanvas.getContext("2d", { alpha: false });

      // Calculate bounds of crop area
      const xValues = cropPoints.map(p => p.x);
      const yValues = cropPoints.map(p => p.y);
      const [minX, maxX] = [Math.min(...xValues), Math.max(...xValues)];
      const [minY, maxY] = [Math.min(...yValues), Math.max(...yValues)];

      cropTempCanvas.width = maxX - minX;
      cropTempCanvas.height = maxY - minY;

      // Create clipping path for crop area
      cropTempCtx.beginPath();
      cropTempCtx.moveTo(cropPoints[0].x - minX, cropPoints[0].y - minY);
      cropPoints.slice(1).forEach(point => {
        cropTempCtx.lineTo(point.x - minX, point.y - minY);
      });
      cropTempCtx.closePath();
      cropTempCtx.clip();

      // Draw the image considering rotation and flip
      cropTempCtx.save();
      cropTempCtx.translate(-minX, -minY);

      // Apply rotation and flip transformations
      const centerX = mainCanvas.width / 2;
      const centerY = mainCanvas.height / 2;
      cropTempCtx.translate(centerX, centerY);
      cropTempCtx.rotate((rotation * Math.PI) / 180);
      cropTempCtx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);

      cropTempCtx.drawImage(
        imageObj,
        -dimensions.scaledWidth / 2,
        -dimensions.scaledHeight / 2,
        dimensions.scaledWidth,
        dimensions.scaledHeight
      );

      cropTempCtx.restore();

      // Scale cropped area to fit preview
      const scaleFactor = Math.min(
        previewCanvas.width / cropTempCanvas.width,
        previewCanvas.height / cropTempCanvas.height
      );
      const scaledWidth = cropTempCanvas.width * scaleFactor;
      const scaledHeight = cropTempCanvas.height * scaleFactor;
      const offsetX = (previewCanvas.width - scaledWidth) / 2;
      const offsetY = (previewCanvas.height - scaledHeight) / 2;

      previewCtx.drawImage(
        cropTempCanvas,
        offsetX,
        offsetY,
        scaledWidth,
        scaledHeight
      );
    } else {
      // Non-crop mode preview
      const scaleFactor = Math.min(
        previewCanvas.width / mainCanvas.width,
        previewCanvas.height / mainCanvas.height
      );
      const scaledWidth = mainCanvas.width * scaleFactor;
      const scaledHeight = mainCanvas.height * scaleFactor;
      const offsetX = (previewCanvas.width - scaledWidth) / 2;
      const offsetY = (previewCanvas.height - scaledHeight) / 2;

      previewCtx.drawImage(
        mainCanvas,
        offsetX,
        offsetY,
        scaledWidth,
        scaledHeight
      );
    }
  }, [cropMode, cropPoints, imageObj, dimensions, rotation, flip]);

  const drawnImage = useCallback((includeCropOutline = true) => {
    if (!imageObj || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false });

    // Clear the canvas
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();

    // Apply camera transform
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(cameraZoom, cameraZoom);
    ctx.translate(-canvas.width / 2 + cameraOffset.x, -canvas.height / 2 + cameraOffset.y);

    // Calculate the center of the canvas
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Move to the center of the canvas
    ctx.translate(centerX, centerY);

    // Apply rotation
    ctx.rotate((rotation * Math.PI) / 180);

    // Apply flip
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);

    // Draw the image centered with calculated dimensions
    ctx.drawImage(
      imageObj,
      -dimensions.scaledWidth / 2,
      -dimensions.scaledHeight / 2,
      dimensions.scaledWidth,
      dimensions.scaledHeight
    );

    ctx.restore();

    // Draw crop outline if in crop mode
    if (cropMode && cropPoints.length === 4 && includeCropOutline) {
      ctx.save();
      // Apply camera transform for crop outline
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(cameraZoom, cameraZoom);
      ctx.translate(-canvas.width / 2 + cameraOffset.x, -canvas.height / 2 + cameraOffset.y);
      drawCropOutline(ctx);
      ctx.restore();
    }

    updatePreview();
  }, [imageObj, scale, rotation, flip, cropMode, cropPoints, drawCropOutline, updatePreview, dimensions, cameraZoom, cameraOffset]);




  // Event handlers
  const handleResize = useCallback(() => {
    if (containerRef.current && canvasRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      const sidebarWidth = 50;
      const headerHeight = 64;
      const footerHeight = 72;
      const padding = 32;

      const availableWidth = (width - sidebarWidth - padding * 2);
      const availableHeight = (height - headerHeight - footerHeight - padding * 2);

      let newWidth = availableWidth;
      let newHeight = availableHeight;

      // Maintain minimum dimensions
      const minDimension = 500;
      if (newWidth < minDimension) newWidth = minDimension;
      if (newHeight < minDimension) newHeight = minDimension;

      // Update canvas size
      canvasRef.current.width = newWidth;
      canvasRef.current.height = newHeight;
      setCanvasSize({ width: newWidth, height: newHeight });

      // Recalculate scale if image is loaded
      if (imageObj) {
        calculateScale(imageObj);
      }
    }
  }, [imageObj, calculateScale]);

  const palluTop = JSON.parse(sessionStorage.getItem("palluTop"));
  const sariBottom = JSON.parse(sessionStorage.getItem("sariBottom"));

  const handleWheel = useCallback((e) => {
    e.preventDefault();

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomSensitivity = 0.001;
    const zoomDelta = -e.deltaY * zoomSensitivity;

    setCameraZoom(prevZoom => {
      const newZoom = Math.max(0.1, Math.min(10, prevZoom * (1 + zoomDelta)));

      // Adjust offset to zoom towards mouse position
      if (newZoom !== prevZoom) {
        const zoomPoint = {
          x: (mouseX - rect.width / 2) / prevZoom,
          y: (mouseY - rect.height / 2) / prevZoom
        };

        setCameraOffset(prev => ({
          x: prev.x - (zoomPoint.x * (newZoom - prevZoom)),
          y: prev.y - (zoomPoint.y * (newZoom - prevZoom))
        }));
      }

      return newZoom;
    });
  }, []);

  // Reset camera position when zoom returns to 1


  const handleStartCrop = useCallback(() => {
    setCropMode(true);
    setActive(1);

    const canvas = canvasRef.current;
    if (!canvas || !imageObj) return;

    // Fetch points from session storage


    // If "sari" is being cropped and "palluTop" exists, set the bottom points based on "palluTop"
    if ((itemName === "Saree Body" || itemName === "Dupatta Body") && palluTop) {
      const bounds = getImageBounds();
      const cropSize = Math.min(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY) * 0.1;
      const topLeftX = (palluTop[0].x + palluTop[1].x) / 2 - cropSize / 2;
      const topLeftY = (palluTop[0].y + palluTop[1].y) / 2 - cropSize;

      setCropPoints([
        { x: topLeftX, y: topLeftY },               // Top-left of "sari"
        { x: topLeftX + cropSize, y: topLeftY },    // Top-right of "sari"
        { x: palluTop[1].x, y: palluTop[1].y },     // Bottom-right fixed from "palluTop"
        { x: palluTop[0].x, y: palluTop[0].y }      // Bottom-left fixed from "palluTop"
      ]);
      return;
    }

    // If "pallu" is being cropped and "sariBottom" exists, set the top points based on "sariBottom"
    if ((itemName === "Add Pallu" || itemName === "Dupatta Pallu") && sariBottom) {
      const bounds = getImageBounds();
      const cropSize = Math.min(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY) * 0.1;
      const bottomLeftX = (sariBottom[0].x + sariBottom[1].x) / 2 - cropSize / 2;
      const bottomLeftY = (sariBottom[0].y + sariBottom[1].y) / 2 + cropSize;

      setCropPoints([
        { x: sariBottom[1].x, y: sariBottom[0].y },                  // Top-left fixed from "sariBottom"
        { x: sariBottom[0].x, y: sariBottom[1].y },                  // Top-right fixed from "sariBottom"
        { x: bottomLeftX + cropSize, y: bottomLeftY },               // Bottom-right of "pallu"
        { x: bottomLeftX, y: bottomLeftY }                           // Bottom-left of "pallu"
      ]);
      return;
    }

    // Default flexible crop points if no linked points are found in session storage
    const bounds = getImageBounds();
    const cropSize = Math.min(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY) * 0.8;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    if (cropData && cropData.length === 4) {
      setCropPoints(cropData);
    } else {
      setCropPoints([
        { x: centerX - cropSize / 2, y: centerY - cropSize / 2 },
        { x: centerX + cropSize / 2, y: centerY - cropSize / 2 },
        { x: centerX + cropSize / 2, y: centerY + cropSize / 2 },
        { x: centerX - cropSize / 2, y: centerY + cropSize / 2 }
      ]);
    }
  }, [imageObj, cropData, itemName, getImageBounds]);

  const handleRotate = useCallback(() => {
    const newRotation = (rotation + 90) % 360;
    setRotation(newRotation);

    // Recalculate scale with new rotation
    if (imageObj) {
      calculateScale(imageObj, newRotation);
    }

    setActive(2);
  }, [rotation, calculateScale, imageObj]);

  const handleFlip = useCallback((direction) => {
    setFlip((prevFlip) => ({
      ...prevFlip,
      [direction]: !prevFlip[direction],
    }));
    setActive(direction === "horizontal" ? 4 : 3);
  }, []);

  const handlePointerUp = useCallback(() => {
    setDraggedPointIndex(null);
    setIsDraggingAll(false);
  }, []);

  const handlePointerDown = useCallback((e) => {
    if (!cropMode) return;
    const { x, y } = getCanvasCoordinates(e.clientX, e.clientY);

    const pointIndex = cropPoints.findIndex(
      (p) => Math.hypot(p.x - x, p.y - y) < 10
    );

    if (pointIndex !== -1) {
      setDraggedPointIndex(pointIndex);
    } else if (isInsideCropArea(x, y)) {
      setIsDraggingAll(true);
      setDragStart({ x, y });
    }
  }, [cropMode, cropPoints, getCanvasCoordinates, isInsideCropArea]);

  const handlePointerMove = useCallback((e) => {
    if (!cropMode || (!isDraggingAll && draggedPointIndex === null)) return;

    const { x, y } = getCanvasCoordinates(e.clientX, e.clientY);
    const bounds = getImageBounds();

    if (draggedPointIndex !== null) {
      setCropPoints((currentPoints) =>
        currentPoints.map((p, i) => {
          if ((itemName === "Saree Body" || itemName === "Dupatta Body") && palluTop && (i === 2 || i === 3)) {
            return p;
          }
          if ((itemName === "Add Pallu" || itemName === "Dupatta Pallu") && sariBottom && (i === 0 || i === 1)) {
            return p;
          }

          if (i === draggedPointIndex) {
            let newX = Math.max(bounds.minX, Math.min(x, bounds.maxX));
            let newY = Math.max(bounds.minY, Math.min(y, bounds.maxY));

            // Maintain minimum distance between points
            const minDistance = 10;
            switch (i) {
              case 0: // Top-left
                newX = Math.min(newX, currentPoints[1].x - minDistance);
                newY = Math.min(newY, currentPoints[3].y - minDistance);
                break;
              case 1: // Top-right
                newX = Math.max(newX, currentPoints[0].x + minDistance);
                newY = Math.min(newY, currentPoints[2].y - minDistance);
                break;
              case 2: // Bottom-right
                newX = Math.max(newX, currentPoints[3].x + minDistance);
                newY = Math.max(newY, currentPoints[1].y + minDistance);
                break;
              case 3: // Bottom-left
                newX = Math.min(newX, currentPoints[2].x - minDistance);
                newY = Math.max(newY, currentPoints[0].y + minDistance);
                break;
            }
            return { x: newX, y: newY };
          }
          return p;
        })
      );
    } else if (isDraggingAll) {
      setCropPoints((currentPoints) => {
        const dx = x - dragStart.x;
        const dy = y - dragStart.y;

        // Check if any point would go out of bounds after moving
        const wouldBeOutOfBounds = currentPoints.some(p => {
          const newX = p.x + dx;
          const newY = p.y + dy;
          return newX < bounds.minX || newX > bounds.maxX ||
            newY < bounds.minY || newY > bounds.maxY;
        });

        if (wouldBeOutOfBounds) return currentPoints;

        return currentPoints.map((p, i) => {
          if ((itemName === "Saree Body" || itemName === "Dupatta Body") && palluTop && (i === 2 || i === 3)) {
            return p;
          }
          if ((itemName === "Add Pallu" || itemName === "Dupatta Pallu") && sariBottom && (i === 0 || i === 1)) {
            return p;
          }
          return { x: p.x + dx, y: p.y + dy };
        });
      });
      setDragStart({ x, y });
    }

    drawnImage();
  }, [cropMode, draggedPointIndex, isDraggingAll, dragStart, getCanvasCoordinates, drawnImage, getImageBounds, itemName, palluTop, sariBottom]);


  const applyPerspectiveTransform = useCallback((canvas, cropPoints, width, height) => {
    if (cropPoints.length !== 4) return;

    const srcPoints = cv.matFromArray(4, 1, cv.CV_32FC2, [
      cropPoints[0].x, cropPoints[0].y,
      cropPoints[1].x, cropPoints[1].y,
      cropPoints[2].x, cropPoints[2].y,
      cropPoints[3].x, cropPoints[3].y,
    ]);

    const dstPoints = cv.matFromArray(4, 1, cv.CV_32FC2, [
      0, 0,
      width, 0,
      width, height,
      0, height,
    ]);

    const src = cv.imread(canvas);
    const dst = new cv.Mat();
    const transformMatrix = cv.getPerspectiveTransform(srcPoints, dstPoints);

    try {
      cv.warpPerspective(src, dst, transformMatrix, new cv.Size(width, height), cv.INTER_CUBIC);

      // Create a new canvas for the output
      const outputCanvas = document.createElement("canvas");
      outputCanvas.width = width;
      outputCanvas.height = height;
      cv.imshow(outputCanvas, dst);

      return outputCanvas; // Return the transformed canvas

    } catch (error) {
      console.error("Transformation failed:", error);
    } finally {
      src.delete();
      dst.delete();
      srcPoints.delete();
      dstPoints.delete();
      transformMatrix.delete();
    }
  }, []);
  const handleApplyCrop = useCallback(() => {
    if (!cropMode || !canvasRef.current || !imageObj) return;
    setCropMode(false);
    setLoading(true);

    // Break down processing into smaller chunks while maintaining quality
    const processInChunks = async (processingFn) => {
      return new Promise((resolve) => {
        // Use requestAnimationFrame for better performance without quality loss
        requestAnimationFrame(() => {
          const result = processingFn();
          resolve(result);
        });
      });
    };

    // Main processing wrapped in async function
    const processImage = async () => {
      const PADDING = 2;
      const angleRad = (rotation * Math.PI) / 180;
      const cosAngle = Math.cos(angleRad);
      const sinAngle = Math.sin(angleRad);

      // Calculate dimensions once
      const rotatedWidth = Math.abs(imageObj.width * cosAngle) + Math.abs(imageObj.height * sinAngle);
      const rotatedHeight = Math.abs(imageObj.width * sinAngle) + Math.abs(imageObj.height * cosAngle);

      // Create temporary canvas at full resolution
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = rotatedWidth + (PADDING * 2);
      tempCanvas.height = rotatedHeight + (PADDING * 2);

      const tempCtx = tempCanvas.getContext('2d', {
        alpha: false,
        willReadFrequently: true
      });

      // Full quality transform and draw
      await processInChunks(() => {
        tempCtx.imageSmoothingEnabled = true;
        tempCtx.imageSmoothingQuality = 'high';
        tempCtx.save();
        tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
        tempCtx.rotate(angleRad);
        tempCtx.translate(-imageObj.width / 2 - PADDING, -imageObj.height / 2 - PADDING);
        tempCtx.drawImage(imageObj, PADDING, PADDING);
        tempCtx.restore();
        return true;
      });

      // High quality edge mirroring
      await processInChunks(() => {
        tempCtx.drawImage(tempCanvas, PADDING, PADDING, 1, tempCanvas.height - (PADDING * 2),
          PADDING - 1, PADDING, 1, tempCanvas.height - (PADDING * 2));
        tempCtx.drawImage(tempCanvas, tempCanvas.width - PADDING - 1, PADDING, 1, tempCanvas.height - (PADDING * 2),
          tempCanvas.width - PADDING, PADDING, 1, tempCanvas.height - (PADDING * 2));
        tempCtx.drawImage(tempCanvas, PADDING, PADDING, tempCanvas.width - (PADDING * 2), 1,
          PADDING, PADDING - 1, tempCanvas.width - (PADDING * 2), 1);
        tempCtx.drawImage(tempCanvas, PADDING, tempCanvas.height - PADDING - 1, tempCanvas.width - (PADDING * 2), 1,
          PADDING, tempCanvas.height - PADDING, tempCanvas.width - (PADDING * 2), 1);
        return true;
      });

      // Calculate crop dimensions
      const scaleX = rotatedWidth / dimensions.rotatedWidth;
      const scaleY = rotatedHeight / dimensions.rotatedHeight;
      const centerX = canvasRef.current.width / 2;
      const centerY = canvasRef.current.height / 2;

      const adjustedCropPoints = cropPoints.map(point => ({
        x: ((point.x - centerX) * scaleX) + (tempCanvas.width / 2) + PADDING,
        y: ((point.y - centerY) * scaleY) + (tempCanvas.height / 2) + PADDING
      }));

      const [minX, maxX] = [Math.min(...adjustedCropPoints.map(p => p.x)), Math.max(...adjustedCropPoints.map(p => p.x))];
      const [minY, maxY] = [Math.min(...adjustedCropPoints.map(p => p.y)), Math.max(...adjustedCropPoints.map(p => p.y))];

      // Create crop canvas at full resolution
      const OVERLAP = 1;
      const width = Math.ceil(maxX - minX) + OVERLAP;
      const height = Math.ceil(maxY - minY) + OVERLAP;

      const cropCanvas = document.createElement('canvas');
      cropCanvas.width = width;
      cropCanvas.height = height;
      const cropCtx = cropCanvas.getContext('2d', {
        alpha: false,
        willReadFrequently: true
      });
      cropCtx.imageSmoothingEnabled = true;
      cropCtx.imageSmoothingQuality = 'high';

      // High quality crop
      await processInChunks(() => {
        cropCtx.drawImage(tempCanvas, -minX + OVERLAP / 2, -minY + OVERLAP / 2);
        return true;
      });

      // Apply perspective transform at full quality
      const transformedCanvas = await processInChunks(() =>
        applyPerspectiveTransform(
          cropCanvas,
          adjustedCropPoints.map(p => ({
            x: p.x - minX + OVERLAP / 2,
            y: p.y - minY + OVERLAP / 2
          })),
          width,
          height
        )
      );

      // Create final canvas
      const finalCanvas = document.createElement('canvas');
      const finalCtx = finalCanvas.getContext('2d', {
        alpha: false,
        willReadFrequently: true
      });
      finalCtx.imageSmoothingEnabled = true;
      finalCtx.imageSmoothingQuality = 'high';

      // Process based on item type with full quality
      const aspectRatio = aspectRatios[itemName] || aspectRatios.Default;
      const newEditState = { rotation, flip, cropPoints, itemName };

      const matchesExpectedRatio = (w, h, expectedRatio) =>
        Math.abs((w / h) - expectedRatio) <= 0.05;

      let result;
      switch (itemName) {
        case "Bottom":
          result = await processInChunks(() =>
            handleKurtiBottom(transformedCanvas, width, height, finalCanvas, finalCtx, newEditState));
          break;
        case "Add Dhoti":
        case "Add Lungi":
          result = await processInChunks(() =>
            handleDhotiLungi(transformedCanvas, width, height, finalCanvas, finalCtx, newEditState));
          break;
        case "Add Towel":
          // case "Bottom":
          result = await processInChunks(() =>
            handleTowel(transformedCanvas, width, finalCanvas, finalCtx, aspectRatio, newEditState));
          break;
        case "Shirt Fabric":
        case "Add Curtain":
          result = await processInChunks(() =>
            (itemName === "Add Curtain" && matchesExpectedRatio(width, height, aspectRatio))
              ? handleGeneralItems(transformedCanvas, width, height, finalCanvas, finalCtx, aspectRatio, itemName, newEditState)
              : handleShirtFabricCurtain(transformedCanvas, width, finalCanvas, finalCtx, itemName, newEditState));
          break;
        default:
          if (["Add Blouse", "Dupatta Pallu", "Dupatta Body", "Saree Body", "Add Pallu", "Suit Front", "Add Bedsheet", "Add Pillow", "Suit Sleeves", "Add Curtain", "Suit Back"].includes(itemName)) {
            result = await processInChunks(() =>
              handleGeneralItems(transformedCanvas, width, height, finalCanvas, finalCtx, aspectRatio, itemName, newEditState));
          } else if (itemName === "Saree Body" || itemName === "Dupatta Body") {
            result = await processInChunks(() =>
              handleSareeDupattaBody(transformedCanvas, width, height, finalCanvas, finalCtx, aspectRatio, newEditState));
          } else {
            result = await processInChunks(() =>
              handleDefaultCase(transformedCanvas, width, finalCanvas, finalCtx, aspectRatio, newEditState));
          }
      }

      return result;
    };

    // Execute the processing
    processImage()
      .then(result => {
        if (result && onCrop) {
          onCrop(result);
        }
      })
      .catch(error => {
        console.error('Error processing image:', error);
      })
      .finally(() => {
        setLoading(false);
      });

  }, [cropMode, cropPoints, imageObj, itemName, onCrop, aspectRatios, rotation, flip, dimensions]);
  // Helper function for Dhoti/Lungi processing
  const handleDhotiLungi = (transformedCanvas, width, height, finalCanvas, finalCtx, newEditState) => {
    const targetWidth = 1700;
    const targetHeight = 1889;

    let currentCanvas = transformedCanvas;
    let currentWidth = width;
    let currentHeight = height;

    while (currentWidth < targetWidth || currentHeight < targetHeight) {
      const extendedCanvas = document.createElement("canvas");
      const extendedCtx = extendedCanvas.getContext("2d", { alpha: false });

      const extraWidth = Math.round(currentWidth * 0.2);
      const extraHeight = Math.round(currentHeight * 0.2);

      const extendedWidth = currentWidth + extraWidth;
      const extendedHeight = currentHeight + extraHeight;

      extendedCanvas.width = extendedWidth;
      extendedCanvas.height = extendedHeight;

      extendedCtx.imageSmoothingEnabled = true;
      extendedCtx.imageSmoothingQuality = "high";

      // Draw original and extended sections
      extendedCtx.drawImage(currentCanvas, 0, 0, currentWidth, currentHeight, 0, extraHeight, currentWidth, currentHeight);

      const rightSection = Math.round(currentWidth * 0.2);
      extendedCtx.drawImage(currentCanvas, currentWidth - rightSection, 0, rightSection, currentHeight,
        currentWidth, extraHeight, rightSection, currentHeight);

      const topSection = Math.round(currentHeight * 0.2);
      extendedCtx.drawImage(currentCanvas, 0, 0, currentWidth, topSection, 0, 0, currentWidth, extraHeight);

      extendedCtx.drawImage(currentCanvas, currentWidth - rightSection, 0, rightSection, topSection,
        currentWidth, 0, rightSection, extraHeight);

      currentCanvas = extendedCanvas;
      currentWidth = extendedWidth;
      currentHeight = extendedHeight;
    }

    finalCanvas.width = targetWidth;
    finalCanvas.height = targetHeight;

    finalCtx.imageSmoothingEnabled = true;
    finalCtx.imageSmoothingQuality = "high";
    finalCtx.drawImage(currentCanvas, 0, 0, targetWidth, targetHeight);

    onCrop(finalCanvas.toDataURL("image/png"), newEditState, cropPoints);
    setLoading(false);
  };


  const handleKurtiBottom = (


    transformedCanvas,
    width,
    height,
    finalCanvas,
    finalCtx,
    newEditState
  ) => {
    const fixedHeight = 1700; // Fixed height for the canvas
    const aspectRatio = 1 / 2; // Maintain 1:2 ratio

    // Calculate canvas width based on the fixed height and aspect ratio
    const canvasWidth = Math.round(fixedHeight * aspectRatio);
    finalCanvas.width = canvasWidth;
    finalCanvas.height = fixedHeight;

    // Calculate the scale factor to maintain aspect ratio
    const imageAspectRatio = width / height;
    let targetWidth, targetHeight;

    if (imageAspectRatio > aspectRatio) {
      // Image is wider than the canvas aspect ratio
      targetHeight = fixedHeight;
      targetWidth = targetHeight * imageAspectRatio;
    } else {
      // Image is taller than the canvas aspect ratio
      targetWidth = canvasWidth;
      targetHeight = targetWidth / imageAspectRatio;
    }

    // Repeat the image vertically and horizontally if dimensions are smaller than the canvas
    let y = 0;
    while (y < finalCanvas.height) {
      let x = 0;
      while (x < finalCanvas.width) {
        finalCtx.drawImage(
          transformedCanvas,
          0, // Source X
          0, // Source Y
          width, // Source Width
          height, // Source Height
          x, // Destination X
          y, // Destination Y
          targetWidth, // Destination Width (scaled to fit canvas width)
          targetHeight // Destination Height (scaled to maintain aspect ratio)
        );
        x += targetWidth; // Move to the next horizontal position
      }
      y += targetHeight; // Move to the next vertical position
    }

    // Crop the final canvas to ensure it matches the exact target dimensions
    const croppedImageData = finalCtx.getImageData(0, 0, canvasWidth, fixedHeight);
    finalCanvas.width = canvasWidth;
    finalCanvas.height = fixedHeight;
    finalCtx.putImageData(croppedImageData, 0, 0);

    const croppedDataURL = finalCanvas.toDataURL("image/png");
    onCrop(croppedDataURL, newEditState, cropPoints);
    setLoading(false);
  };



  // Helper function for Towel processing
  const handleTowel = (transformedCanvas, width, finalCanvas, finalCtx, aspectRatio, newEditState) => {
    finalCanvas.width = width;
    finalCanvas.height = Math.round(finalCanvas.width / aspectRatio);

    const topImageHeight = Math.round(transformedCanvas.height * 0.2);
    const topImageCanvas = document.createElement('canvas');
    topImageCanvas.width = transformedCanvas.width;
    topImageCanvas.height = topImageHeight;

    const topImageCtx = topImageCanvas.getContext('2d');
    topImageCtx.drawImage(transformedCanvas, 0, 0, transformedCanvas.width, topImageHeight, 0, 0, transformedCanvas.width, topImageHeight);

    finalCtx.drawImage(topImageCanvas, 0, 0, finalCanvas.width, topImageHeight);
    finalCtx.drawImage(transformedCanvas, 0, topImageHeight, finalCanvas.width, finalCanvas.height - topImageHeight);

    onCrop(finalCanvas.toDataURL("image/png"), newEditState, cropPoints);
    setLoading(false);
  };

  // Helper function for Shirt Fabric and Curtain processing
  const handleShirtFabricCurtain = (transformedCanvas, width, finalCanvas, finalCtx, itemName, newEditState) => {
    const targetWidth = width > 800 ? width : 800;
    const targetHeight = Math.round(targetWidth * (3 / 2));

    finalCanvas.width = targetWidth;
    finalCanvas.height = targetHeight;

    const pattern = finalCtx.createPattern(transformedCanvas, "repeat");
    finalCtx.fillStyle = pattern;
    finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

    if (itemName === "Shirt Fabric") {
      setRepeatedPattern(finalCanvas.toDataURL("image/png"));
      setTimeout(() => {
        setShowAdjustmentPopup(true);
        setLoading(false);
      }, 1000);
    } else {
      onCrop(finalCanvas.toDataURL("image/png"), newEditState, cropPoints);
      setLoading(false);
    }
  };

  // Helper function for general items processing
  const handleGeneralItems = (transformedCanvas, width, height, finalCanvas, finalCtx, aspectRatio, itemName, newEditState) => {
    finalCanvas.width = itemName === "Add Blouse" || itemName === "Suit Front" || itemName === "Suit Back" ? width : width;
    finalCanvas.height = itemName === "Add Blouse" || itemName === "Suit Front" || itemName === "Suit Back"
      ? Math.round(finalCanvas.width / aspectRatio)
      : height;

    const pattern = finalCtx.createPattern(
      transformedCanvas,
      itemName === "Add Blouse" || itemName === "Suit Front" || itemName === "Suit Back" ? "repeat" : "no-repeat"
    );
    finalCtx.fillStyle = pattern;
    finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

    if (itemName === "Add Blouse" || itemName === "Suit Front" || itemName === "Suit Back") {
      const repeatedCanvas = document.createElement("canvas");
      repeatedCanvas.width = 600;
      repeatedCanvas.height = 600;
      const repeatedCtx = repeatedCanvas.getContext("2d", { alpha: false });
      const pattern = repeatedCtx.createPattern(transformedCanvas, "repeat");
      repeatedCtx.fillStyle = pattern;
      repeatedCtx.fillRect(0, 0, repeatedCanvas.width, repeatedCanvas.height);
      setRepeatedPattern(transformedCanvas.toDataURL("image/png"));
      setTimeout(() => {
        setShowAdjustmentPopup(true);
        setLoading(false);
      }, 1000);
    } else {
      onCrop(finalCanvas.toDataURL("image/png"), newEditState, cropPoints);
      setLoading(false);
    }
  };

  // Helper function for Saree Body and Dupatta Body processing
  const handleSareeDupattaBody = (transformedCanvas, width, height, finalCanvas, finalCtx, aspectRatio, newEditState) => {
    finalCanvas.width = width;
    finalCanvas.height = Math.round(finalCanvas.width / aspectRatio);

    const overlapPercentage = 0;
    const overlapAmount = height * overlapPercentage;

    let y = 0;
    while (y < finalCanvas.height) {
      finalCtx.drawImage(
        transformedCanvas,
        0, 0, width, height,
        0, y, width, height
      );
      y += height - overlapAmount;
    }

    onCrop(finalCanvas.toDataURL("image/png"), newEditState, cropPoints);
    setLoading(false);
  };

  // Helper function for default case processing
  const handleDefaultCase = (transformedCanvas, width, finalCanvas, finalCtx, aspectRatio, newEditState) => {
    finalCanvas.width = width > 800 ? width : 800;
    finalCanvas.height = Math.round(finalCanvas.width / aspectRatio);

    const pattern = finalCtx.createPattern(transformedCanvas, "repeat");
    finalCtx.fillStyle = pattern;
    finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

    onCrop(finalCanvas.toDataURL("image/png"), newEditState, cropPoints);
    setLoading(false);
  };

  const handleMouseDown = useCallback((e) => {
    if (e.button === 2) { // Right-click
      setIsDraggingCamera(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
      e.preventDefault(); // Prevent default browser actions
      document.body.style.cursor = 'grabbing';
    }
  }, []);
  const handleContextMenu = useCallback((e) => {
    e.preventDefault(); // Disable the right-click menu
  }, []);


  const handleMouseMove = useCallback((e) => {
    if (isDraggingCamera) {
      // Scale factor to slow down movement
      const movementScale = 0.3; // Adjust this value as needed (e.g., 0.1 for slower movement, 1 for normal)

      const dx = ((e.clientX - lastMousePos.x) / cameraZoom) * movementScale;
      const dy = ((e.clientY - lastMousePos.y) / cameraZoom) * movementScale;

      setCameraOffset((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));

      setLastMousePos({ x: e.clientX, y: e.clientY });

      // Redraw the entire canvas with the new offset
      drawnImage();
    }
  }, [isDraggingCamera, lastMousePos, cameraZoom, drawnImage, drawCropOutline]);


  const handleMouseUp = useCallback(() => {
    if (isDraggingCamera) {
      setIsDraggingCamera(false);
      document.body.style.cursor = 'default';
    }
  }, [isDraggingCamera]);


  useEffect(() => {
    if (cameraZoom === 1) {
      setCameraOffset({ x: 0, y: 0 });
    }
  }, [cameraZoom]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !cropMode) {
        document.body.style.cursor = 'grab';
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        document.body.style.cursor = 'default';
        setIsDraggingCamera(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [cropMode]);

  // Reset camera position when exiting crop mode
  useEffect(() => {
    if (!cropMode) {
      setCameraZoom(1);
      setCameraOffset({ x: 0, y: 0 });
    }
  }, [cropMode]);

  // Update useEffect for mouse events
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
    };
  }, [handleWheel, handleMouseDown, handleMouseMove, handleMouseUp]);


  // Effects
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setImageObj(img);
      calculateScale(img);
    };
    img.src = image;

    if (itemName === "Add Blouse" || itemName === "Suit Front" || itemName === "Suit Back" || itemName === "Shirt Fabric") {
      const overlayImg = new Image();
      overlayImg.crossOrigin = "anonymous";
      overlayImg.onload = () => setOverlayImg(overlayImg);
      overlayImg.src = itemName === "Add Blouse" ? "/Blouse-Mask.png" : itemName === "Suit Front" || itemName === 'Suit Back' ? "/Kurti_Mask.png" : "/Shirt_mask.png";

      const sleeveOverlayImg = new Image();
      sleeveOverlayImg.crossOrigin = "anonymous";
      sleeveOverlayImg.onload = () => setSleeveOverlayImg(sleeveOverlayImg);
      sleeveOverlayImg.src = "/sleeves_saree.png";
    }
  }, [image, itemName, calculateScale]);


  const handleAdjustmentComplete = useCallback(({ main, sleeve }) => {
    setShowAdjustmentPopup(false);
    const newEditState = {
      rotation,
      flip,
    };
    onCrop({ main, sleeve }, newEditState, cropPoints);
    setLoading(false);
  }, [onCrop, rotation, flip, cropPoints]);

  const handleReset = useCallback(() => {
    setRotation(0);
    setFlip({ horizontal: false, vertical: false });
    setCameraZoom(1)
  }, [handleStartCrop]);

  // Effects
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useEffect(() => {
    const { scaledWidth, scaledHeight } = dimensions;
    if (rotation % 180 === 0) {
      setRotatedDimensions({ width: scaledWidth, height: scaledHeight });
    } else {
      setRotatedDimensions({ width: scaledHeight, height: scaledWidth });
    }
    handleStartCrop();
  }, [rotation, dimensions, handleStartCrop]);

  useEffect(() => {
    if (imageObj) {
      drawnImage();
    }
  }, [imageObj, drawnImage]);
  useEffect(() => {
    if (imageObj) {
      calculateScale(imageObj, rotation);

      // Update rotated dimensions after scale calculation
      const angleInRadians = Math.abs((rotation * Math.PI) / 180);
      const scaledWidth = imageObj.width * scale;
      const scaledHeight = imageObj.height * scale;

      const rotatedWidth = Math.abs(scaledWidth * Math.cos(angleInRadians)) +
        Math.abs(scaledHeight * Math.sin(angleInRadians));
      const rotatedHeight = Math.abs(scaledWidth * Math.sin(angleInRadians)) +
        Math.abs(scaledHeight * Math.cos(angleInRadians));

      setRotatedDimensions({ width: rotatedWidth, height: rotatedHeight });
    }
  }, [rotation, imageObj, scale, calculateScale]);
  // Render
  return (
    <div className="fixed inset-0 bg-opacity-80 flex items-center justify-center z-50" ref={containerRef}>
      <div className="bg-white w-full h-full flex flex-col">
        <Header
          itemName={itemName}
          onClose={onClose}
          onCancel={onCancel}
        />

        <div className="flex-grow overflow-hidden p-4 flex justify-center">
          <MainCanvas
            canvasRef={canvasRef}
            canvasSize={canvasSize}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onWheel={handleWheel}
            onContextMenu={handleContextMenu}
          />

          <PreviewPanel
            previewCanvasRef={previewCanvasRef}
            itemName={itemName}
            showOrientation={["Add Blouse", "Add Pallu", "Saree Body", "Suit Front", "Dupatta Body", "Dupatta Pallu"].includes(itemName)}
          />
        </div>

        <Footer onApplyCrop={handleApplyCrop} loading={loading}>
          <Toolbar
            active={active}
            onStartCrop={handleStartCrop}
            onRotate={handleRotate}
            onFlipVertical={() => handleFlip("vertical")}
            onFlipHorizontal={() => handleFlip("horizontal")}
            onReset={handleReset}
          />
        </Footer>
      </div>

      {showAdjustmentPopup && (
        <AdjustmentPopup
          repeatedPattern={repeatedPattern}
          onComplete={handleAdjustmentComplete}
          onCancel={() => setShowAdjustmentPopup(false)}
          itemName={itemName}
          overlayImg={overlayImg}
          sleeveOverlayImg={sleeveOverlayImg}
        />
      )}
    </div>
  );
};

export default CropTool;