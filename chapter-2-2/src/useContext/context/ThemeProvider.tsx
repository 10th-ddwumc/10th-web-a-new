import { createContext, useContext, useState, type JSX, type PropsWithChildren } from "react";

export const THEME = {
    LIGHT: 'LIGHT',
    DARK: 'DARK',
} as const;

type TTheme = typeof THEME[keyof typeof THEME];

interface IThemeContextState {
    theme: TTheme
    toggleTheme: () => void;
}


export const ThemeContext = createContext< IThemeContextState | undefined>(undefined);

export const ThemeProvider=({children}:PropsWithChildren):JSX.Element =>{
    const [theme,setTheme] = useState<TTheme>(THEME.LIGHT);
    const toggleTheme = (): void => {
        setTheme((prevTheme):THEME => 
        prevTheme == THEME.LIGHT ? THEME.DARK : THEME.LIGHT);
    };
    
    return <ThemeContext.Provider value={{theme,toggleTheme}}>
        {children}</ThemeContext.Provider>;
};

export const useTheme = (): IThemeContextState  => {
    const context = useContext(ThemeContext);

    if(!context){
        throw new Error ('useTheme must be used within a ThemeProvider');
    }

    return context;
};