import crypto from "node:crypto";

import argon2 from "argon2";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import jwt from "jsonwebtoken";
import multer from "multer";

import {
    authenticateAdmin,
    type AuthenticatedAdminRequest,
} from "./middleware/adminAuth.js";

import {
    authenticateTeacher,
    type AuthenticatedRequest,
} from "./middleware/teacherAuth.js";

import {
    loginLimiter,
    publicReportLimiter,
    registerLimiter,
} from "./middleware/rateLimit.js";

import { updateCodeSchema } from "./schemas/code.js";

import {
    createReportSchema,
    registerDownloadSchema,
} from "./schemas/report.js";

import {
    loginTeacherSchema,
    registerTeacherSchema,
    updateTeacherSchema,
} from "./schemas/teacher.js";

import pool from "./database.js";

const app = express();

if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});



const frontendUrl = process.env.FRONTEND_URL;

if (!frontendUrl) {
    console.error("FRONTEND_URL no está configurado");
    process.exit(1);
}

app.use(helmet());

app.use(cors({
    origin: frontendUrl
}));

app.use(express.json({ limit: "6mb" }));

app.get("/", (req, res) => {
    res.send("Backend funcionando");
});

app.get("/states", async (req, res) => {

    try {

        const resultado = await pool.query(
            'SELECT * FROM "State"'
        );

        res.json(resultado.rows);

    } catch(error) {

        console.error(error);
        res.status(500).json({
            error: "Error al consultar la base de datos"
        });

    }

});

app.get(
    "/teachers/me",
    authenticateTeacher,
    async (req: AuthenticatedRequest, res) => {
        try {
            const resultado = await pool.query(
                `SELECT
                    id,
                    name,
                    mail,
                    logo,
                    text_1,
                    text_2,
                    id_state
                 FROM "Teacher"
                 WHERE id = $1`,
                [req.teacherId]
            );

            if (resultado.rows.length === 0) {
                return res.status(404).json({
                    error: "Profesor no encontrado"
                });
            }

            return res.json(resultado.rows[0]);

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                error: "Error interno del servidor"
            });
        }
    }
);

app.get(
    "/admin/me",
    authenticateAdmin,
    async (req: AuthenticatedAdminRequest, res) => {
        try {
            const resultado = await pool.query(
                `SELECT
                    id,
                    name,
                    mail
                 FROM "Admin"
                 WHERE id = $1`,
                [req.adminId]
            );

            if (resultado.rows.length === 0) {
                return res.status(404).json({
                    error: "Administrador no encontrado"
                });
            }

            return res.json(resultado.rows[0]);

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                error: "Error interno del servidor"
            });
        }
    }
);

app.get(
    "/admin/teachers/pending",
    authenticateAdmin,
    async (req: AuthenticatedAdminRequest, res) => {
        try {
            const page = Math.max(
                1,
                Number.parseInt(String(req.query.page ?? "1"), 10) || 1
            );

            const pageSize = Math.min(
                100,
                Math.max(
                    1,
                    Number.parseInt(String(req.query.pageSize ?? "20"), 10) || 20
                )
            );

            const offset = (page - 1) * pageSize;

            const totalResultado = await pool.query(
                `SELECT COUNT(*) AS total
                FROM "Teacher" t
                WHERE t.id_state = 1`
            );

            const total = Number(totalResultado.rows[0].total);

            const resultado = await pool.query(
                `SELECT
                    t.id,
                    t.name,
                    t.mail,
                    t.id_state
                FROM "Teacher" t
                WHERE t.id_state = 1
                ORDER BY t.id ASC
                LIMIT $1
                OFFSET $2`,
                [pageSize, offset]
            );

            return res.json({
                teachers: resultado.rows,
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize) || 1
            });

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                error: "Error al obtener las solicitudes"
            });
        }
    }
);

app.get(
    "/admin/teachers",
    authenticateAdmin,
    async (req: AuthenticatedAdminRequest, res) => {
        try {
            const resultado = await pool.query(
                `SELECT
                    t.id,
                    t.name,
                    t.mail,
                    t.id_state
                 FROM "Teacher" t
                 ORDER BY t.id ASC`
            );

            return res.json({
                teachers: resultado.rows
            });

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                error: "Error al obtener los profesores"
            });
        }
    }
);

