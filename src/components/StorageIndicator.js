import React, {useEffect, useState} from 'react';
import { getStoragePercentage } from '../utils/storageManager';
import './StorageIndicator.css';

const StorageIndicator = () => {
  const [percentage, setPercentage] = useState(getStoragePercentage());

  useEffect(() => {
    // Function to update percentage
    const updatePercentage = () => {
      setPercentage(getStoragePercentage());
    };

    // Listen to storage events from other tabs
    const handleStorageChange = () => {
      updatePercentage();
    };

    // Override setItem to catch changes in current tab
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function() {
      originalSetItem.apply(this, arguments);
      updatePercentage();
    };

    // Override removeItem to catch deletions in current tab
    const originalRemoveItem = localStorage.removeItem;
    localStorage.removeItem = function() {
      originalRemoveItem.apply(this, arguments);
      updatePercentage();
    };

    // Override clear to catch clearing in current tab
    const originalClear = localStorage.clear;
    localStorage.clear = function() {
      originalClear.apply(this, arguments);
      updatePercentage();
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup function
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      localStorage.setItem = originalSetItem;
      localStorage.removeItem = originalRemoveItem;
      localStorage.clear = originalClear;
    };
  }, []);

  const getColorByPercentage = (percent) => {
    if (percent > 90) return '#ff4444';
    if (percent > 70) return '#ffaa00';
    return '#44bb44';
  };

  return (
    <div className="storage-indicator">
      <div className="storage-bar-container">
        <div 
          className="storage-bar-fill"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: getColorByPercentage(percentage)
          }}
        />
      </div>
      <div className="storage-text">
        {percentage.toFixed(1)}% מנפח האחסון בשימוש
      </div>
    </div>
  );
};

export default StorageIndicator;