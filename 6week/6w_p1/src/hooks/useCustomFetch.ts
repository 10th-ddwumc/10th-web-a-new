
//React Query를 사용한 useCustomFetch 구현


import { useQuery } from '@tanstack/react-query';

export const useCustomFetch = <T>(url: string) => {
    return useQuery({
        // 쿼리 키: 데이터를 식별하고 캐싱하는 고유 키
        // url이 같으면 같은 캐시를 공유하고, url이 다르면 별도로 관리
        queryKey: [url],

        // 쿼리 함수: 실제로 데이터를 가져오는 비동기 함수
        // React Query가 자동으로 signal을 제공하여 요청 취소 지원
        queryFn: async ({ signal }) => {
            const response = await fetch(url, { signal });

            if (!response.ok) {
                throw new Error(`HTTP Status: ${response.status}`);
            }

            return response.json() as Promise<T>;
        },

        // 재시도 설정: 실패 시 최대 3회 자동 재시도
        retry: 3,


        // 지수 백오프 전략
        // 재시도 지연 시간: 지수 백오프 전략
        // 0회차: 1초, 1회차: 2초, 2회차: 4초 (최대 30초 제한)
        retryDelay: (attemptIndex) =>
            Math.min(1000 * Math.pow(2, attemptIndex), 30000),

        // 데이터 신선도 관리: 5분 동안은 네트워크 요청 없이 캐시 사용
        staleTime: 5 * 60 * 1000,

        // 가비지 컬렉션: 쿼리가 사용되지 않은 채로 10분이 지나면 캐시에서 제거
        gcTime: 10 * 60 * 1000,
    });
};