app.get(
    "/codes/me",
    authenticateTeacher,
    async (req: AuthenticatedRequest, res) => {
        try {
            const teacherId = req.teacherId;

            const resultado = await pool.query(
                `SELECT
                    id,
                    code,
                    active,
                    creation_date,
                    id_teacher
                 FROM "Code"
                 WHERE id_teacher = $1
                   AND active = true
                 ORDER BY id DESC
                 LIMIT 1`,
                [teacherId]
            );

            if (resultado.rows.length === 0) {
                return res.status(404).json({
                    error: "El profesor no tiene un código activo"
                });
            }

            return res.status(200).json(resultado.rows[0]);

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                error: "Error al consultar el código"
            });
        }
    }
);

app.get(
    "/teachers/reports",
    authenticateTeacher,
    async (req: AuthenticatedRequest, res) => {
        try {
            const teacherId = req.teacherId;

            const page = Math.max(
                1,
                Number.parseInt(String(req.query.page ?? "1"), 10) || 1
            );

            const pageSize = Math.min(
                100,
                Math.max(
                    1,
                    Number.parseInt(String(req.query.pageSize ?? "20"), 10) || 20
                )
            );

            const offset = (page - 1) * pageSize;

            const totalResultado = await pool.query(
                `SELECT COUNT(*) AS total
                FROM "Report" r
                INNER JOIN "Code" c
                    ON r.id_code = c.id
                WHERE c.id_teacher = $1`,
                [teacherId]
            );

            const total = Number(totalResultado.rows[0].total);

            const resultado = await pool.query(
                `SELECT
                    r.id,
                    s.name AS student_name,
                    s.mail AS student_mail,
                    r.date,
                    r.id_code,
                    r.downloaded_at,
                    c.code,
                    c.active
                FROM "Report" r
                INNER JOIN "Code" c
                    ON r.id_code = c.id
                INNER JOIN "Student" s
                    ON r.id_student = s.id
                WHERE c.id_teacher = $1
                ORDER BY r.id DESC
                LIMIT $2
                OFFSET $3`,
                [teacherId, pageSize, offset]
            );

            return res.status(200).json({
                reports: resultado.rows,
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize) || 1
            });

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                error: "Error al consultar los informes"
            });
        }
    }
);

