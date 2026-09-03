import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import BackButton from "../components/BackButton";
import { API_BASE_URL } from "../config";

export default function TeacherRegister() {

    const [name, setName] = useState("");
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const registrar = async (e: React.FormEvent) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if (!name.trim() || !mail.trim() || !password) {
            setError("Completa todos los campos");
            return;
        }

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${API_BASE_URL}/teachers/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: name.trim(),
                        mail: mail.trim(),
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.error || "No se pudo enviar la solicitud"
                );
                return;
            }

            setMessage(
                "Solicitud enviada correctamente. " +
                "Espera a que el administrador apruebe tu cuenta."
            );

            setName("");
            setMail("");
            setPassword("");
            setConfirmPassword("");

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
                onSubmit={registrar}
                sx={{ width: "100%", maxWidth: 400 }}
            >
                <Typography variant="h5" align="center" gutterBottom>
                    Registro de profesor
                </Typography>

                <Stack spacing={3} sx={{ mt: 3 }}>
                    <TextField
                        variant="standard"
                        label="Nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={Boolean(error)}
                        fullWidth
                        disabled={loading}
                    />

                    <TextField
                        variant="standard"
                        type="email"
                        label="Correo"
                        value={mail}
                        onChange={(e) => setMail(e.target.value)}
                        error={Boolean(error)}
                        fullWidth
                        disabled={loading}
                    />

                    <TextField
                        variant="standard"
                        type="password"
                        label="Contraseña (mínimo 8 caracteres)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={Boolean(error)}
                        fullWidth
                        disabled={loading}
                    />

                    <TextField
                        variant="standard"
                        type="password"
                        label="Confirmar contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={Boolean(error)}
                        helperText={error || " "}
                        fullWidth
                        disabled={loading}
                    />

                    {message && (
                        <Typography color="success.main" align="center">
                            {message}
                        </Typography>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        fullWidth
                    >
                        {loading ? "Enviando..." : "Enviar solicitud"}
                    </Button>

                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <BackButton to="/profesor" />
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
}