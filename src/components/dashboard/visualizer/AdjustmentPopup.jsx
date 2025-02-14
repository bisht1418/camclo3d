import { useState, useRef, useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";

const AdjustmentPopup = ({
  repeatedPattern,
  onComplete,
  onCancel,
  itemName,
  overlayImg,
  sleeveOverlayImg,
}) => {
  const canvasRef = useRef(null);
  const sleeveCanvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [patternOffset, setPatternOffset] = useState({ x: 0, y: 0 });
  const [sleevePatternOffset, setSleevePatternOffset] = useState({ x: 0, y: 0 });
  const [activeCanvas, setActiveCanvas] = useState("main");
  const patternImageRef = useRef(null);
  const [mainScale, setMainScale] = useState(itemName === 'Add Blouse' ? 1.5 : 1);
  const [sleeveScale, setSleeveScale] = useState(1.5);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 500 });

  const showSleeve = itemName === "Add Blouse" || itemName === "Suit Front" ;
// console.log(repeatedPattern,"Uploaded image")
  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        
        // Use consistent aspect ratio and sizing approach
        const aspectRatio = 3 / 2; // Fixed 3:2 aspect ratio
        const maxWidth = 800; // Maximum width to prevent oversized canvases
        const maxHeight = 600; // Maximum height to prevent oversized canvases
        
        // Calculate dimensions based on container size
        let containerWidth = container.offsetWidth;
        let containerHeight = container.offsetHeight;
        
        let newWidth = Math.min(containerWidth, maxWidth);
        let newHeight = newWidth / aspectRatio;
        
        // Ensure height doesn't exceed container or max height
        if (newHeight > containerHeight || newHeight > maxHeight) {
          newHeight = Math.min(containerHeight, maxHeight);
          newWidth = newHeight * aspectRatio;
        }
        
        // Ensure width doesn't exceed container
        newWidth = Math.min(newWidth, containerWidth);
        
        setCanvasSize({
          width: Math.floor(newWidth),
          height: Math.floor(newHeight)
        });
      }
    };
  
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Enhanced image loading with quality settings
  const loadImage = (src) => new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.setAttribute('rendering-intent', 'crisp-edges');
    img.onload = () => resolve(img);
    img.src = src;
  });


  useEffect(() => {
    const loadPatternImage = async () => {
      if (repeatedPattern) {
        patternImageRef.current = await loadImage(repeatedPattern);
        drawCanvas(true);
        if (showSleeve) {
          drawSleeveCanvas(true);
        }
      }
    };
    loadPatternImage();
  }, [repeatedPattern, showSleeve]);

  useEffect(() => {
    drawCanvas(true);
    if (showSleeve) {
      drawSleeveCanvas(true);
    }
  }, [patternOffset, sleevePatternOffset, mainScale, sleeveScale, showSleeve, canvasSize]);

 const setupCanvas = (canvas, width, height) => {
    const ctx = canvas.getContext("2d", { 
      alpha: true, 

      willReadFrequently: true,
    });
    
    // Use higher DPR for better quality
    const dpr = (window.devicePixelRatio || 1,2);

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    
    // Scale context by DPR
    ctx.scale(1, 1);
    
    // Enable high-quality image rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    return ctx;
  };


  const drawCanvas = (includeOverlay = false) => {
    const canvas = canvasRef.current;
    if (!canvas || !patternImageRef.current) return;

    const ctx = setupCanvas(canvas, canvas.offsetWidth, canvas.offsetHeight);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();

    if (includeOverlay && overlayImg) {
      drawOverlayAsMask(ctx, canvas, overlayImg);
    }

    drawPattern(ctx, canvas, patternImageRef.current, mainScale, patternOffset);

    ctx.restore();

    if (includeOverlay) {
      drawOverlay(ctx, canvas, overlayImg);
    }
  };

  // Enhanced overlay drawing with better quality
  const calculateDrawDimensions = (canvas, overlay) => {
  // Use aspect ratio and relative sizing
  const aspectRatio = overlay.width / overlay.height;
  let drawWidth = canvas.width;
  let drawHeight = drawWidth / aspectRatio;

  // Ensure the overlay fits within the canvas
  if (drawHeight > canvas.height) {
    drawHeight = canvas.height;
    drawWidth = drawHeight * aspectRatio;
  }

  // Center the overlay
  const x = (canvas.width - drawWidth) / 2;
  const y = (canvas.height - drawHeight) / 2;

  return { drawWidth, drawHeight, x, y };
};

