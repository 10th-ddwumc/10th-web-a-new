import clsx from "clsx";
import { THEME, useTheme } from "./ThemeProvider";

export default function ThemeToggleButton() {
    const {theme, toggleTheme} = useTheme();

    const isLightmode = theme == THEME.LIGHT;
    
    return <button
    onClick={toggleTheme}
    className={clsx('px-4 py-2 mt-4 rounded-md transition-all border', {
        'bg-black text-white': !isLightmode,
        'bg-white text-black': isLightmode,
    })}>
        {isLightmode ? '다크모드' : '라이트모드'}
    </button>;
}