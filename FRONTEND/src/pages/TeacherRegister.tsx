import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import BackButton from "../components/BackButton";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import PersonIcon from "@mui/icons-material/Person";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import HttpsIcon from "@mui/icons-material/Https";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { API_BASE_URL } from "../config";

export default function TeacherRegister() {

    const [name, setName] = useState("");
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
                height: "100%",
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
                        variant="outlined"
                        label="Nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={Boolean(error)}
                        fullWidth
                        disabled={loading}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        variant="outlined"
                        type="email"
                        label="Correo"
                        value={mail}
                        onChange={(e) => setMail(e.target.value)}
                        error={Boolean(error)}
                        fullWidth
                        disabled={loading}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AlternateEmailIcon />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        variant="outlined"
                        type={showPassword ? "text" : "password"}
                        label="Contraseña (Mínimo 8 caracteres)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={Boolean(error)}
                        fullWidth
                        disabled={loading}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <HttpsIcon />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() =>
                                            setShowPassword((v) => !v)
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Ocultar contraseña"
                                                : "Mostrar contraseña"
                                        }
                                        edge="end"
                                    >
                                        {showPassword ? (
                                            <VisibilityIcon />
                                        ) : (
                                            <VisibilityOffIcon />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        variant="outlined"
                        type={showConfirmPassword ? "text" : "password"}
                        label="Confirmar contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={Boolean(error)}
                        helperText={error || " "}
                        fullWidth
                        disabled={loading}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <HttpsIcon />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() =>
                                            setShowConfirmPassword((v) => !v)
                                        }
                                        aria-label={
                                            showConfirmPassword
                                                ? "Ocultar contraseña"
                                                : "Mostrar contraseña"
                                        }
                                        edge="end"
                                    >
                                        {showConfirmPassword ? (
                                            <VisibilityIcon />
                                        ) : (
                                            <VisibilityOffIcon />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
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