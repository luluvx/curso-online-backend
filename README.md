# API de Gestión de Cursos Online

## Descripción
API RESTful para la gestión de cursos, usuarios, inscripciones, notas y certificados en una plataforma educativa. Incluye autenticación, roles y permisos.

## Tecnologías principales
- Node.js + Express.js
- Sequelize ORM + PostgreSQL
- JWT para autenticación
- PDFKit para generación de certificados

## Instalación rápida
1. Clona el repositorio:
   ```bash
   git clone <url-del-repo>
   cd curso-online-backend
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno (usa `.env.example` como guía).
4. Ejecuta migraciones y seeders:
   ```bash
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```
5. Inicia el servidor:
   ```bash
   npm start
   ```

## Uso básico
- El servidor corre por defecto en `http://localhost:3000`.
- Documentación de endpoints en el propio código (rutas en `src/modules/*/*.routes.js`).
- Autenticación vía JWT (ver rutas de `/api/auth`).

## Estructura principal
```
src/
  config/         # Configuración y variables de entorno
  constants/      # Constantes globales (roles, permisos, errores)
  database/       # Conexión, migraciones y seeders
  middlewares/    # Middlewares de Express
  modules/        # Módulos principales (usuario, curso, nota, etc.)
  routes/         # Rutas principales
  utils/          # Utilidades generales
  validations/    # Validaciones de entrada
```

## Scripts útiles
- `npm start` — Inicia el servidor
- `npm run dev` — Inicia en modo desarrollo (si tienes nodemon)
- `npx sequelize-cli db:migrate` — Ejecuta migraciones
- `npx sequelize-cli db:seed:all` — Ejecuta seeders



---

> Para detalles avanzados, revisa la documentación interna y los comentarios en el código.

