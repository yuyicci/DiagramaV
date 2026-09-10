import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ContrastIcon from "@mui/icons-material/Contrast";
import { useColorMode } from "../context/ColorModeContext";

export default function Header() {
    const { mode, toggleColorMode, isLocked } = useColorMode();

    return (
        <Box
            component="header"
            sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                px: 2,
                py: 1,
                bgcolor: mode === "light" ? "#294b80" : "#2E2E2E",
            }}
        >
            <IconButton
                onClick={toggleColorMode}
                disabled={isLocked}
                aria-label={
                    isLocked
                        ? "El modo oscuro no está disponible en esta página"
                        : "Cambiar modo claro/oscuro"
                }
                sx={{
                    color: mode === "light" ? "#000000" : "#FFFFFF",
                    "&.Mui-disabled": {
                        color:
                            mode === "light"
                                ? "rgba(0, 0, 0, 0.4)"
                                : "rgba(255, 255, 255, 0.4)",
                    },
                }}
            >
                <ContrastIcon />
            </IconButton>
        </Box>
    );
}