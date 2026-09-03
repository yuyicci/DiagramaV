import { z } from "zod";

export const registerTeacherSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(100, "El nombre es demasiado largo"),

    mail: z
        .string()
        .trim()
        .email("El correo no es válido")
        .max(254, "El correo es demasiado largo")
        .transform((mail) => mail.toLowerCase()),

    password: z
        .string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .max(128, "La contraseña es demasiado larga")
});

export const loginTeacherSchema = z.object({
    mail: z
        .string()
        .trim()
        .email("El correo no es válido")
        .max(254, "El correo es demasiado largo")
        .transform((mail) => mail.toLowerCase()),

    password: z
        .string()
        .min(1, "La contraseña es obligatoria")
        .max(128, "La contraseña es demasiado larga")
});

const LOGO_DATA_URL_REGEX =
    /^data:image\/(png|jpeg|jpg|webp);base64,([A-Za-z0-9+/]+={0,2})$/;

export const updateTeacherSchema = z.object({
    logo: z
        .string()
        .max(5_000_000, "El logo es demasiado grande")
        .nullable()
        .optional()
        .refine(
            (value) =>
                value === null ||
                value === undefined ||
                LOGO_DATA_URL_REGEX.test(value),
            { message: "El logo debe ser una imagen válida (PNG, JPEG o WEBP)" }
        ),

    text_1: z
        .string()
        .max(500, "El texto 1 es demasiado largo")
        .nullable()
        .optional(),

    text_2: z
        .string()
        .max(500, "El texto 2 es demasiado largo")
        .nullable()
        .optional()
}).strict();