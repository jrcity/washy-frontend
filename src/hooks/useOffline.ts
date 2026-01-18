import { useSyncExternalStore, useCallback, useEffect } from 'react';

// Offline state store
let isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
const listeners = new Set<() => void>();

const subscribe = (callback: () => void) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};

const getSnapshot = () => isOnline;

const updateOnlineStatus = () => {
  isOnline = navigator.onLine;
  listeners.forEach((listener) => listener());
};

// Set up global listeners (runs once)
if (typeof window !== 'undefined') {
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
}

/**
 * Hook to detect online/offline status
 */
export const useOnlineStatus = () => {
  return useSyncExternalStore(subscribe, getSnapshot, () => true);
};

/**
 * Hook for offline-aware operations
 */
export const useOffline = () => {
  const isOnline = useOnlineStatus();

  // Show a message when going offline/online
  useEffect(() => {
    if (!isOnline) {
      console.log('App is offline. Some features may not be available.');
    }
  }, [isOnline]);

  const checkConnection = useCallback(() => {
    return navigator.onLine;
  }, []);

  return {
    isOnline,
    isOffline: !isOnline,
    checkConnection,
  };
};

export default useOffline;
