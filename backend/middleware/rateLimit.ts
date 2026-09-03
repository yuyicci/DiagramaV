import rateLimit from "express-rate-limit";

// Para /teachers/login y /admin/login: pocos intentos permitidos,
// pensado para frenar fuerza bruta sobre contraseñas.
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "Demasiados intentos de inicio de sesión. Intenta de nuevo más tarde."
    }
});

// Para /teachers/register: más laxo, solo para evitar spam de solicitudes.
export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "Demasiadas solicitudes de registro. Intenta de nuevo más tarde."
    }
});

// Para /reports/start y /reports: son endpoints públicos (sin login), así
// que necesitan su propio límite para evitar spam de filas de Report.
export const publicReportLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "Demasiadas solicitudes. Intenta de nuevo más tarde."
    }
});