app.post("/teachers/register", registerLimiter, async (req, res) => {
    try {
        const resultado = registerTeacherSchema.safeParse(req.body);

        if (!resultado.success) {
            return res.status(400).json({
                error: "Datos inválidos",
                details: resultado.error.flatten().fieldErrors
            });
        }

        const { name, mail, password } = resultado.data;

        const teacherExistente = await pool.query(
            'SELECT id FROM "Teacher" WHERE mail = $1',
            [mail]
        );

        if (teacherExistente.rows.length === 0) {
            const passwordHash = await argon2.hash(password);

            try {
                await pool.query(
                    `INSERT INTO "Teacher"
                    (name, mail, password_hash, id_state)
                    VALUES ($1, $2, $3, $4)`,
                    [name, mail, passwordHash, 1]
                );
            } catch (insertError) {
                // 23505 = unique_violation en Postgres. Puede pasar si
                // dos registros con el mismo mail llegaron casi al mismo
                // tiempo y ambos pasaron el SELECT de arriba antes de que
                // el otro terminara su INSERT. No es un error real del
                // servidor, es el caso esperado de "ya existía": lo
                // absorbemos en silencio para no revelar el duplicado.
                if (
                    !(
                        insertError &&
                        typeof insertError === "object" &&
                        "code" in insertError &&
                        insertError.code === "23505"
                    )
                ) {
                    throw insertError;
                }
            }
        }

        // Respuesta idéntica exista o no el mail, para no revelar
        // qué correos ya están registrados (evita user enumeration).
        return res.status(201).json({
            message: "Si los datos son válidos, tu solicitud fue registrada. Espera la aprobación del administrador."
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

app.get("/reports/config/:code", async (req, res) => {
    try {
        const { code } = req.params;

        const resultado = await pool.query(
            `SELECT
                t.logo,
                t.text_1,
                t.text_2
             FROM "Code" c
             INNER JOIN "Teacher" t
                ON c.id_teacher = t.id
             WHERE c.code = $1
               AND c.active = true
               AND t.id_state = 2`,
            [code]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                error: "Código no encontrado"
            });
        }

        return res.status(200).json({
            logo: resultado.rows[0].logo,
            text_1: resultado.rows[0].text_1,
            text_2: resultado.rows[0].text_2
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Error al obtener la configuración del informe"
        });
    }
});

app.post("/teachers/login", loginLimiter, async (req, res) => {
    try {
        const resultado = loginTeacherSchema.safeParse(req.body);

        if (!resultado.success) {
            return res.status(400).json({
                error: "Datos inválidos"
            });
        }

        const { mail, password } = resultado.data;

        const resultadoTeacher = await pool.query(
            `SELECT
                t.id,
                t.name,
                t.mail,
                t.password_hash,
                t.id_state,
                s.name AS state_name
             FROM "Teacher" t
             INNER JOIN "State" s ON t.id_state = s.id
             WHERE t.mail = $1`,
            [mail]
        );

        if (resultadoTeacher.rows.length === 0) {
            return res.status(401).json({
                error: "Correo o contraseña incorrectos"
            });
        }

        const teacher = resultadoTeacher.rows[0];

        const passwordCorrecta = await argon2.verify(
            teacher.password_hash,
            password
        );

        if (!passwordCorrecta) {
            return res.status(401).json({
                error: "Correo o contraseña incorrectos"
            });
        }

        if (teacher.id_state !== 2) {
            return res.status(403).json({
                error: `La cuenta está ${teacher.state_name.toLowerCase()}`
            });
        }

        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            console.error("JWT_SECRET no está configurado");

            return res.status(500).json({
                error: "Error interno del servidor"
            });
        }

        const token = jwt.sign(
            {
                teacherId: teacher.id
            },
            jwtSecret,
            {
                expiresIn: "1h"
            }
        );

        return res.status(200).json({
            message: "Inicio de sesión exitoso",
            token
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

app.post(
    "/codes",
    authenticateTeacher,
    async (req: AuthenticatedRequest, res) => {
        try {
            const teacherId = req.teacherId;

            // Desactivar el código activo anterior
            await pool.query(
                `UPDATE "Code"
                 SET active = false
                 WHERE id_teacher = $1
                   AND active = true`,
                [teacherId]
            );

            // Generar un código único
            let code: string;
            let existe = true;

            while (existe) {
                code = crypto
                    .randomBytes(4)
                    .toString("hex")
                    .toUpperCase();

                const resultado = await pool.query(
                    `SELECT id
                     FROM "Code"
                     WHERE code = $1`,
                    [code]
                );

                existe = resultado.rows.length > 0;
            }

            // Crear el nuevo código activo
            const resultado = await pool.query(
                `INSERT INTO "Code"
                    (code, active, creation_date, id_teacher)
                 VALUES
                    ($1, true, CURRENT_DATE, $2)
                 RETURNING
                    id,
                    code,
                    active,
                    creation_date,
                    id_teacher`,
                [code!, teacherId]
            );

            return res.status(201).json(resultado.rows[0]);

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                error: "Error al generar el código"
            });
        }
    }
);

app.post("/reports", publicReportLimiter, upload.single("pdf"), async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    error: "El PDF es obligatorio"
                });
            }

            if (req.file.mimetype !== "application/pdf") {
                return res.status(400).json({
                    error: "El archivo debe ser un PDF"
                });
            }

            const firmaPdf = req.file.buffer.subarray(0, 5).toString("ascii");

            if (firmaPdf !== "%PDF-") {
                return res.status(400).json({
                    error: "El archivo no es un PDF válido"
                });
            }

            const resultado = registerDownloadSchema.safeParse(req.body);

            if (!resultado.success) {
                return res.status(400).json({
                    error: "Datos inválidos",
                    details: resultado.error.flatten().fieldErrors
                });
            }

                        const {
                report_id,
                code,
                student_mail
            } = resultado.data;

            const codigoResultado = await pool.query(
                `SELECT
                    id,
                    code,
                    active
                 FROM "Code"
                 WHERE code = $1`,
                [code]
            );

            if (codigoResultado.rows.length === 0) {
                return res.status(404).json({
                    error: "Código no encontrado"
                });
            }

            const codigo = codigoResultado.rows[0];

            if (!codigo.active) {
                return res.status(403).json({
                    error: "El código ya no está activo"
                });
            }

            const reportResultado = await pool.query(
                `UPDATE "Report" r
                 SET downloaded_at = NOW()
                 FROM "Student" s
                 WHERE r.id = $1
                   AND r.id_code = $2
                   AND r.id_student = s.id
                   AND s.mail = $3
                 RETURNING
                    r.id,
                    s.name AS student_name,
                    s.mail AS student_mail,
                    r.date,
                    r.id_code,
                    r.downloaded_at`,
                [
                    report_id,
                    codigo.id,
                    student_mail
                ]
            );

            if (reportResultado.rows.length === 0) {
                return res.status(404).json({
                    error: "Informe no encontrado"
                });
            }

            return res.status(200).json(
                reportResultado.rows[0]
            );

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                error: "Error interno del servidor"
            });
        }
    }
);

