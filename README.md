# Registros Médicos

Sistema de gestión de registros médicos y historias clínicas desarrollado con React y TypeScript. Esta aplicación permite crear, editar y gestionar registros de pacientes con funcionalidades completas de almacenamiento local y subida de imágenes médicas.

## 🚀 Características

- **Gestión completa de pacientes**: Crear, editar y eliminar registros médicos
- **Almacenamiento local**: Los datos se guardan automáticamente en localStorage
- **Subida de imágenes**: Capacidad para adjuntar imágenes médicas a los registros
- **Búsqueda avanzada**: Buscar pacientes por nombre o diagnósticos
- **Interfaz responsive**: Diseño adaptable para diferentes dispositivos
- **Formularios completos**: Campos para historial clínico, antecedentes, síntomas, diagnósticos y tratamientos

## 🛠️ Tecnologías Utilizadas

- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Vite** - Herramienta de construcción rápida
- **Tailwind CSS** - Framework de CSS utilitario
- **Lucide React** - Biblioteca de iconos
- **shadcn/ui** - Componentes de interfaz de usuario

## 📦 Instalación y Desarrollo

### Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn

### Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/Eddym06/Registros-M-dicos.git
cd Registros-M-dicos
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Abre tu navegador y visita `http://localhost:5173`

### Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la construcción de producción
- `npm run lint` - Ejecuta el linter ESLint

## 🚀 Despliegue en Vercel

Este proyecto está configurado para desplegarse automáticamente en Vercel. Sigue estos pasos:

### Método 1: Despliegue Automático desde GitHub

1. **Configura tu repositorio en GitHub**:
   - Asegúrate de que todos los cambios estén commitidos y pusheados a GitHub
   - El repositorio debe ser público o tener acceso desde Vercel

2. **Conecta con Vercel**:
   - Ve a [vercel.com](https://vercel.com) y crea una cuenta o inicia sesión
   - Haz clic en "Import Project" o "New Project"
   - Conecta tu cuenta de GitHub y selecciona este repositorio
   - Vercel detectará automáticamente que es un proyecto Vite

3. **Configuración automática**:
   - Vercel usará la configuración en `vercel.json` automáticamente
   - El comando de construcción será `npm run build`
   - El directorio de salida será `dist`

4. **Despliegue**:
   - Haz clic en "Deploy"
   - El proyecto se desplegará automáticamente
   - Cualquier cambio futuro en la rama principal se desplegará automáticamente

### Método 2: Despliegue Manual con Vercel CLI

1. **Instala Vercel CLI**:
```bash
npm install -g vercel
```

2. **Construye el proyecto**:
```bash
npm run build
```

3. **Despliega con Vercel**:
```bash
vercel --prod
```

### Configuración de Vercel

El archivo `vercel.json` está configurado para:
- **Manejar rutas SPA**: Todas las rutas se redirigen a `index.html` para evitar errores 404
- **Comando de construcción**: `npm run build`
- **Directorio de salida**: `dist` (generado por Vite)

## 📁 Estructura del Proyecto

```
├── public/                 # Archivos estáticos
│   └── vite.svg           # Favicon
├── src/
│   ├── components/
│   │   └── ui/            # Componentes de interfaz reutilizables
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       └── textarea.tsx
│   ├── lib/
│   │   └── utils.ts       # Utilidades y funciones auxiliares
│   ├── App.tsx            # Componente principal de la aplicación
│   ├── main.tsx           # Punto de entrada de la aplicación
│   └── index.css          # Estilos globales con Tailwind
├── index.html             # Plantilla HTML principal
├── package.json           # Configuración del proyecto y dependencias
├── tailwind.config.cjs    # Configuración de Tailwind CSS
├── tsconfig.json          # Configuración de TypeScript
├── vite.config.ts         # Configuración de Vite
├── vercel.json            # Configuración de despliegue en Vercel
└── README.md              # Este archivo
```

## 🔧 Configuración para Producción

### Variables de Entorno (Opcional)

Si necesitas variables de entorno, crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=https://tu-api.com
VITE_APP_NAME=Registros Médicos
```

### Optimizaciones de Construcción

El proyecto ya está optimizado para producción con:
- **Code splitting** automático
- **Tree shaking** para reducir el tamaño del bundle
- **Minificación** de CSS y JavaScript
- **Compresión gzip** automática en Vercel

## 🐛 Solución de Problemas

### Error 404 en Rutas

Si experimentas errores 404 al navegar directamente a rutas, asegúrate de que:
1. El archivo `vercel.json` esté presente en la raíz del proyecto
2. La configuración de reescritura esté correcta
3. El proyecto se haya desplegado correctamente

### Problemas de Construcción

Si hay problemas durante la construcción:
1. Verifica que todas las dependencias estén instaladas: `npm install`
2. Asegúrate de que Node.js sea versión 16 o superior
3. Intenta limpiar el caché: `rm -rf node_modules package-lock.json && npm install`

### Imágenes no Cargando

Las imágenes se almacenan localmente usando `URL.createObjectURL()`. En una implementación de producción, considera:
1. Implementar un servicio de almacenamiento de imágenes
2. Usar un servicio como Cloudinary o AWS S3
3. Implementar compresión de imágenes

## 📝 Notas de Desarrollo

- Los datos se almacenan en `localStorage` del navegador
- Las imágenes son URLs temporales generadas por `URL.createObjectURL()`
- Para una implementación completa, considera añadir una base de datos backend
- La aplicación es completamente offline después de la carga inicial

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autor

**Eduardo** - [@Eddym06](https://github.com/Eddym06)

---

¡Gracias por usar Registros Médicos! Si tienes alguna pregunta o sugerencia, no dudes en abrir un issue en GitHub.
