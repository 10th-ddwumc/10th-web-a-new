import { useState, useEffect } from 'react';
import axios from 'axios';

const useCustomFetch = <T>(url: string, params?: object) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        const response = await axios.get(url, {
          params: {
            api_key: import.meta.env.VITE_TMDB_API_KEY,
            language: 'ko-KR',
            ...params,
          },
        });

        setData(response.data);
      } catch (error) {
        console.error("Fetch Error:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url, JSON.stringify(params)]);

  return { data, isLoading, isError };
};

export default useCustomFetch;