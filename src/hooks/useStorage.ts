import { useState, useEffect, useCallback } from 'react';
import { getStorageData, setStorageData, StorageData } from '@/lib/storage';

export function useStorage<K extends keyof StorageData>(
  key: K
): [StorageData[K] | null, (value: StorageData[K]) => Promise<void>, boolean] {
  const [data, setData] = useState<StorageData[K] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    const load = async () => {
      try {
        const value = await getStorageData(key);
        if (mounted) {
          setData(value);
          setLoading(false);
        }
      } catch (error) {
        console.error(`Error loading ${key}:`, error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [key]);

  const updateData = useCallback(
    async (value: StorageData[K]) => {
      setData(value);
      await setStorageData(key, value);
    },
    [key]
  );

  return [data, updateData, loading];
}
