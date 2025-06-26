# API Sistema de Gestión de Cursos Online

## Descripción
API REST para gestión de cursos online, estudiantes, profesores, notas y certificados. Permite la gestión completa de una plataforma educativa con sistema de roles y permisos.

## Tecnologías
- Node.js
- Express.js
- Sequelize (ORM)
- PostgreSQL
- JWT (Autenticación)
- Express-validator (Validaciones)
- PDFKit (Generación de certificados)

## Estructura del Proyecto
```
src/
├── config/           # Configuraciones
├── constants/        # Constantes (roles, permisos, errores)
├── database/         # Configuración de BD, migraciones, seeders
├── middlewares/      # Middlewares (auth, validaciones, permisos)
├── modules/          # Módulos de la aplicación
│   ├── auth/         # Autenticación
│   ├── usuario/      # Gestión de usuarios
│   ├── curso/        # Gestión de cursos
│   ├── video/        # Gestión de videos
│   ├── nota/         # Gestión de notas
│   ├── comentario/   # Gestión de comentarios
│   ├── inscripcion/  # Gestión de inscripciones
│   ├── categoria/    # Gestión de categorías
│   ├── rol/          # Gestión de roles
│   ├── permiso/      # Gestión de permisos
│   ├── progreso/     # Gestión de progreso
│   └── certificado/  # Generación de certificados
├── routes/           # Rutas principales
├── utils/            # Utilidades
└── validations/      # Validaciones de entrada
```

## Instalación

1. Clonar el repositorio
2. Instalar dependencias: `npm install`
3. Configurar variables de entorno (ver `.env.example`)
4. Ejecutar migraciones: `npx sequelize-cli db:migrate`
5. Ejecutar seeders: `npx sequelize-cli db:seed:all`
6. Iniciar servidor: `npm start`

## Autenticación

La API usa JWT (JSON Web Tokens) para autenticación.

### Headers requeridos:
```
Authorization: Bearer <token>
Content-Type: application/json
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "password123"
}
```

### Respuesta exitosa:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "usuario@ejemplo.com",
    "rol": {
      "codigo": "EST",
      "nombre": "estudiante"
    }
  }
}
```

## Roles y Permisos

### Roles disponibles:
- **ADMIN**: Administrador del sistema
- **PROF**: Profesor
- **EST**: Estudiante

### Permisos principales:
- `usuarios:*` - Gestión de usuarios
- `cursos:*` - Gestión de cursos
- `videos:*` - Gestión de videos
- `notas:*` - Gestión de notas
- `inscripciones:*` - Gestión de inscripciones
- `comentarios:*` - Gestión de comentarios

## Endpoints

### Rutas Públicas vs Privadas

**Rutas Públicas** (No requieren autenticación):
- Ver todos los cursos
- Ver curso específico
- Ver todas las categorías
- Ver categoría específica

**Rutas Privadas** (Requieren autenticación):
- Todas las demás operaciones (crear, actualizar, eliminar, inscribirse, etc.)

### Usuarios

#### Obtener todos los usuarios
```http
GET /api/usuarios
Authorization: Bearer <token>
```

#### Obtener usuario por ID
```http
GET /api/usuarios/:id
Authorization: Bearer <token>
```

#### Obtener mi información
```http
GET /api/usuarios/me
Authorization: Bearer <token>
```

#### Actualizar usuario
```http
PATCH /api/usuarios/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Nuevo Nombre",
  "apellido": "Nuevo Apellido",
  "email": "nuevo@email.com"
}
```

#### Eliminar usuario
```http
DELETE /api/usuarios/:id
Authorization: Bearer <token>
```

### Cursos

#### Obtener todos los cursos
```http
GET /api/cursos
```
*Ruta pública - No requiere autenticación*

#### Obtener curso por ID
```http
GET /api/cursos/:id
```
*Ruta pública - No requiere autenticación*

#### Crear curso
```http
POST /api/cursos
Authorization: Bearer <token>
Content-Type: application/json

