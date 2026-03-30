import { useEffect, useState } from 'react';
import { PUSHSTATE_EVENT } from './constants';
import { getCurrentPath } from './utils';

export const useCurrentPath = () => {
    const [currentPath, setCurrentPath] = useState(getCurrentPath());

    useEffect(() => {
        const handlePathChange = () => {
            setCurrentPath(getCurrentPath());
        };

        window.addEventListener(PUSHSTATE_EVENT, handlePathChange);
        window.addEventListener('popstate', handlePathChange);

        return () => {
            window.removeEventListener(PUSHSTATE_EVENT, handlePathChange);
            window.removeEventListener('popstate', handlePathChange);
        };
    }, []);

    return currentPath;
};