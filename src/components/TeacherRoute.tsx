import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

type Props = {
    children: React.ReactNode;
};

type Status = "checking" | "authenticated" | "unauthenticated" | "network-error";

export default function TeacherRoute({ children }: Props) {
    const [status, setStatus] = useState<Status>("checking");

    useEffect(() => {
        const verificarSesion = async () => {
            const token = localStorage.getItem("teacherToken");

            if (!token) {
                setStatus("unauthenticated");
                return;
            }

            try {
                const response = await fetch(
                    `${API_BASE_URL}/teachers/me`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.status === 401 || response.status === 403) {
                    // El backend rechazó el token explícitamente: ahí sí
                    // tiene sentido borrarlo y mandar a login.
                    localStorage.removeItem("teacherToken");
                    setStatus("unauthenticated");
                    return;
                }

                if (!response.ok) {
                    // Otro tipo de error del servidor (500, etc.): no
                    // sabemos si el token es válido, no lo borramos.
                    setStatus("network-error");
                    return;
                }

                setStatus("authenticated");

            } catch (error) {
                // Error de red/conexión: el token puede seguir siendo
                // válido, no lo borramos.
                console.error(error);
                setStatus("network-error");
            }
        };

        verificarSesion();
    }, []);

    if (status === "checking") {
        return <p>Verificando sesión...</p>;
    }

    if (status === "network-error") {
        return (
            <div>
                <p>No se pudo conectar con el servidor para verificar tu sesión.</p>
                <button onClick={() => window.location.reload()}>
                    Reintentar
                </button>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return <Navigate to="/" replace />;
    }

    return children;
}