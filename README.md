# Diagrama V

Aplicación web desarrollada en React que permite crear reportes de física basados en el diagrama de Gowin. Incluye herramientas para estructurar información, trabajar con ecuaciones y tablas, y exportar el resultado en formato PDF.

## Página Web GitHub

[Ver aplicación](https://yuyicci.github.io/DiagramaV/)

## Tecnologías utilizadas

* React + Vite
* TypeScript

### Librerías adicionales

* html2pdf.js
* katex
* mathlive

Todas las librerías son de código abierto bajo licencia MIT.

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/yuyicci/DiagramaV.git
cd DiagramaV
```

Instalar dependencias:

```bash
npm install
```

Ejecutar en desarrollo:

```bash
npm run dev
```

Para generar versión de producción:

```bash
npm run build
```

Para visualizar el build:

```bash
npx serve dist
```

## Estructura del proyecto (src)

```
src
├── App.css
├── App.tsx
├── assets
│   └── DiagramaV
│       └── logo-usm.png
├── components
│   └── DiagramaV
│       ├── Diagrama.css
│       ├── Diagrama.tsx
│       ├── Ecuaciones.tsx
│       ├── EcuacionPreview.tsx
│       ├── PdfBoton.tsx
│       ├── Tabla.css
│       ├── TablaPreview.tsx
│       └── Tabla.tsx
├── index.css
├── main.tsx
└── utils
```

## Descripción de componentes

* **App.tsx**: Define la navegación mediante rutas (`/DiagramaV`, `/Tabla`, `/Ecuaciones`, `/Transformaciones`).
* **Diagrama.tsx**: Componente principal que organiza el Diagrama V.
* **Diagrama.css**: Estilos del diagrama principal.
* **Ecuaciones.tsx**: Creación y edición dinámica de ecuaciones.
* **EcuacionPreview.tsx**: Vista previa de ecuaciones renderizadas.
* **Tabla.tsx**: Creación y edición de tablas de datos.
* **TablaPreview.tsx**: Vista previa simplificada de tablas.
* **Tabla.css**: Estilos de tablas.
* **PdfBoton.tsx**: Exportación del contenido a PDF.
* **logo-usm.png**: Imagen utilizada en el diagrama.

## Licencia

Este proyecto utiliza librerías bajo licencia MIT.

