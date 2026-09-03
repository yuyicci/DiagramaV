import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import BackButton from "../components/BackButton";
import { API_BASE_URL } from "../config";

export default function Login() {
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const iniciarSesion = async (e: React.FormEvent) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                `${API_BASE_URL}/teachers/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        mail,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Error al iniciar sesión");
                return;
            }

            // Guardamos el JWT del profesor
            localStorage.setItem("teacherToken", data.token);

            // Entramos al panel del profesor
            navigate("/teacher");

        } catch (error) {
            console.error(error);
            setError("No se pudo conectar con el servidor");
        } finally {
            setLoading(false);
        }
    };

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
            <Box
                component="form"
                onSubmit={iniciarSesion}
                sx={{ width: "100%", maxWidth: 400 }}
            >
                <Typography variant="h5" align="center" gutterBottom>
                    Inicio de sesión
                </Typography>

                <Stack spacing={3} sx={{ mt: 3 }}>
                    <TextField
                        variant="standard"
                        type="email"
                        label="Correo"
                        value={mail}
                        onChange={(e) => setMail(e.target.value)}
                        error={Boolean(error)}
                        required
                        fullWidth
                        disabled={loading}
                    />

                    <TextField
                        variant="standard"
                        type="password"
                        label="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={Boolean(error)}
                        helperText={error || " "}
                        required
                        fullWidth
                        disabled={loading}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        fullWidth
                    >
                        {loading ? "Ingresando..." : "Iniciar sesión"}
                    </Button>

                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <BackButton to="/profesor" />
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
}