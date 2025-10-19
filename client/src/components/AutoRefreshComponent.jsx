import { useEffect } from 'react';
import { getAllPasswords } from '../services/apiService';

const AutoRefreshComponent = ({ onDataRefresh, interval = 30000 }) => {
  useEffect(() => {
    const refreshData = async () => {
      try {
        const data = await getAllPasswords();
        if (onDataRefresh) {
          onDataRefresh(data);
        }
      } catch (error) {
        console.error('Auto-refresh error:', error);
      }
    };

    const intervalId = setInterval(refreshData, interval);

    return () => clearInterval(intervalId);
  }, [onDataRefresh, interval]);

  return null; // This component doesn't render anything
};

export default AutoRefreshComponent;
