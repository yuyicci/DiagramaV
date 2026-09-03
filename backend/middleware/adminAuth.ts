import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

export interface AuthenticatedAdminRequest extends Request {
    adminId?: number;
}

export const authenticateAdmin = (
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            error: "No autenticado"
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            error: "No autenticado"
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as {
            adminId: number;
            role: string;
        };

        if (decoded.role !== "admin") {
            return res.status(403).json({
                error: "Acceso denegado"
            });
        }

        req.adminId = decoded.adminId;

        next();

    } catch {
        return res.status(401).json({
            error: "Token inválido"
        });
    }
};