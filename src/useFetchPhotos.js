import { useState, useEffect } from 'react';

/**
 * Custom hook to fetch photos from the Picsum Photos API.
 * Requirements:
 * - Fetches 30 photos on load from https://picsum.photos/v2/list?limit=30
 * - Returns: { photos, loading, error }
 * - Gracefully handles loading and error states
 */
export function useFetchPhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchPhotos() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('https://picsum.photos/v2/list?limit=30', {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Network response error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setPhotos(data);
      } catch (err) {
        // Only set error if request was not intentionally aborted on unmount
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to fetch photos. Please try again.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchPhotos();

    return () => {
      controller.abort();
    };
  }, []);

  return { photos, loading, error };
}

export default useFetchPhotos;
