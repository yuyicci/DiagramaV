import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import BackButton from "../components/BackButton";
import { API_BASE_URL } from "../config";

type ErrorResponse = {
    error?: string;
    details?: Record<string, string[] | undefined>;
};

function extraerMensajeError(data: ErrorResponse): string {
    if (data.details) {
        const mensajes = Object.values(data.details)
            .flat()
            .filter((mensaje): mensaje is string => Boolean(mensaje));

        if (mensajes.length > 0) {
            return mensajes.join(". ");
        }
    }

    return data.error || "No se pudo iniciar el informe";
}

export default function StudentStart() {
    const [code, setCode] = useState("");
    const [studentName, setStudentName] = useState("");
    const [studentMail, setStudentMail] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const comenzar = async (e: React.FormEvent) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const codigo = code.trim().toUpperCase();
            const nombre = studentName.trim();
            const mail = studentMail.trim();

            const response = await fetch(
                `${API_BASE_URL}/reports/start`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        code: codigo,
                        student_name: nombre,
                        student_mail: mail,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(extraerMensajeError(data));
                return;
            }

            const configResponse = await fetch(
                `${API_BASE_URL}/reports/config/${codigo}`
            );

            const configData = await configResponse.json();

            if (!configResponse.ok) {
                setError(
                    configData.error ||
                    "No se pudo obtener la configuración del profesor"
                );
                return;
            }

            localStorage.setItem("reportId", String(data.id));
            localStorage.setItem("reportCode", data.code);
            localStorage.setItem("studentName", data.student_name);
            localStorage.setItem("studentMail", data.student_mail);

            localStorage.setItem(
                "teacherReportConfig",
                JSON.stringify(configData)
            );

            navigate("/diagramav");

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
                onSubmit={comenzar}
                sx={{ width: "100%", maxWidth: 400 }}
            >
                <Typography variant="h5" align="center" gutterBottom>
                    Iniciar informe
                </Typography>

                <Stack spacing={3} sx={{ mt: 3 }}>
                    <TextField
                        variant="standard"
                        label="Código del profesor"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Ej: 7D2F0C5B"
                        inputProps={{ maxLength: 8 }}
                        error={Boolean(error)}
                        required
                        fullWidth
                        disabled={loading}
                    />

                    <TextField
                        variant="standard"
                        label="Nombre del alumno"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="Nombre completo"
                        error={Boolean(error)}
                        required
                        fullWidth
                        disabled={loading}
                    />

                    <TextField
                        variant="standard"
                        type="email"
                        label="Correo del alumno"
                        value={studentMail}
                        onChange={(e) => setStudentMail(e.target.value)}
                        placeholder="tucorreo@ejemplo.com"
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
                        {loading ? "Comprobando..." : "Comenzar informe"}
                    </Button>

                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <BackButton to="/" />
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
}