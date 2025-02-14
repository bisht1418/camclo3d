export const PreviewPanel = ({ 
  previewCanvasRef, 
  itemName, 
  showOrientation 
}) => {
  return (
    <div className="w-60 ml-4 flex flex-col">
      <p className="text-lg font-semibold mb-2">Preview</p>
      <canvas
        ref={previewCanvasRef}
        width={180}
        height={180}
        className="border border-gray-300 shadow-md mb-4"
      />
      <div className="flex-grow overflow-y-auto">
        {showOrientation && (
          <>
            <p className="text-lg font-semibold mb-2">Orientation</p>
            <img
              src={`/${itemName.toLowerCase().replace(' ','_')}_orientation.png`}
              alt={`${itemName} Orientation`}
              className="w-full object-contain"
            />
          </>
        )}
      </div>
    </div>
  );
};