{
  "titulo": "Curso de JavaScript",
  "descripcion": "Aprende JavaScript desde cero",
  "categoriaId": 1,
  "profesorId": 2
}
```

#### Actualizar curso
```http
PATCH /api/cursos/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "titulo": "Nuevo título",
  "descripcion": "Nueva descripción",
  "categoriaId": 2
}
```

#### Eliminar curso
```http
DELETE /api/cursos/:id
Authorization: Bearer <token>
```

#### Subir imagen del curso
```http
POST /api/cursos/:id/imagen
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
- imagen: [archivo]
```

### Videos

#### Obtener videos de un curso
```http
GET /api/cursos/:cursoId/videos
Authorization: Bearer <token>
```

#### Agregar video
```http
POST /api/cursos/:cursoId/videos
Authorization: Bearer <token>
Content-Type: application/json

{
  "titulo": "Introducción al curso",
  "url": "https://www.youtube.com/watch?v=...",
  "orden": 1
}
```

#### Actualizar video
```http
PATCH /api/videos/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "titulo": "Nuevo título",
  "url": "https://www.youtube.com/watch?v=...",
  "orden": 2
}
```

#### Eliminar video
```http
DELETE /api/videos/:id
Authorization: Bearer <token>
```

### Inscripciones

#### Inscribirse a un curso
```http
POST /api/cursos/:cursoId/inscripcion
Authorization: Bearer <token>
Content-Type: application/json

{
  // No se envía nada en el body
}
```

#### Obtener mis cursos
```http
GET /api/mis-cursos
Authorization: Bearer <token>
```

#### Obtener inscripciones de un curso
```http
GET /api/cursos/:cursoId/inscripciones
Authorization: Bearer <token>
```

#### Obtener inscripción específica
```http
GET /api/inscripciones/:id
Authorization: Bearer <token>
```

#### Eliminar inscripción
```http
DELETE /api/inscripciones/:id
Authorization: Bearer <token>
```

**Notas sobre permisos de inscripciones:**
- **Admin**: Puede ver y eliminar cualquier inscripción
- **Profesor**: Puede ver inscripciones de sus cursos
- **Estudiante**: Puede ver y eliminar solo sus propias inscripciones

### Notas

#### Asignar nota
```http
POST /api/inscripciones/:inscripcionId/notas
Authorization: Bearer <token>
Content-Type: application/json

{
  "valor": 8.5,
  "descripcion": "Examen parcial"
}
```

#### Obtener notas de una inscripción
```http
GET /api/inscripciones/:inscripcionId/notas
Authorization: Bearer <token>
```

#### Obtener mis notas
```http
GET /api/mis-notas
Authorization: Bearer <token>
```

#### Actualizar nota
```http
PATCH /api/notas/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "valor": 9.0,
  "descripcion": "Nota actualizada"
}
```

#### Eliminar nota
```http
DELETE /api/notas/:id
Authorization: Bearer <token>
```

### Comentarios

#### Obtener comentarios de un curso
```http
GET /api/cursos/:cursoId/comentarios
Authorization: Bearer <token>
```

#### Crear comentario
```http
POST /api/cursos/:cursoId/comentarios
Authorization: Bearer <token>
Content-Type: application/json

{
  "contenido": "Excelente curso, muy recomendado"
}
```

#### Actualizar comentario
```http
PUT /api/comentarios/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "contenido": "Comentario actualizado"
}
```

#### Eliminar comentario
```http
DELETE /api/comentarios/:id
Authorization: Bearer <token>
```

### Progreso

#### Marcar video como visto
```http
POST /api/videos/:videoId/visto
Authorization: Bearer <token>
Content-Type: application/json


