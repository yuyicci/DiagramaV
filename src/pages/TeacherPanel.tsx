import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { API_BASE_URL } from "../config";

type Teacher = {
    id: number;
    name: string;
    mail: string;
    logo: string | null;
    text_1: string | null;
    text_2: string | null;
    id_state: number;
};

type Report = {
    id: number;
    student_name: string;
    student_mail: string;
    date: string;
    id_code: number;
    downloaded_at: string | null;
    code: string;
    active: boolean;
};

export default function TeacherPanel() {
    const [teacher, setTeacher] = useState<Teacher | null>(null);

    const [logo, setLogo] = useState("");
    const [text1, setText1] = useState("");
    const [text2, setText2] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [code, setCode] = useState("");
    const [codeLoading, setCodeLoading] = useState(true);

    const [reports, setReports] = useState<Report[]>([]);
    const [reportsLoading, setReportsLoading] = useState(true);
    const [reportsPage, setReportsPage] = useState(1);
    const [reportsTotalPages, setReportsTotalPages] = useState(1);

    useEffect(() => {
        cargarProfesor();
        cargarCodigo();
    }, []);

    useEffect(() => {
        cargarInformes(reportsPage);
    }, [reportsPage]);

    const cargarProfesor = async () => {
        try {
            const token = localStorage.getItem("teacherToken");

            if (!token) {
                setError("No hay sesión de profesor");
                return;
            }

            const response = await fetch(
                `${API_BASE_URL}/teachers/me`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Error al obtener los datos");
                return;
            }

            setTeacher(data);

            setLogo(data.logo ?? "");
            setText1(data.text_1 ?? "");
            setText2(data.text_2 ?? "");

        } catch (error) {
            console.error(error);
            setError("No se pudo conectar con el servidor");
        } finally {
            setLoading(false);
        }
    };

    const guardarCambios = async () => {
        try {
            setSaving(true);
            setError("");
            setMessage("");

            const token = localStorage.getItem("teacherToken");

            if (!token) {
                setError("No hay sesión de profesor");
                return;
            }

            const response = await fetch(
                `${API_BASE_URL}/teachers/me`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        logo,
                        text_1: text1,
                        text_2: text2,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Error al guardar");
                return;
            }

            setTeacher(data);

            setLogo(data.logo ?? "");
            setText1(data.text_1 ?? "");
            setText2(data.text_2 ?? "");

            setMessage("Cambios guardados correctamente");

        } catch (error) {
            console.error(error);
            setError("No se pudo conectar con el servidor");
        } finally {
            setSaving(false);
        }
    };

    const cargarCodigo = async () => {
        try {
            const token = localStorage.getItem("teacherToken");

            if (!token) {
                setError("No hay sesión de profesor");
                return;
            }

            const response = await fetch(
                `${API_BASE_URL}/codes/me`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.status === 404) {
                setCode("");
                return;
            }

            if (!response.ok) {
                setError(data.error || "Error al obtener el código");
                return;
            }

            setCode(data.code);

        } catch (error) {
            console.error(error);
            setError("No se pudo obtener el código");
        } finally {
            setCodeLoading(false);
        }
    };

    const cargarInformes = async (page: number) => {
        try {
            const token = localStorage.getItem("teacherToken");

            if (!token) {
                setError("No hay sesión de profesor");
                return;
            }

            const response = await fetch(
                `${API_BASE_URL}/teachers/reports?page=${page}&pageSize=10`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Error al obtener los informes");
                return;
            }

            setReports(data.reports);
            setReportsTotalPages(data.totalPages);

        } catch (error) {
            console.error(error);
            setError("No se pudieron cargar los informes");
        } finally {
            setReportsLoading(false);
        }
    };

    const generarCodigo = async () => {
        try {
            setError("");

            const token = localStorage.getItem("teacherToken");

            if (!token) {
                setError("No hay sesión de profesor");
                return;
            }

            const response = await fetch(
                `${API_BASE_URL}/codes`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Error al generar el código");
                return;
            }

            setCode(data.code);

        } catch (error) {
            console.error(error);
            setError("No se pudo generar el código");
        }
    };

    const cerrarSesion = () => {
        localStorage.removeItem("teacherToken");
        window.location.href = "/teacher/login";
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Typography>Cargando...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ px: 3, py: 4 }}>
            <Typography variant="h5" align="center" gutterBottom>
                Configuración del informe
            </Typography>

            {teacher && (
                <Typography align="center" sx={{ mb: 1 }}>
                    Profesor: <strong>{teacher.name}</strong>
                </Typography>
            )}

            {error && (
                <Typography color="error" align="center" sx={{ mb: 1 }}>
                    {error}
                </Typography>
            )}

            {message && (
                <Typography color="success.main" align="center" sx={{ mb: 1 }}>
                    {message}
                </Typography>
            )}

            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 4,
                    mt: 3,
                    maxWidth: 1100,
                    mx: "auto",
                }}
            >
                {/* Columna izquierda: configuración del profesor */}
                <Box sx={{ flex: "1 1 0", minWidth: 0 }}>
                    <Stack spacing={3}>
                        <Box sx={{ textAlign: "center" }}>
                            <Typography variant="h6" gutterBottom>
                                Logo
                            </Typography>

                            <Button variant="contained" component="label">
                                Subir logo
                                <input
                                    type="file"
                                    hidden
                                    accept="image/png,image/jpeg,image/webp"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];

                                        if (!file) return;

                                        const reader = new FileReader();

                                        reader.onload = () => {
                                            setLogo(reader.result as string);
                                        };

                                        reader.readAsDataURL(file);
                                    }}
                                />
                            </Button>

                            {logo && (
                                <Box sx={{ mt: 2 }}>
                                    <img
                                        src={logo}
                                        alt="Logo"
                                        style={{
                                            maxWidth: "200px",
                                            maxHeight: "150px",
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>

                        <TextField
                            variant="standard"
                            label="Texto 1"
                            value={text1}
                            onChange={(e) => setText1(e.target.value)}
                            multiline
                            rows={3}
                            fullWidth
                        />

                        <TextField
                            variant="standard"
                            label="Texto 2"
                            value={text2}
                            onChange={(e) => setText2(e.target.value)}
                            multiline
                            rows={3}
                            fullWidth
                        />

                        <Button
                            variant="contained"
                            onClick={guardarCambios}
                            disabled={saving}
                            fullWidth
                        >
                            {saving ? "Guardando..." : "Guardar cambios"}
                        </Button>

                        <Divider />

                        <Box sx={{ textAlign: "center" }}>
                            <Typography variant="h6" gutterBottom>
                                Código del informe
                            </Typography>

                            {codeLoading ? (
                                <Typography>Cargando código...</Typography>
                            ) : code ? (
                                <Stack spacing={2} alignItems="center">
                                    <Typography
                                        sx={{
                                            fontSize: 28,
                                            fontWeight: "bold",
                                            letterSpacing: 4,
                                        }}
                                    >
                                        {code}
                                    </Typography>

                                    <Button
                                        variant="contained"
                                        onClick={generarCodigo}
                                    >
                                        Generar nuevo código
                                    </Button>
                                </Stack>
                            ) : (
                                <Stack spacing={2} alignItems="center">
                                    <Typography>
                                        No tienes un código activo.
                                    </Typography>

                                    <Button
                                        variant="contained"
                                        onClick={generarCodigo}
                                    >
                                        Generar código
                                    </Button>
                                </Stack>
                            )}
                        </Box>

                        <Divider />

                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <Button variant="contained" onClick={cerrarSesion}>
                                Cerrar sesión
                            </Button>
                        </Box>
                    </Stack>
                </Box>

                {/* Divisor vertical, solo visible en pantallas medianas/grandes */}
                <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ display: { xs: "none", md: "block" } }}
                />

                {/* Columna derecha: informes */}
                <Box sx={{ flex: "1 1 0", minWidth: 0 }}>
                    <Typography variant="h6" align="center" gutterBottom>
                        Mis informes
                    </Typography>

                    {reportsLoading ? (
                        <Typography align="center">
                            Cargando informes...
                        </Typography>
                    ) : reports.length === 0 ? (
                        <Typography align="center">
                            Todavía no tienes informes.
                        </Typography>
                    ) : (
                        <Stack spacing={2}>
                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Button
                                    variant="contained"
                                    onClick={() =>
                                        setReportsPage((p) => Math.max(1, p - 1))
                                    }
                                    disabled={reportsPage <= 1}
                                >
                                    Anterior
                                </Button>

                                <Typography>
                                    Página {reportsPage} de {reportsTotalPages}
                                </Typography>

                                <Button
                                    variant="contained"
                                    onClick={() =>
                                        setReportsPage((p) =>
                                            Math.min(reportsTotalPages, p + 1)
                                        )
                                    }
                                    disabled={reportsPage >= reportsTotalPages}
                                >
                                    Siguiente
                                </Button>
                            </Stack>

                            {reports.map((report) => (
                                <Box
                                    key={report.id}
                                    sx={{
                                        border: "1px solid",
                                        borderColor: "divider",
                                        borderRadius: 1,
                                        p: 2,
                                    }}
                                >
                                    <Typography>
                                        <strong>Alumno:</strong>{" "}
                                        {report.student_name}
                                    </Typography>

                                    <Typography>
                                        <strong>Correo:</strong>{" "}
                                        {report.student_mail}
                                    </Typography>

                                    <Typography>
                                        <strong>Fecha:</strong>{" "}
                                        {new Date(report.date).toLocaleDateString()}
                                    </Typography>

                                    <Typography>
                                        <strong>Código:</strong>{" "}
                                        {report.code}
                                    </Typography>

                                    <Typography>
                                        <strong>PDF descargado:</strong>{" "}
                                        {report.downloaded_at
                                            ? new Date(
                                                  report.downloaded_at
                                              ).toLocaleString()
                                            : "Aún no"}
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>
                    )}
                </Box>
            </Box>
        </Box>
    );
}