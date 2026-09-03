import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function Home() {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                px: 2,
            }}
        >
            <Box sx={{ width: "100%", maxWidth: 400, textAlign: "center" }}>
                <Typography variant="h5" gutterBottom>
                    Diagrama V
                </Typography>

                <Typography sx={{ mb: 4 }}>
                    ¿Cómo quieres ingresar?
                </Typography>

                <Stack spacing={2}>
                    <Button
                        variant="contained"
                        onClick={() => navigate("/student")}
                        fullWidth
                    >
                        Alumno
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => navigate("/profesor")}
                        fullWidth
                    >
                        Profesor
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => navigate("/admin/login")}
                        fullWidth
                    >
                        Administrador
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => navigate("/diagramav/default")}
                        fullWidth
                    >
                        Ir al Diagrama V
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
}