const drawOverlayAsMask = (ctx, canvas, overlay) => {
  const { drawWidth, drawHeight, x, y } = calculateDrawDimensions(canvas, overlay);
  
  // Draw overlay and create clipping mask
  ctx.drawImage(overlay, x, y, drawWidth, drawHeight);
  ctx.beginPath();
  ctx.rect(x, y, drawWidth, drawHeight);
  ctx.clip();
};


  const drawOverlay = (ctx, canvas, overlay) => {
    ctx.save();
    
    // Semi-transparent overlay
    ctx.globalAlpha = 0.5;
    
    const { drawWidth, drawHeight, x, y } = calculateDrawDimensions(canvas, overlay);
    ctx.drawImage(overlay, x, y, drawWidth, drawHeight);
    
    ctx.globalAlpha = 1.0;
    ctx.restore();
  };


  const drawSleeveCanvas = (includeOverlay = false) => {
    const canvas = sleeveCanvasRef.current;
    if (!canvas || !patternImageRef.current) return;
    const ctx = setupCanvas(canvas, canvas.offsetWidth, canvas.offsetHeight);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();

    if (includeOverlay && sleeveOverlayImg) {
      drawOverlayAsMask(ctx, canvas, sleeveOverlayImg);
    }

    drawPattern(ctx, canvas, patternImageRef.current, sleeveScale, sleevePatternOffset);

    ctx.restore();

    if (includeOverlay) drawOverlay(ctx, canvas, sleeveOverlayImg);
  };

  // Improved pattern drawing with better quality
  const drawPattern = (ctx, canvas, patternImg, scale, offset) => {
    // Use normalized coordinates instead of device-specific pixel calculations
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
  
    // Calculate pattern dimensions based on relative scaling
    const heightRatio = canvasHeight / patternImg.height;
    const scaledWidth = patternImg.width * heightRatio * scale;
    const scaledHeight = canvasHeight * scale;
  
    // Create a high-quality pattern rendering approach
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d', { 
      alpha: true,
      willReadFrequently: true 
    });
    
    // Set canvas dimensions to scaled size
    tempCanvas.width = scaledWidth;
    tempCanvas.height = scaledHeight;
  
    // Enable high-quality rendering
    tempCtx.imageSmoothingEnabled = true;
    tempCtx.imageSmoothingQuality = 'high';
    
    // Draw pattern to temporary canvas
    tempCtx.drawImage(patternImg, 0, 0, scaledWidth, scaledHeight);
  
    // Create pattern
    const pattern = ctx.createPattern(tempCanvas, 'repeat-x');
  
    ctx.save();
  
    // Calculate maximum allowed vertical offset using relative units
    const maxOffsetY = scaledHeight - canvasHeight;
    const clampedOffsetY = Math.min(0, Math.max(-maxOffsetY, offset.y));
  
    // Draw pattern using normalized coordinates
    ctx.translate(offset.x, clampedOffsetY);
    ctx.fillStyle = pattern;
    ctx.fillRect(-offset.x, -clampedOffsetY, canvasWidth * 2, scaledHeight);
  
    ctx.restore();
  };
  // Improved final image processing
  const handleComplete = () => {
    const processFinalImage = async () => {
      // Ensure highest quality rendering
      drawCanvas(false);
      if (showSleeve) {
        drawSleeveCanvas(false);
      }
      
      // Allow time for canvas rendering
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const mainCanvas = canvasRef.current;
      const sleeveCanvas = sleeveCanvasRef.current;
      
      const cropAndRotate = (canvas, cropWidth, cropHeight, startX, startY, rotate = false) => {
        // Increase output resolution significantly
        const scaleFactor = 4; // Higher scale factor for better quality
        const croppedCanvas = document.createElement('canvas');
        const croppedCtx = croppedCanvas.getContext('2d', {
          alpha: true,
          willReadFrequently: true,
          desynchronized: true // Optimize performance
        });
    
        // Handle sleeve aspect ratio with precision
        if (canvas === sleeveCanvas) {
          const sourceAspectRatio = cropWidth / cropHeight;
          const targetAspectRatio = 1.5;
          
          if (sourceAspectRatio > targetAspectRatio) {
            cropWidth = Math.round(cropHeight * targetAspectRatio);
            startX = Math.round((canvas.width - cropWidth) / 2);
          } else {
            cropHeight = Math.round(cropWidth / targetAspectRatio);
            startY = Math.round((canvas.height - cropHeight) / 2);
          }
        }
    
        // Set dimensions with high precision
        croppedCanvas.width = Math.round(cropWidth * scaleFactor);
        croppedCanvas.height = Math.round(cropHeight * scaleFactor);
    
        // Configure for maximum quality
        croppedCtx.imageSmoothingEnabled = true;
        croppedCtx.imageSmoothingQuality = 'high';
        
        // Clear canvas before drawing
        croppedCtx.clearRect(0, 0, croppedCanvas.width, croppedCanvas.height);
        
        // Apply scale transform for higher resolution
        croppedCtx.scale(scaleFactor, scaleFactor);
    
        // Draw with precise coordinates
        croppedCtx.drawImage(
          canvas,
          Math.round(startX), Math.round(startY),
          Math.round(cropWidth), Math.round(cropHeight),
          0, 0,
          Math.round(cropWidth), Math.round(cropHeight)
        );
    
        // Handle rotation for blouse with high quality
        if (rotate && itemName === "Add Blouse") {
          const rotatedCanvas = document.createElement('canvas');
          const rotatedCtx = rotatedCanvas.getContext('2d', {
            alpha: true,
            willReadFrequently: true,
            desynchronized: true
          });
    
          // Maintain high resolution for rotated canvas
          rotatedCanvas.width = croppedCanvas.height;
          rotatedCanvas.height = croppedCanvas.width;
    
          rotatedCtx.imageSmoothingEnabled = true;
          rotatedCtx.imageSmoothingQuality = 'high';
    
          // Use precise rotation transform
          rotatedCtx.translate(rotatedCanvas.width / 2, rotatedCanvas.height / 2);
          rotatedCtx.rotate((-90 * Math.PI) / 180);
          rotatedCtx.drawImage(
            croppedCanvas,
            -Math.round(croppedCanvas.width / 2),
            -Math.round(croppedCanvas.height / 2)
          );
    
          return rotatedCanvas;
        }
    
        return croppedCanvas;
      };
    
      // Calculate precise dimensions
      const cropWidth = Math.round(mainCanvas.width * 0.5);
      const mainFinalCanvas = cropAndRotate(
        mainCanvas,
        cropWidth,
        mainCanvas.height,
        Math.round(mainCanvas.width * 0.25),
        0,
        true
      );
    
      // Use lossless PNG format with maximum quality
      const getHighQualityDataURL = (canvas) => {
        // Create temporary canvas for final processing
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d', {
          alpha: true,
          desynchronized: true
        });
        
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        
        // Apply final quality improvements
        tempCtx.imageSmoothingEnabled = true;
        tempCtx.imageSmoothingQuality = 'high';
        tempCtx.drawImage(canvas, 0, 0);
        
        return tempCanvas.toDataURL('image/png', 1.0);
      };
    
      let result = {
        main: getHighQualityDataURL(mainFinalCanvas)
      };
    
      if (showSleeve && sleeveCanvas) {
        const sleeveCropWidth = sleeveCanvas.width;
        const sleeveCropHeight = Math.round(sleeveCanvas.height / 2);
        const sleeveFinalCanvas = cropAndRotate(
          sleeveCanvas,
          sleeveCropWidth,
          sleeveCropHeight,
          0,
          sleeveCropHeight,
          itemName === "Add Blouse"
        );
        result.sleeve = getHighQualityDataURL(sleeveFinalCanvas);
      }
    
      onComplete(result);
    };    processFinalImage();
  };
  const min = 0.5;
  const max = 2;
  const calculatePercentage = (value) => Math.round(((value - min) / (max - min)) * 100);
  const updateBackground = (value) => `linear-gradient(to right, #8c2a8d ${calculatePercentage(value)}%, #e1d8e9 ${calculatePercentage(value)}%)`;

  // Event handlers remain the same
  const handleDragStart = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
  
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const dx = clientX - dragStart.x;
    const dy = clientY - dragStart.y;
  
    const setOffset = activeCanvas === "main" ? setPatternOffset : setSleevePatternOffset;
    const currentOffset = activeCanvas === "main" ? patternOffset : sleevePatternOffset;
    const canvas = activeCanvas === "main" ? canvasRef.current : sleeveCanvasRef.current;
    const scale = activeCanvas === "main" ? mainScale : sleeveScale;
  
    if (!canvas || !patternImageRef.current) return;
  
    const dpr = window.devicePixelRatio || 1;
    const canvasHeight = canvas.height / dpr;
    const patternHeight = patternImageRef.current.height;
    const canvasWidth = canvas.width / dpr;
    const patternWidth = patternImageRef.current.width;
  
    // Calculate scaled dimensions
    const scaleX = (canvasWidth / patternWidth) * scale;
    const scaleY = (canvasHeight / patternHeight) * scale;
    const finalScale = Math.max(scaleX, scaleY);
    
    const scaledWidth = patternWidth * finalScale;
    const scaledHeight = patternHeight * finalScale;
  
    // Calculate maximum allowed vertical offset
    const maxOffsetY = scaledHeight - canvasHeight;
  
    setOffset({
      x: currentOffset.x + dx, // Unlimited horizontal dragging
      y: Math.min(0, Math.max(-maxOffsetY, currentOffset.y + dy)) // Constrained vertical dragging
    });
  
    setDragStart({ x: clientX, y: clientY });
  };
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-2 sm:p-4 bg-gray-100 border-b-2 border-gray-300">
        <h2 className="font-bold text-lg sm:text-xl text-secondary">
          Adjust {itemName === "Add Blouse" ? "Blouse" : itemName === "Shirt Fabric" ? "Shirt": "Suit"} Pattern
        </h2>
        <button 
          onClick={onCancel} 
          className="text-white bg-primary rounded-xl p-1 sm:p-2"
        >
          <IoCloseOutline size={20} className="sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Main Content */}
      <div 
        ref={containerRef} 
        className="flex-grow p-2 sm:p-6 overflow-y-auto min-h-0"
      >
        <div className={`flex flex-col ${showSleeve ? 'lg:flex-row' : ''} gap-4  `}>
          {/* Main Canvas */}
          <div className={`flex-1 'max-w-5xl mx-auto sm:max-w-5xl' min-h-0 flex flex-col`}>
            <h3 className="font-semibold mb-2 text-sm sm:text-base">Main</h3>
            <div className="relative flex-grow min-h-0">
              <canvas
                ref={canvasRef}
                width={canvasSize.width}
                height={canvasSize.height}
                onMouseDown={(e) => {
                  handleDragStart(e);
                  setActiveCanvas("main");
                }}
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={(e) => {
                  handleDragStart(e);
                  setActiveCanvas("main");
                }}
                onTouchMove={handleDragMove}
                onTouchEnd={handleDragEnd}
                className="border border-gray-400 w-full h-auto touch-none max-h-full object-contain"
              />
            </div>
            <div className= 'mt-2'>
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Scale: {mainScale.toFixed(2)}
              </label>
              <input
                type="range"
                min={min}
                max={max}
                step="0.1"
                value={mainScale}
                style={{ background: updateBackground(mainScale) }}
                onChange={(e) => setMainScale(parseFloat(e.target.value))}
                className="w-auto rounded-lg mt-1"
              />
            </div>
          </div>

          {/* Sleeve Canvas */}
          {showSleeve && (
            <div className="flex-1 min-h-0 flex flex-col">
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Sleeve</h3>
              <div className="relative flex-grow min-h-0">
                <canvas
                  ref={sleeveCanvasRef}
                  width={canvasSize.width}
                  height={canvasSize.height}
                  onMouseDown={(e) => {
                    handleDragStart(e);
                    setActiveCanvas("sleeve");
                  }}
                  onMouseMove={handleDragMove}
                  onMouseUp={handleDragEnd}
                  onMouseLeave={handleDragEnd}
                  onTouchStart={(e) => {
                    handleDragStart(e);
                    setActiveCanvas("sleeve");
                  }}
                  onTouchMove={handleDragMove}
                  onTouchEnd={handleDragEnd}
                  className="border border-gray-400 w-full h-auto touch-none max-h-full object-contain"
                />
              </div>
              <div className="mt-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Scale: {sleeveScale.toFixed(2)}
                </label>
                <input
                  type="range"
                  min={min}
                  max={max}
                  step="0.1"
                  value={sleeveScale}
                  style={{ background: updateBackground(sleeveScale) }}
                  onChange={(e) => setSleeveScale(parseFloat(e.target.value))}
                  className="w-full rounded-lg mt-1"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-2 sm:p-4 bg-gray-100 border-t-4 border-gray-300 flex justify-end gap-2">
        <button 
          onClick={onCancel} 
          className="btn btn-outline text-sm sm:text-base px-3 py-1 sm:px-4 sm:py-2"
        >
          Cancel
        </button>
        <button 
          onClick={handleComplete} 
          className="btn btn-primary text-sm sm:text-base px-3 py-1 sm:px-4 sm:py-2"
        >
          Finalize
        </button>
      </div>
    </div>
  );
};

export default AdjustmentPopup;