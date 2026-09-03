import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { API_BASE_URL } from "../config";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

type Teacher = {
    id: number;
    name: string;
    mail: string;
    id_state: number;
};

export default function Admin() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [allTeachers, setAllTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [processingId, setProcessingId] = useState<number | null>(null);

    const cargarSolicitudes = async () => {
        try {
            setLoading(true);
            setError("");

            const adminToken = localStorage.getItem("adminToken");

            if (!adminToken) {
                setError("No hay sesión de administrador");
                return;
            }

            const response = await fetch(
                `${API_BASE_URL}/admin/teachers/pending`,
                {
                    headers: {
                        Authorization: `Bearer ${adminToken}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Error al obtener solicitudes");
                return;
            }

            setTeachers(data.teachers);

        } catch (error) {
            console.error(error);
            setError("No se pudo conectar con el servidor");
        } finally {
            setLoading(false);
        }
    };

    const cargarProfesores = async () => {
        try {
            const adminToken = localStorage.getItem("adminToken");

            if (!adminToken) {
                setError("No hay sesión de administrador");
                return;
            }

            const response = await fetch(
                `${API_BASE_URL}/admin/teachers`,
                {
                    headers: {
                        Authorization: `Bearer ${adminToken}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Error al obtener profesores");
                return;
            }

            setAllTeachers(data.teachers);

        } catch (error) {
            console.error(error);
            setError("No se pudo conectar con el servidor");
        }
    };

    useEffect(() => {
        cargarSolicitudes();
        cargarProfesores();
    }, []);

    const procesarSolicitud = async (
        id: number,
        accion: "approve" | "reject"
    ) => {
        try {
            const adminToken = localStorage.getItem("adminToken");

            if (!adminToken) {
                setError("No hay sesión de administrador");
                return;
            }

            setProcessingId(id);
            setError("");

            const response = await fetch(
                `${API_BASE_URL}/admin/teachers/${id}/${accion}`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${adminToken}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Error al procesar solicitud");
                return;
            }

            setTeachers((actuales) =>
                actuales.filter((teacher) => teacher.id !== id)
            );

        } catch (error) {
            console.error(error);
            setError("No se pudo conectar con el servidor");
        } finally {
            setProcessingId(null);
        }
    };

    const cambiarEstado = async (
        id: number,
        id_state: number
    ) => {
        try {
            const adminToken = localStorage.getItem("adminToken");

            if (!adminToken) {
                setError("No hay sesión de administrador");
                return;
            }

            setProcessingId(id);
            setError("");

            const response = await fetch(
                `${API_BASE_URL}/admin/teachers/${id}/state`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${adminToken}`,
                    },
                    body: JSON.stringify({
                        id_state,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Error al cambiar estado");
                return;
            }

            setAllTeachers((actuales) =>
                actuales.map((teacher) =>
                    teacher.id === id
                        ? data.teacher
                        : teacher
                )
            );

            cargarSolicitudes();

        } catch (error) {
            console.error(error);
            setError("No se pudo conectar con el servidor");
        } finally {
            setProcessingId(null);
        }
    };

    const cerrarSesion = () => {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                px: 2,
                py: 4,
            }}
        >
            <Box sx={{ width: "100%", maxWidth: 500 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Panel de administración
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                    <Button variant="contained" onClick={cerrarSesion}>
                        Cerrar sesión
                    </Button>
                </Box>

                {loading && (
                    <Typography align="center">
                        Cargando solicitudes...
                    </Typography>
                )}

                {error && (
                    <Typography color="error" align="center" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}

                {!loading && !error && (
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "1fr 1fr",
                            },
                            gap: 4,
                            width: "100%",
                        }}
                    >
                        {/* IZQUIERDA: SOLICITUDES PENDIENTES */}
                        <Box>
                            <Typography variant="h6" align="center" gutterBottom>
                                Solicitudes pendientes
                            </Typography>

                            {teachers.length === 0 ? (
                                <Typography align="center">
                                    No hay solicitudes pendientes.
                                </Typography>
                            ) : (
                                <Stack spacing={2}>
                                    {teachers.map((teacher) => (
                                        <Box
                                            key={teacher.id}
                                            sx={{
                                                border: "1px solid",
                                                borderColor: "divider",
                                                borderRadius: 1,
                                                p: 2,
                                                textAlign: "center",
                                            }}
                                        >
                                            <Typography variant="h6">
                                                {teacher.name}
                                            </Typography>

                                            <Typography sx={{ mb: 2 }}>
                                                Correo: {teacher.mail}
                                            </Typography>

                                            <Stack
                                                direction="row"
                                                spacing={2}
                                                justifyContent="center"
                                            >
                                                <Button
                                                    variant="contained"
                                                    onClick={() =>
                                                        procesarSolicitud(
                                                            teacher.id,
                                                            "approve"
                                                        )
                                                    }
                                                    disabled={
                                                        processingId === teacher.id
                                                    }
                                                >
                                                    {processingId === teacher.id
                                                        ? "Procesando..."
                                                        : "Aceptar"}
                                                </Button>

                                                <Button
                                                    variant="contained"
                                                    onClick={() =>
                                                        procesarSolicitud(
                                                            teacher.id,
                                                            "reject"
                                                        )
                                                    }
                                                    disabled={
                                                        processingId === teacher.id
                                                    }
                                                >
                                                    {processingId === teacher.id
                                                        ? "Procesando..."
                                                        : "Rechazar"}
                                                </Button>
                                            </Stack>
                                        </Box>
                                    ))}
                                </Stack>
                            )}
                        </Box>

                        {/* DERECHA: TODOS LOS PROFESORES */}
                        <Box>
                            <Typography variant="h6" align="center" gutterBottom>
                                Profesores
                            </Typography>

                            {allTeachers.filter((teacher) => teacher.id_state !== 1).length === 0 ? (
                                <Typography align="center">
                                    No hay profesores registrados.
                                </Typography>
                            ) : (
                                <Stack spacing={2}>
                                    {allTeachers
                                        .filter((teacher) => teacher.id_state !== 1)
                                        .map((teacher) => (
                                        <Box
                                            key={teacher.id}
                                            sx={{
                                                border: "1px solid",
                                                borderColor: "divider",
                                                borderRadius: 1,
                                                p: 2,
                                                textAlign: "center",
                                            }}
                                        >
                                            <Typography variant="h6">
                                                {teacher.name}
                                            </Typography>

                                            <Typography sx={{ mb: 2 }}>
                                                Correo: {teacher.mail}
                                            </Typography>

                                            <FormControl fullWidth>
                                                <InputLabel>Estado</InputLabel>

                                                <Select
                                                    value={teacher.id_state}
                                                    label="Estado"
                                                    onChange={(e) =>
                                                        cambiarEstado(
                                                            teacher.id,
                                                            Number(e.target.value)
                                                        )
                                                    }
                                                    disabled={
                                                        processingId === teacher.id
                                                    }
                                                >
                                                    <MenuItem value={2}>
                                                        Aceptado
                                                    </MenuItem>

                                                    <MenuItem value={3}>
                                                        Rechazado
                                                    </MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Box>
                                    ))}
                                </Stack>
                            )}
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
}