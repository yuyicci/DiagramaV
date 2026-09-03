# Diagrama V

Aplicación web para crear informes de física utilizando el **Diagrama V de Gowin**. Los alumnos pueden completar el diagrama, tablas de datos, ecuaciones, transformaciones y gráficos/imágenes, y posteriormente exportar el informe a PDF.

Los profesores generan códigos de acceso para sus cursos y pueden revisar los informes descargados por sus alumnos. Las nuevas cuentas de profesor deben ser aprobadas por un administrador.

## Aplicación

[diagramav.cl](https://diagramav.cl)

## Tecnologías

### Frontend

* React 19 + Vite + TypeScript
* React Router
* Material UI (MUI)
* html2pdf.js
* KaTeX + MathLive

### Backend

* Node.js + Express + TypeScript
* PostgreSQL
* JWT + Argon2
* Zod
* Multer
* Helmet + express-rate-limit

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/yuyicci/DiagramaV.git
cd DiagramaV
```

### 2. Frontend

```bash
npm install
```

Crear `.env`:

```env
VITE_API_URL=http://localhost:3000
```

Ejecutar:

```bash
npm run dev
```

Para producción:

```bash
npm run build
npx serve dist
```

### 3. Backend

```bash
cd backend
npm install
```

Crear la base de datos ejecutando `schema.sql` en PostgreSQL.

Copiar `backend/.env.example` a `backend/.env` y configurar las variables:

```env
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=
DB_NAME=
JWT_SECRET=
FRONTEND_URL=
NODE_ENV=
```

Crear JWT_SECRET:
```bash
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Maximum 256 }))
```

Crear el primer administrador:

```bash
npx tsx create-admin.ts "Tu Nombre" tuemail@ejemplo.com "UnaContraseñaSegura123"
```

Ejecutar el backend:

```bash
npm run dev
```

Por defecto, el backend utiliza:

```text
http://localhost:3000
```

## Estructura

```text
DiagramaV/
├── src/                 # Frontend
│   ├── components/      # Componentes reutilizables
│   └── pages/           # Páginas de alumnos, profesores y administrador
│
└── backend/             # Backend
    ├── server.ts        # API y rutas
    ├── database.ts      # Conexión a PostgreSQL
    ├── schema.sql       # Esquema de la base de datos
    ├── create-admin.ts  # Creación del administrador
    ├── middleware/      # Autenticación y rate limiting
    └── schemas/         # Validación con Zod
```

## Flujo del sistema

1. **Alumno:** ingresa un código de curso, completa su informe y lo exporta a PDF.
2. **Profesor:** crea una cuenta, espera la aprobación del administrador y luego genera códigos para sus cursos y revisa los informes descargados.
3. **Administrador:** aprueba o rechaza las cuentas de profesores.

## Licencia

El proyecto utiliza librerías de código abierto, principalmente bajo licencia MIT.