/*

import { useEffect, useMemo, useRef, useState } from "react";

const STALE_TIME = 1000 * 60 * 5; // 5분

//11번 유저 -> 실패(데이터 없음)
//~0.1초 지남
//11번 유저 가입
//11번 유저 -> 성공(재시도 로직 필요)
// 
// 최대 재시도 횟수
const MAX_RETRIES = 3;
// 초기 재시도 지연 시간 (밀리초)
const INITIAL_RETRY_DELAY = 1000;


// 로컬 스토리지에 저장할 데이터의 구조 
interface CacheEntry<T> {
    data: T;
    lastFetched: number;// 마지막으로 데이터를 가져온 시점 타임스탬프
}

export const useCustomFetch = <T>(url: string) => {
    // 서버에서 가져온 데이터를 저장하는 상태
    const [data, setData] = useState<T | null>(null);
    // 데이터 로딩 중 여부를 나타내는 상태
    const [isPending, setIsPending] = useState<boolean>(false);
    // 에러 발생 여부를 나타내는 상태
    const [isError, setIsError] = useState<boolean>(false);

    // URL을 localStorage 키로 사용 (useMemo로 불필요한 재계산 방지)
    const storageKey = useMemo(() => url, [url]);

    // fetch 요청을 취소하기 위한 AbortController 저장
    // useRef를 사용하여 리렌더링 시에도 동일한 참조 유지
    const abortControllerRef = useRef<AbortController | null>(null);

    // 재시도 타이머 ID를 저장 (cleanup 시 타이머 취소에 사용)
    const retryTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        // useEffect가 실행될 때마다 새로운 AbortController 생성
        abortControllerRef.current = new AbortController();
        // 에러 상태 초기화
        setIsError(false);

        // currentRetry: 현재까지 재시도한 횟수 (기본값 0)
        const fetchData = async (currentRetry = 0) => {
            const currentTime = new Date().getTime();
            const cachedItem = localStorage.getItem(storageKey);

            // 1. 로컬 스토리지에 캐시가 있는지 확인
            // 캐시 데이터 확인, 신선도 검증
            if (cachedItem) {
                try {
                    //로컬 스토리지에 저장할 땐 JSON.stringify로 문자열로 저장하기 때문에, 가져올 때는 JSON.parse로 객체로 변환해야 함
                    const cachedData: CacheEntry<T> = JSON.parse(cachedItem);

                    // 캐시가 신선한 경우 (STALE_TIME 이내) 네트워크 요청 생략
                    if (currentTime - cachedData.lastFetched < STALE_TIME) {
                        setData(cachedData.data);
                        setIsPending(false);
                        console.log(`[Cache Hit] Using fresh data for(캐시된 데이터 사용): ${url}`);
                        return; // 네트워크 요청 없이 함수 종료
                    }

                    //캐시가 만료된 경우
                    // 캐시가 오래된 경우 먼저 보여주고 백그라운드에서 새 데이터 가져오기
                    setData(cachedData.data);
                    console.log(`[Cache Stale] Refetching data for: ${url}`);
                } catch {
                    // JSON 파싱 실패 시 손상된 캐시 제거
                    localStorage.removeItem(storageKey);
                    console.warn(`[Cache Error] Invalid cache entry removed for(캐시에러 : 캐시 삭제함): ${url}`);
                }
            }

            // 2. 네트워크 요청 시작
            setIsPending(true);
            try {
                // AbortController의 signal을 fetch에 전달하여 취소 가능하게 만듦
                const response = await fetch(url, {
                    signal: abortControllerRef.current?.signal,
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const newData: T = await response.json();
                setData(newData);
                // 3. 성공 시 새 데이터를 캐시에 저장
                const newCacheEntry: CacheEntry<T> = {
                    data: newData,
                    lastFetched: new Date().getTime(), // 현재 시간을 타임스탬프로 저장
                };
                localStorage.setItem(storageKey, JSON.stringify(newCacheEntry));
            } catch (error) {
                // 요청이 취소된 경우는 정상 동작이므로 에러로 처리하지 않음
                if (error instanceof Error && error.name === 'AbortError') {
                    console.log(`[Fetch Cancelled] Request for ${url} was cancelled.`);
                    return;
                }

                // 3. 재시도 로직
                if (currentRetry < MAX_RETRIES) {
                    // 지수 백오프: 1초 → 2초 → 4초 → 8초...
                    const retryDelay = INITIAL_RETRY_DELAY * Math.pow(2, currentRetry);
                    console.log(
                        `[Retry ${currentRetry + 1
                        }/${MAX_RETRIES}] Retrying in ${retryDelay}ms...`
                    );

                    // 지연 후 재귀적으로 fetchData 호출 (재시도 횟수 증가)
                    retryTimeoutRef.current = window.setTimeout(() => {
                        fetchData(currentRetry + 1);
                    }, retryDelay);
                } else {
                    // 최대 재시도 횟수 초과 시 최종 에러 처리
                    setIsError(true);
                    setIsPending(false);
                    console.error(
                        `[Fetch Failed] Maximum retries (${MAX_RETRIES}) exceeded 최대 재시도 횟수:`,
                        error
                    );
                }

                // 실제 네트워크 에러인 경우 에러 상태 설정
                console.error(error);
                setIsError(true);
            } finally {
                setIsPending(false);
            }
        };

        fetchData();
        // cleanup 함수: 컴포넌트 언마운트 또는 URL 변경 시 실행
        return () => {
            // 진행 중인 fetch 요청을 취소하여 불필요한 네트워크 활동 중단
            // 이를 통해 경쟁 상태(Race Condition)를 방지하고 리소스 낭비 방지
            abortControllerRef.current?.abort();

            // 예약된 재시도 타이머 취소
            // 이를 통해 컴포넌트가 사라진 후에도 불필요한 재시도가 실행되는 것을 방지
            if (retryTimeoutRef.current !== null) {
                clearTimeout(retryTimeoutRef.current);
                retryTimeoutRef.current = null;
            }
        };
    }, [url, storageKey]); // url이나 storageKey가 변경되면 useEffect 재실행

    return { data, isPending, isError };
}

*/