export const ToolbarButton = ({ onClick, isActive, title, children }) => {
  return (
    <button
      onClick={onClick}
      className={`btn ${isActive ? "btn-primary" : "btn-outline"}`}
      title={title}
    >
      {children}
    </button>
  );
};