app.post("/admin/login", loginLimiter, async (req, res) => {
    try {
        const { mail, password } = req.body;

        if (
            typeof mail !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                error: "Datos inválidos"
            });
        }

        const resultado = await pool.query(
            `SELECT
                id,
                name,
                mail,
                password_hash
             FROM "Admin"
             WHERE mail = $1`,
            [mail]
        );

        if (resultado.rows.length === 0) {
            return res.status(401).json({
                error: "Correo o contraseña incorrectos"
            });
        }

        const admin = resultado.rows[0];

        const passwordCorrecta = await argon2.verify(
            admin.password_hash,
            password
        );

        if (!passwordCorrecta) {
            return res.status(401).json({
                error: "Correo o contraseña incorrectos"
            });
        }

        const token = jwt.sign(
            {
                adminId: admin.id,
                role: "admin"
            },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "2h"
            }
        );

        return res.json({
            token,
            admin: {
                id: admin.id,
                name: admin.name,
                mail: admin.mail
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

app.post("/reports/start", publicReportLimiter, async (req, res) => {
    try {
        const resultado = createReportSchema.safeParse(req.body);

        if (!resultado.success) {
            return res.status(400).json({
                error: "Datos inválidos",
                details: resultado.error.flatten().fieldErrors
            });
        }

        const codigo = resultado.data.code.toUpperCase();
        const nombre = resultado.data.student_name;
        const mail = resultado.data.student_mail;

        const resultadoCode = await pool.query(
            `SELECT
                id,
                code,
                active,
                id_teacher
             FROM "Code"
             WHERE code = $1`,
            [codigo]
        );

        if (resultadoCode.rows.length === 0) {
            return res.status(404).json({
                error: "El código no existe"
            });
        }

        const codigoDB = resultadoCode.rows[0];

        if (!codigoDB.active) {
            return res.status(403).json({
                error: "El código está inactivo"
            });
        }

        const resultadoStudent = await pool.query(
            'SELECT id FROM "Student" WHERE mail = $1',
            [mail]
        );

        let studentId: number;

        if (resultadoStudent.rows.length > 0) {
            studentId = resultadoStudent.rows[0].id;

            await pool.query(
                'UPDATE "Student" SET name = $1 WHERE id = $2',
                [nombre, studentId]
            );
        } else {
            const nuevoStudent = await pool.query(
                `INSERT INTO "Student" (name, mail)
                 VALUES ($1, $2)
                 RETURNING id`,
                [nombre, mail]
            );

            studentId = nuevoStudent.rows[0].id;
        }

        const resultadoReport = await pool.query(
            `INSERT INTO "Report"
                (date, id_code, id_student)
            VALUES
                (CURRENT_DATE, $1, $2)
            RETURNING
                id,
                date,
                id_code`,
            [
                codigoDB.id,
                studentId
            ]
        );

        return res.status(201).json({
            id: resultadoReport.rows[0].id,
            code: codigoDB.code,
            student_name: nombre,
            student_mail: mail,
            date: resultadoReport.rows[0].date,
            id_code: resultadoReport.rows[0].id_code
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Error al iniciar el informe"
        });
    }
});

app.patch(
    "/teachers/me",
    authenticateTeacher,
    async (req: AuthenticatedRequest, res) => {
        try {
            const resultado = updateTeacherSchema.safeParse(req.body);

            if (!resultado.success) {
                return res.status(400).json({
                    error: "Datos inválidos",
                    details: resultado.error.flatten().fieldErrors
                });
            }

            const { logo, text_1, text_2 } = resultado.data;

            const campos: string[] = [];
            const valores: unknown[] = [];
            let posicion = 1;

            if (logo !== undefined) {
                campos.push(`"logo" = $${posicion++}`);
                valores.push(logo);
            }

            if (text_1 !== undefined) {
                campos.push(`"text_1" = $${posicion++}`);
                valores.push(text_1);
            }

            if (text_2 !== undefined) {
                campos.push(`"text_2" = $${posicion++}`);
                valores.push(text_2);
            }

            if (campos.length === 0) {
                return res.status(400).json({
                    error: "No hay datos para actualizar"
                });
            }

            valores.push(req.teacherId);

            const consulta = `
                UPDATE "Teacher"
                SET ${campos.join(", ")}
                WHERE id = $${posicion}
                RETURNING
                    id,
                    name,
                    mail,
                    logo,
                    text_1,
                    text_2,
                    id_state
            `;

            const resultadoUpdate = await pool.query(
                consulta,
                valores
            );

            if (resultadoUpdate.rows.length === 0) {
                return res.status(404).json({
                    error: "Profesor no encontrado"
                });
            }

            return res.json(resultadoUpdate.rows[0]);

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                error: "Error interno del servidor"
            });
        }
    }
);

app.patch(
    "/codes/:id",
    authenticateTeacher,
    async (req: AuthenticatedRequest, res) => {
        try {
            const resultado = updateCodeSchema.safeParse(req.body);

            if (!resultado.success) {
                return res.status(400).json({
                    error: "Datos inválidos"
                });
            }

            const codeId = Number(req.params.id);

            if (!Number.isInteger(codeId) || codeId <= 0) {
                return res.status(400).json({
                    error: "ID de código inválido"
                });
            }

            const { active } = resultado.data;

            const resultadoUpdate = await pool.query(
                `UPDATE "Code"
                 SET active = $1
                 WHERE id = $2
                   AND id_teacher = $3
                 RETURNING
                    id,
                    code,
                    active,
                    creation_date`,
                [active, codeId, req.teacherId]
            );

            if (resultadoUpdate.rows.length === 0) {
                return res.status(404).json({
                    error: "Código no encontrado"
                });
            }

            return res.json(resultadoUpdate.rows[0]);

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                error: "Error interno del servidor"
            });
        }
    }
);

