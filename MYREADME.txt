Diagrama V:

El Diagrama V es un componente que proporciona una plantilla para la elaboración de reportes de física basados en el diagrama de Gowin. Además, permite exportar el trabajo realizado en formato PDF.

Librerías extras:

"html2pdf.js": "^0.14.0"
"katex": "^0.16.45"
"mathlive": "^0.109.1"

Todas son de código abierto y requieren únicamente la inclusión de la licencia MIT.

Directorio src (único modificado):
.
├── App.css
├── App.tsx
├── assets
│ └── DiagramaV
│ └── logo-usm.png
├── components
│ └── DiagramaV
│ ├── Diagrama.css
│ ├── Diagrama.tsx
│ ├── Ecuaciones.tsx
│ ├── EcuacionPreview.tsx
│ ├── PdfBoton.tsx
│ ├── Tabla.css
│ ├── TablaPreview.tsx
│ └── Tabla.tsx
├── index.css
├── main.tsx
└── utils

App.tsx: Define la navegación de la aplicación mediante rutas (/DiagramaV, /Tabla, /Ecuaciones y /Transformaciones).

assets/DiagramaV/logo-usm.png: Imagen del logo utilizada en el componente principal.

components/DiagramaV:
	- Diagrama.css: Define los estilos del diagrama principal.
	- Diagrama.tsx: Componente principal que organiza y muestra el Diagrama V.
	- Ecuaciones.tsx: Permite crear y editar ecuaciones de forma dinámica.
	- EcuacionPreview.tsx: Muestra una vista previa de las ecuaciones renderizadas en el diagrama.
	- PdfBoton.tsx: Permite exportar el contenido a PDF.
	- Tabla.css: Define los estilos de las tablas.
	- TablaPreview.tsx: Muestra una vista previa simplificada de la tabla en el diagrama.
	- Tabla.tsx: Permite crear y editar tablas de datos.
