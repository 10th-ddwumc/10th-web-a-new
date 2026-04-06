import { useState, useEffect } from 'react';
import axios from 'axios';

const useCustomFetch = <T>(url: string, params?: object) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // 객체인 params를 문자열로 변환하여 의존성 비교에 사용합니다.
  // 이렇게 하면 호출부에서 useMemo를 깜빡해도 무한 루프가 발생하지 않습니다.
  const paramsString = JSON.stringify(params);

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
  }, [url, paramsString]); // url이나 params의 내용이 바뀔 때만 실행

  return { data, isLoading, isError };
};

export default useCustomFetch;