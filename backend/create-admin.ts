import argon2 from "argon2";
import pool from "./database.js";

// Uso: npx tsx create-admin.ts "Nombre Admin" correo@dominio.com "ContraseñaSegura123"
const [, , nombre, mail, password] = process.argv;

const main = async () => {
    if (!nombre || !mail || !password) {
        console.error(
            'Uso: npx tsx create-admin.ts "Nombre Admin" correo@dominio.com "ContraseñaSegura123"'
        );
        process.exit(1);
    }

    if (password.length < 8) {
        console.error("La contraseña debe tener al menos 8 caracteres");
        process.exit(1);
    }

    const existente = await pool.query(
        'SELECT id FROM "Admin" WHERE mail = $1',
        [mail]
    );

    if (existente.rows.length > 0) {
        console.error(`Ya existe un admin con el correo ${mail}`);
        process.exit(1);
    }

    const passwordHash = await argon2.hash(password);

    await pool.query(
        `INSERT INTO "Admin"
        (name, mail, password_hash)
        VALUES ($1, $2, $3)`,
        [nombre, mail, passwordHash]
    );

    console.log(`Administrador "${nombre}" (${mail}) creado correctamente`);

    await pool.end();
};

main().catch((error) => {
    console.error(error);
    process.exit(1);
});