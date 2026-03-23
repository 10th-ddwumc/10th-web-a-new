import clsx from "clsx";
import { THEME, useTheme } from "./context/ThemeProvider";

export default function ThemeContent() {

    const { theme, toggleTheme } = useTheme();

    const isLightmode = theme === THEME.LIGHT;

    return (
    <div
    className={clsx(
        'p-2 h-dvh w-full',
        isLightmode ? 'bg-white' : 'bg-gray-800'
    )}>
        <h1
        className={clsx(
            'text-wxl font-bold',
            isLightmode ? 'text-black' : 'text-white'
        )}>
            Themecontent
        </h1>
        <p className={clsx('mt-2', isLightmode ? 'text-black' : 'text-white')}>
          다크모드 라이트모드 
        </p>
    </div>
    );
}

