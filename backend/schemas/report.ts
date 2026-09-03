import { z } from "zod";

const studentMailSchema = z
    .string()
    .trim()
    .email("El correo no es válido")
    .max(254, "El correo es demasiado largo")
    .transform((mail) => mail.toLowerCase());

export const createReportSchema = z.object({
    code: z
        .string()
        .trim()
        .min(1, "El código es obligatorio")
        .max(50, "El código es demasiado largo"),

    student_name: z
        .string()
        .trim()
        .min(2, "El nombre es demasiado corto")
        .max(100, "El nombre es demasiado largo"),

    student_mail: studentMailSchema
}).strict();

export const registerDownloadSchema = z.object({
    report_id: z.coerce
        .number()
        .int("El id del informe es inválido")
        .positive("El id del informe es inválido"),

    code: z
        .string()
        .trim()
        .min(1, "El código es obligatorio")
        .max(50, "El código es demasiado largo"),

    student_mail: studentMailSchema
}).strict();