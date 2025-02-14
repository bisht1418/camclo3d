import { useEffect } from 'react';

const useZoom = (cameraRef, refContainer) => {
  useEffect(() => {
    const handleWheel = (event) => {
      event.preventDefault();
      const zoomSpeed = 0.01;
      const zoomDelta = -event.deltaY > 0 ? 1 + zoomSpeed : 1 - zoomSpeed;
      
      if (cameraRef.current) {
        if (cameraRef.current.isOrthographicCamera) {
          // Orthographic camera zoom (adjust the zoom level)
          cameraRef.current.zoom *= zoomDelta;
          cameraRef.current.updateProjectionMatrix();
          
        } 
      }
    };

    if (refContainer.current) {
      refContainer.current.addEventListener('wheel', handleWheel);
    }

    return () => {
      if (refContainer.current) {
        refContainer.current?.removeEventListener('wheel', handleWheel);
      }
    };
  }, [cameraRef, refContainer]);
};

export default useZoom;
