import clsx from "clsx";
import { THEME, useTheme } from "./context/ThemeProvider";
import ThemeToggleButton from "./context/themeToggleButton";

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();

    const isLightmode = theme === THEME.LIGHT;

    return (
        <nav className={clsx(
            'p-4 w-full flex jusify-end',
            isLightmode ? 'bg-white' : 'bg-gray-800'
        )}>
            <ThemeToggleButton />
        </nav>
    );
}