```

#### Obtener progreso de un curso
```http
GET /api/cursos/:cursoId/progreso
Authorization: Bearer <token>
```

### Certificados

#### Descargar certificado
```http
GET /api/cursos/:cursoId/certificado
Authorization: Bearer <token>
```

**Requisitos para obtener certificado:**
- Estar inscrito en el curso
- Haber visto todos los videos (progreso 100%)
- Tener notas registradas, se saca el promedio en base a eso

### Categorías

#### Obtener todas las categorías
```http
GET /api/categorias
```
*Ruta pública - No requiere autenticación*

#### Obtener categoría por ID
```http
GET /api/categorias/:id
```
*Ruta pública - No requiere autenticación*

#### Crear categoría
```http
POST /api/categorias
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Programación",
  "descripcion":"Si"
}
```

#### Actualizar categoría
```http
PUT /api/categorias/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Nuevo nombre"
}
```

#### Eliminar categoría
```http
DELETE /api/categorias/:id
Authorization: Bearer <token>
```

## Modelos de Datos

### Usuario
```json
{
  "id": 1,
  "username": "juanperez",
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@ejemplo.com",
  "rol": {
    "id": 3,
    "codigo": "EST",
    "nombre": "estudiante"
  }
}
```

### Curso
```json
{
  "id": 1,
  "titulo": "Curso de JavaScript",
  "descripcion": "Aprende JavaScript desde cero",
  "imagenUrl": "uploads/cursos/curso-1.jpg",
  "categoria": {
    "id": 1,
    "nombre": "Programación"
  },
  "profesor": {
    "id": 2,
    "nombre": "María",
    "apellido": "García"
  }
}
```

### Video
```json
{
  "id": 1,
  "titulo": "Introducción al curso",
  "url": "https://www.youtube.com/watch?v=...",
  "orden": 1,
  "cursoId": 1
}
```

### Nota
```json
{
  "id": 1,
  "valor": 8.5,
  "descripcion": "Examen parcial",
  "inscripcionId": 1,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### Inscripción
```json
{
  "id": 1,
  "estudianteId": 3,
  "cursoId": 1,
  "estudiante": {
    "id": 3,
    "nombre": "Ana",
    "apellido": "López"
  },
  "curso": {
    "id": 1,
    "titulo": "Curso de JavaScript"
  }
}
```

## Códigos de Error

### 400 - Bad Request
```json
{
  "errors": [
    {
      "type": "field",
      "msg": "El email es inválido",
      "path": "email",
      "location": "body"
    }
  ]
}
```

### 401 - Unauthorized
```json
{
  "error": "No token provided"
}
```

### 403 - Forbidden
```json
{
  "error": "No tienes permisos para realizar esta acción"
}
```

### 404 - Not Found
```json
{
  "error": "Usuario no encontrado"
}
```

### 500 - Internal Server Error
```json
{
  "error": "Error interno del servidor"
}
```

## Validaciones

### Usuario
- `email`: Email válido
- `nombre`: Mínimo 2 caracteres
- `apellido`: Mínimo 2 caracteres
- `rolId`: Número entero

### Curso
- `titulo`: Mínimo 3 caracteres
- `descripcion`: Mínimo 5 caracteres
- `categoriaId`: Número entero
- `profesorId`: Número entero (opcional)

### Video
- `cursoId`: Número entero
- `titulo`: Mínimo 2 caracteres
- `url`: URL válida
- `orden`: Número entero

### Nota
- `inscripcionId`: Número entero
- `valor`: Número
- `descripcion`: Texto (opcional)

### Comentario
- `cursoId`: Número entero
- `contenido`: Mínimo 2 caracteres

## Variables de Entorno

Crear archivo `.env`:
```env
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cursos_online
DB_USER=postgres
DB_PASSWORD=tu_password

# JWT
JWT_SECRET=tu_secret_key_super_segura

# Servidor
PORT=3000
NODE_ENV=development

# Uploads
UPLOAD_PATH=src/public/uploads
```

## Scripts Disponibles

- `npm start`: Iniciar servidor
- `npm run dev`: Iniciar en modo desarrollo con nodemon
- `npm run migrate`: Ejecutar migraciones
- `npm run seed`: Ejecutar seeders
- `npm run migrate:undo`: Revertir migraciones

## Notas Importantes

1. **Autenticación**: Todos los endpoints (excepto login/registro) requieren token JWT
2. **Permisos**: Verificar permisos específicos para cada acción
3. **Validaciones**: Todos los datos de entrada son validados
4. **Progreso**: Se calcula basado en videos vistos vs total de videos del curso
5. **Certificados**: Solo se generan si se cumplen todos los requisitos
6. **Archivos**: Las imágenes se guardan en `src/public/uploads/`