app.patch(
    "/admin/teachers/:id/approve",
    authenticateAdmin,
    async (req: AuthenticatedAdminRequest, res) => {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id)) {
                return res.status(400).json({
                    error: "ID inválido"
                });
            }

            const resultado = await pool.query(
                `UPDATE "Teacher"
                 SET id_state = 2
                 WHERE id = $1
                   AND id_state = 1
                 RETURNING
                    id,
                    name,
                    mail,
                    id_state`,
                [id]
            );

            if (resultado.rows.length === 0) {
                return res.status(404).json({
                    error: "Solicitud no encontrada o ya procesada"
                });
            }

            return res.json({
                message: "Profesor aceptado",
                teacher: resultado.rows[0]
            });

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                error: "Error al aceptar profesor"
            });
        }
    }
);

app.patch(
    "/admin/teachers/:id/reject",
    authenticateAdmin,
    async (req: AuthenticatedAdminRequest, res) => {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id)) {
                return res.status(400).json({
                    error: "ID inválido"
                });
            }

            const resultado = await pool.query(
                `UPDATE "Teacher"
                 SET id_state = 3
                 WHERE id = $1
                   AND id_state = 1
                 RETURNING
                    id,
                    name,
                    mail,
                    id_state`,
                [id]
            );

            if (resultado.rows.length === 0) {
                return res.status(404).json({
                    error: "Solicitud no encontrada o ya procesada"
                });
            }

            return res.json({
                message: "Profesor rechazado",
                teacher: resultado.rows[0]
            });

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                error: "Error al rechazar profesor"
            });
        }
    }
);

app.patch(
    "/admin/teachers/:id/state",
    authenticateAdmin,
    async (req: AuthenticatedAdminRequest, res) => {
        try {
            const id = Number(req.params.id);
            const { id_state } = req.body;

            if (!Number.isInteger(id)) {
                return res.status(400).json({
                    error: "ID inválido"
                });
            }

            if (![1, 2, 3].includes(id_state)) {
                return res.status(400).json({
                    error: "Estado inválido"
                });
            }

            const resultado = await pool.query(
                `UPDATE "Teacher"
                 SET id_state = $1
                 WHERE id = $2
                 RETURNING
                    id,
                    name,
                    mail,
                    id_state`,
                [id_state, id]
            );

            if (resultado.rows.length === 0) {
                return res.status(404).json({
                    error: "Profesor no encontrado"
                });
            }

            return res.json({
                message: "Estado actualizado correctamente",
                teacher: resultado.rows[0]
            });

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                error: "Error al cambiar el estado del profesor"
            });
        }
    }
);

app.use(
    (
        err: unknown,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        if (res.headersSent) {
            return next(err);
        }

        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(413).json({
                    error: "El archivo es demasiado grande (máximo 10MB)"
                });
            }

            return res.status(400).json({
                error: "Error al procesar el archivo subido"
            });
        }

        if (
            err instanceof Error &&
            err.name === "PayloadTooLargeError"
        ) {
            return res.status(413).json({
                error: "La solicitud es demasiado grande"
            });
        }

        if (
            err instanceof SyntaxError &&
            "status" in err &&
            (err as { status?: number }).status === 400
        ) {
            return res.status(400).json({
                error: "JSON mal formado en la solicitud"
            });
        }

        console.error("Error no controlado:", err);

        return res.status(500).json({
            error: "Error interno del servidor"
        });
    }
);

app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000");
});
