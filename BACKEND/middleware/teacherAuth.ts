import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import pool from "../database.js";

export interface AuthenticatedRequest extends Request {
    teacherId?: number;
}

export async function authenticateTeacher(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const authorization = req.headers.authorization;

        if (!authorization) {
            return res.status(401).json({
                error: "No autenticado"
            });
        }

        const [type, token] = authorization.split(" ");

        if (type !== "Bearer" || !token) {
            return res.status(401).json({
                error: "Token inválido"
            });
        }

        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            console.error("JWT_SECRET no está configurado");

            return res.status(500).json({
                error: "Error interno del servidor"
            });
        }

        const payload = jwt.verify(token, jwtSecret);

        if (
            typeof payload !== "object" ||
            payload === null ||
            typeof payload.teacherId !== "number"
        ) {
            return res.status(401).json({
                error: "Token inválido"
            });
        }

        const resultado = await pool.query(
            'SELECT id_state FROM "Teacher" WHERE id = $1',
            [payload.teacherId]
        );

        if (
            resultado.rows.length === 0 ||
            resultado.rows[0].id_state !== 2
        ) {
            return res.status(403).json({
                error: "La cuenta ya no está habilitada"
            });
        }

        req.teacherId = payload.teacherId;

        next();

    } catch (error) {
        return res.status(401).json({
            error: "Token inválido o expirado"
        });
    }
}