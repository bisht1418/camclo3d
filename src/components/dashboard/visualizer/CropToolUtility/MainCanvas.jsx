export const MainCanvas = ({
  canvasRef,
  canvasSize,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onWheel,
  onContextMenu,
}) => {
  return (
    <div className="bg-white rounded-md overflow-hidden flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={800}
        height={800}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onWheel={onWheel}
        onContextMenu={onContextMenu}
        style={{
          width: `${canvasSize.width}px`,
          height: `${canvasSize.height}px`,
          touchAction: 'none',
        }}
      />
    </div>
  );
};