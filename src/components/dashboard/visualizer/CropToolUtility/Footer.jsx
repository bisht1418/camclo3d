import { ToolbarButton } from './ToolbarButton';
import { Toolbar } from './Toolbar';
import { PreviewPanel } from './PreviewPanel';
import { Header } from './Header';
import { MainCanvas } from './MainCanvas';

const Footer = ({ children, onApplyCrop, loading }) => {
  return (
      <div className="p-4 bg-gray-100 flex justify-between items-center">
          {children}
          <button 
              onClick={onApplyCrop} 
              className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}
              disabled={loading} // Disable button while loading
          >
              {loading ? 'Applying...' : 'Apply & Save'}
          </button>
      </div>
  );
};

export { 
  ToolbarButton, 
  Toolbar, 
  PreviewPanel, 
  Header, 
  MainCanvas, 
  Footer 
};