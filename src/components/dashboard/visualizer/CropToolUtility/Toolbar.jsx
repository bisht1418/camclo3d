import { MdOutlineRotate90DegreesCcw } from "react-icons/md";
import { LuFlipHorizontal2, LuFlipVertical2 } from "react-icons/lu";
import { IoCropSharp } from "react-icons/io5";
import { ToolbarButton } from './ToolbarButton';

export const Toolbar = ({ 
  active, 
  onStartCrop, 
  onRotate, 
  onFlipVertical, 
  onFlipHorizontal, 
  onReset 
}) => {
  return (
    <div className="flex space-x-2">
      <ToolbarButton
        onClick={onStartCrop}
        isActive={active === 1}
        title="Start Crop"
      >
        <IoCropSharp size={20} />
      </ToolbarButton>
      
      <ToolbarButton
        onClick={onRotate}
        isActive={active === 2}
        title="Rotate"
      >
        <MdOutlineRotate90DegreesCcw size={20} />
      </ToolbarButton>
      
      <ToolbarButton
        onClick={onFlipVertical}
        isActive={active === 3}
        title="Flip Vertical"
      >
        <LuFlipVertical2 size={20} />
      </ToolbarButton>
      
      <ToolbarButton
        onClick={onFlipHorizontal}
        isActive={active === 4}
        title="Flip Horizontal"
      >
        <LuFlipHorizontal2 size={20} />
      </ToolbarButton>
      
      <button
        onClick={onReset}
        className="btn btn-secondary"
        title="Reset"
      >
        Reset
      </button>
    </div>
  );
};