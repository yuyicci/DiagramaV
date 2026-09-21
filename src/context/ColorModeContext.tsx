import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

type ColorMode = "light" | "dark";

type ColorModeContextValue = {
    mode: ColorMode;
    toggleColorMode: () => void;
    isLocked: boolean;
};

const ColorModeContext = createContext<ColorModeContextValue | null>(null);

const STORAGE_KEY = "colorMode";

const RUTAS_MODO_CLARO_FORZADO = ["/diagramav", "/diagramav/default"];

function obtenerModoInicial(): ColorMode {
    const guardado = localStorage.getItem(STORAGE_KEY);

    if (guardado === "light" || guardado === "dark") {
        return guardado;
    }

    const prefiereOscuro = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

    return prefiereOscuro ? "dark" : "light";
}

export function ColorModeProvider({ children }: { children: ReactNode }) {
    const [mode, setMode] = useState<ColorMode>(obtenerModoInicial);
    const location = useLocation();

    const isLocked = RUTAS_MODO_CLARO_FORZADO.includes(location.pathname);
    const modoEfectivo: ColorMode = isLocked ? "light" : mode;

    const toggleColorMode = () => {
        if (isLocked) {
            return;
        }

        setMode((modoActual) => {
            const nuevoModo = modoActual === "light" ? "dark" : "light";
            localStorage.setItem(STORAGE_KEY, nuevoModo);
            return nuevoModo;
        });
    };

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: modoEfectivo,
                },
            }),
        [modoEfectivo]
    );

    return (
        <ColorModeContext.Provider
            value={{ mode: modoEfectivo, toggleColorMode, isLocked }}
        >
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export function useColorMode() {
    const context = useContext(ColorModeContext);

    if (!context) {
        throw new Error(
            "useColorMode debe usarse dentro de un ColorModeProvider"
        );
    }

    return context;
}