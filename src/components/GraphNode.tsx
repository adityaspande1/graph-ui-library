import React, { useState } from 'react';
import { FileCode, Package, Box, Code, MoreHorizontal, ZoomIn, Info, GitFork, X } from 'lucide-react';
import { Node } from '../types/graph';

interface GraphNodeProps {
  node: Node;
  position: { x: number; y: number };
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
}

const getNodeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'component':
      return <FileCode className="w-5 h-5" />;
    case 'hook':
      return <GitFork className="w-5 h-5" />;
    case 'service':
      return <Code className="w-5 h-5" />;
    case 'context':
      return <Box className="w-5 h-5" />;
    case 'module':
      return <Package className="w-5 h-5" />;
    default:
      return <FileCode className="w-5 h-5" />;
  }
};

const getNodeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'component':
      return 'bg-blue-100 border-blue-500';
    case 'hook':
      return 'bg-purple-100 border-purple-500';
    case 'service':
      return 'bg-green-100 border-green-500';
    case 'context':
      return 'bg-yellow-100 border-yellow-500';
    case 'module':
      return 'bg-orange-100 border-orange-500';
    default:
      return 'bg-gray-100 border-gray-500';
  }
};

export const GraphNode: React.FC<GraphNodeProps> = ({ node, position, onPositionChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.node-menu')) return;
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      onPositionChange(node.id, { x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
    setShowTooltip(false);
  };

  return (
    <div
      className={`absolute p-3 rounded-lg border-2 ${getNodeColor(
        node.type
      )} shadow-md transition-transform hover:scale-105 cursor-move select-none`}
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
        width: '180px',
        zIndex: isDragging || showMenu ? 10 : 1,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseEnter={() => setShowTooltip(true)}

    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getNodeIcon(node.type)}
          <span className="font-medium text-sm truncate">{node.name}</span>
        </div>
        <button
          className="p-1 rounded-full hover:bg-black/5 transition-colors node-menu"
          onClick={handleMenuClick}
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      <div className="text-xs text-gray-600 mt-1 truncate">
        {node.filepath}
      </div>
      <div className="text-xs bg-white/50 rounded px-2 py-1 mt-1">
        {node.type}
      </div>

      {/* Context Menu */}
      {showMenu && (
        <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-48 z-20 node-menu">
          <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
            <Info className="w-4 h-4" />
            View Details
          </button>
          <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
            <ZoomIn className="w-4 h-4" />
            Focus
          </button>
          <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
            <GitFork className="w-4 h-4" />
            Show Dependencies
          </button>
          <button 
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
            onClick={() => setShowMenu(false)}
          >
            <X className="w-4 h-4" />
            Close Menu
          </button>
        </div>
      )}

      {/* Tooltip */}
      {showTooltip && !showMenu && (
        <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap z-30">
          <div className="font-medium">{node.name}</div>
          <div className="text-xs text-gray-300">{node.metadata.description}</div>
          {node.metadata.props && (
            <div className="text-xs text-blue-300">Props: {node.metadata.props.join(', ')}</div>
          )}
          {node.metadata.exports && (
            <div className="text-xs text-green-300">Exports: {node.metadata.exports.join(', ')}</div>
          )}
          <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
        </div>
      )}
    </div>
  );
}