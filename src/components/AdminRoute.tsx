import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { API_BASE_URL } from "../config";

type Props = {
    children: ReactNode;
};

type Status = "loading" | "valid" | "invalid" | "network-error";

export default function AdminRoute({ children }: Props) {
    const [status, setStatus] = useState<Status>("loading");

    useEffect(() => {
        const adminToken = localStorage.getItem("adminToken");

        if (!adminToken) {
            setStatus("invalid");
            return;
        }

        fetch(`${API_BASE_URL}/admin/me`, {
            headers: {
                Authorization: `Bearer ${adminToken}`
            }
        })
            .then((response) => {
                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem("adminToken");
                    setStatus("invalid");
                    return;
                }

                if (!response.ok) {
                    setStatus("network-error");
                    return;
                }

                setStatus("valid");
            })
            .catch(() => {
                setStatus("network-error");
            });
    }, []);

    if (status === "loading") {
        return <p>Cargando...</p>;
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

    if (status === "invalid") {
        return <Navigate to="/admin/login" replace />;
    }

    return <>{children}</>;
}