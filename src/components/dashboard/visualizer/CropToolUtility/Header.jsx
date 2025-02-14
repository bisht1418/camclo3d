import { IoCloseOutline } from "react-icons/io5";

export const Header = ({ itemName, onClose, onCancel }) => {
  return (
    <div className="flex justify-between p-4 items-center bg-gray-100">
      <h2 className="text-2xl font-bold">{itemName} Image</h2>
      <button
        onClick={() => {
          onClose();
          onCancel();
        }}
        className="bg-primary rounded-3xl text-white p-2 hover:bg-opacity-80 transition-colors"
      >
        <IoCloseOutline size={28} />
      </button>
    </div>
  );
};
