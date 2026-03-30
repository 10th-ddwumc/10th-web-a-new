import { useTheme } from '../context/ThemeContext';

const ThemeToggleButton = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className={`theme-toggle-button ${isDarkMode ? 'theme-toggle-button--dark' : ''}`}
        >
            {/* 다크모드 수정 : 현재 모드에 따라 버튼 문구 변경 */}
            {isDarkMode ? '라이트모드' : '다크모드'}
        </button>
    );
};

export default ThemeToggleButton;