// 파일 새로 추가

import { createContext, useContext, useState, type PropsWithChildren } from 'react';

type ThemeMode = 'light' | 'dark';

interface IThemeContext {
    theme: ThemeMode;
    isDarkMode: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<IThemeContext | undefined>(undefined);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
    // 다크모드 수정 : 전역에서 사용할 테마 상태 추가
    const [theme, setTheme] = useState<ThemeMode>('light');

    // 다크모드 수정 : 라이트/다크 모드 전환 함수 추가
    const toggleTheme = (): void => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const isDarkMode = theme === 'dark';

    return (
        <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme을 사용하려면 ThemeProvider로 감싸야 합니다.');
    }

    return context;
};