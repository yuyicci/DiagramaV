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

---

## Instalación y Ejecución con Docker (Recomendado)

La forma más rápida y limpia de levantar toda la infraestructura (Base de datos, Backend y Frontend con Nginx) es utilizando Docker Compose.

### 1. Clonar el repositorio
```bash
git clone https://github.com/yuyicci/DiagramaV.git
cd DiagramaV
```

### 2. Configurar las variables de entorno
Crea un archivo **.env** en la raíz del proyecto basándote en este ejemplo.

Para generar un **JWT_SECRET** seguro en Windows (PowerShell), puedes ejecutar:
```bash
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Maximum 256 }))
```

Copia el resultado en tu archivo **.env**:

```env
# Base de datos PostgreSQL
DB_USER=diagramav_user
DB_PASSWORD=tu_contraseña_segura
DB_NAME=diagramav
DB_PORT=5432

# Puertos de los contenedores en tu máquina local
FRONTEND_PORT=80
BACKEND_PORT=3000

# Seguridad y Rutas
JWT_SECRET=pega_aqui_el_resultado_generado
FRONTEND_URL=http://localhost
VITE_API_URL=/api
```

### 3. Levantar los contenedores y crear el Administrador
Ejecuta el siguiente comando para construir y poner en marcha toda la aplicación en segundo plano:
```bash
docker-compose up -d --build
```

Una vez que los contenedores estén corriendo, crea el primer usuario administrador ejecutando este comando en tu terminal:
```bash
docker-compose exec backend node dist/create-admin.js "Tu Nombre" tuemail@ejemplo.com "UnaContraseñaSegura123"
```

¡Listo! La aplicación estará disponible en **http://localhost** y ya podrás iniciar sesión.

## Estructura del Proyecto

```bash
DiagramaV/
├── FRONTEND/                # Código fuente del cliente (React + Vite)
│   ├── src/                 # Componentes, páginas, assets y contextos
│   └── nginx.conf           # Configuración del servidor web de producción
├── BACKEND/                 # Código fuente del servidor (Node.js + Express)
│   ├── db/schema.sql        # Esquema de la base de datos PostgreSQL
│   ├── middleware/          # Autenticación y rate limiting
│   └── schemas/             # Validación con Zod
├── docker-compose.yml       # Orquestador de contenedores para producción/local
└── .env                     # Variables de entorno globales para Docker
```

## Flujo del sistema
Alumno: ingresa un código de curso, completa su informe y lo exporta a PDF.

Profesor: crea una cuenta, espera la aprobación del administrador y luego genera códigos para sus cursos y revisa los informes descargados.

Administrador: aprueba o rechaza las cuentas de profesores.

## Licencia
El proyecto utiliza librerías de código abierto, principalmente bajo licencia MIT