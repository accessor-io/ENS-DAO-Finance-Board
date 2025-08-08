import React, { useState, useEffect } from 'react';

const CursorArrow = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [targetElement, setTargetElement] = useState(null);
  const [lastClickedPosition, setLastClickedPosition] = useState(null);
  const [showLastPosition, setShowLastPosition] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Find all clickable elements
      const clickableElements = document.querySelectorAll('button, a, [role="button"], [onclick]');
      let closestElement = null;
      let closestDistance = Infinity;
      
      // Always find the closest clickable element regardless of distance
      clickableElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const elementCenterX = rect.left + rect.width / 2;
        const elementCenterY = rect.top + rect.height / 2;
        
        const distance = Math.sqrt(
          Math.pow(e.clientX - elementCenterX, 2) + 
          Math.pow(e.clientY - elementCenterY, 2)
        );
        
        if (distance < closestDistance) {
          closestElement = element;
          closestDistance = distance;
        }
      });
      
      if (closestElement) {
        setIsVisible(true);
        setTargetElement(closestElement);
        
        // Get the element's bounding rectangle
        const rect = closestElement.getBoundingClientRect();
        
        // Position arrow to the LEFT of the element, vertically centered
        setPosition({
          x: rect.left - 20, // 20px to the left of the element
          y: rect.top + rect.height / 2
        });
      } else {
        // If no clickable element found, hide arrow
        setIsVisible(false);
        setTargetElement(null);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setTargetElement(null);
    };

    const handleClick = (e) => {
      // Don't interfere with the actual click
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const clickedPosition = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          element: targetElement
        };
        setLastClickedPosition(clickedPosition);
        setShowLastPosition(true);
        
        // Hide the last position after 3 seconds
        setTimeout(() => {
          setShowLastPosition(false);
        }, 3000);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <>
      {/* Persistent arrow (always visible) */}
      <div
        className="fixed pointer-events-none z-50 transition-all duration-200 ease-out"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none'
        }}
      >
        <div 
          className={`text-2xl font-bold bg-white rounded-full p-2 shadow-lg border-2 transition-all duration-200 pointer-events-none ${
            targetElement 
              ? 'text-blue-600 border-blue-400 animate-pulse scale-110' 
              : 'text-gray-600 border-gray-400 scale-100'
          }`}
          style={{ pointerEvents: 'none' }}
        >
          ▶
        </div>
      </div>
      
      {/* Last clicked position indicator */}
      {showLastPosition && lastClickedPosition && (
        <div
          className="fixed pointer-events-none z-40 transition-all duration-500 ease-out"
          style={{
            left: lastClickedPosition.x,
            top: lastClickedPosition.y,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="text-green-600 text-lg font-bold bg-white rounded-full p-2 shadow-lg border-2 border-green-400 animate-pulse">
            ✓
          </div>
          <div className="text-xs text-green-600 font-medium mt-1 text-center bg-white px-2 py-1 rounded shadow">
            Last Click
          </div>
        </div>
      )}
    </>
  );
};

export default CursorArrow; 