'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type CacheData = Record<string, { data: any; timestamp: number }>;

interface CacheContextType {
  getCachedData: <T>(key: string, fetcher: () => Promise<T>, maxAge?: number) => Promise<T>;
  invalidateCache: (key?: string) => void;
  clearUserCache: () => void;
}

const CacheContext = createContext<CacheContextType | null>(null);

// Cache expiration time (default: 5 minutes)
const DEFAULT_CACHE_MAX_AGE = 5 * 60 * 1000;

export function CacheProvider({ children }: { children: ReactNode }) {
  const [cache, setCache] = useState<CacheData>({});
  
  // Initialize cache from localStorage on component mount
  useEffect(() => {
    try {
      const storedCache = localStorage.getItem('app_cache');
      if (storedCache) {
        setCache(JSON.parse(storedCache));
      }
    } catch (error) {
      console.error('Error loading cache from localStorage:', error);
      // If there's an error, reset the cache
      setCache({});
    }
  }, []);
  
  // Update localStorage when cache changes
  useEffect(() => {
    try {
      localStorage.setItem('app_cache', JSON.stringify(cache));
    } catch (error) {
      console.error('Error saving cache to localStorage:', error);
    }
  }, [cache]);
  
  // Get data from cache or fetch it if not available or expired
  const getCachedData = async <T,>(key: string, fetcher: () => Promise<T>, maxAge = DEFAULT_CACHE_MAX_AGE): Promise<T> => {
    const now = Date.now();
    const cachedItem = cache[key];
    
    // Return cached data if it exists and is not expired
    if (cachedItem && now - cachedItem.timestamp < maxAge) {
      return cachedItem.data as T;
    }
    
    // Otherwise fetch fresh data
    try {
      const data = await fetcher();
      
      // Update cache with new data
      setCache(prevCache => ({
        ...prevCache,
        [key]: { data, timestamp: now }
      }));
      
      return data;
    } catch (error) {
      console.error(`Error fetching data for key ${key}:`, error);
      // If we have stale data, return it rather than failing
      if (cachedItem) {
        return cachedItem.data as T;
      }
      throw error;
    }
  };
  
  // Invalidate specific cache entry or entire cache
  const invalidateCache = (key?: string) => {
    if (key) {
      setCache(prevCache => {
        const newCache = { ...prevCache };
        delete newCache[key];
        return newCache;
      });
    } else {
      setCache({});
    }
  };
  
  // Clear only user-specific cache entries
  const clearUserCache = () => {
    setCache(prevCache => {
      const newCache = { ...prevCache };
      // Remove any keys that are user-specific (contain user_)
      Object.keys(newCache).forEach(key => {
        if (key.includes('user_')) {
          delete newCache[key];
        }
      });
      return newCache;
    });
  };
  
  return (
    <CacheContext.Provider value={{ getCachedData, invalidateCache, clearUserCache }}>
      {children}
    </CacheContext.Provider>
  );
}

export function useCache() {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error('useCache must be used within a CacheProvider');
  }
  return context;
}