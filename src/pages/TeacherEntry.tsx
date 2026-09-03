import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import BackButton from "../components/BackButton";

export default function TeacherEntry() {
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
                    Acceso de profesor
                </Typography>

                <Stack spacing={2} sx={{ mt: 3 }}>
                    <Button
                        variant="contained"
                        onClick={() => navigate("/teacher/login")}
                        fullWidth
                    >
                        Iniciar sesión
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => navigate("/teacher/register")}
                        fullWidth
                    >
                        Registrarse
                    </Button>

                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <BackButton to="/" />
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
}