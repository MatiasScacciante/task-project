# Building Maintenance Backend

Este proyecto proporciona un backend básico en Express.js con SQLite para el checklist de mantenimiento de edificios.

## Requisitos

- Node.js y npm instalados
- Sistema operativo con soporte para SQLite (Linux, Windows, MacOS)

## Instrucciones

1. Clona o descomprime este proyecto.
2. En la terminal, navega al directorio raíz del proyecto:
   ```bash
   cd building-maintenance-backend
   ```

3. Instala las dependencias:
   ```bash
   npm install
   ```

4. Inicia el servidor:
   ```bash
   npm run dev
   ```

5. El servidor estará disponible en: [http://localhost:3000](http://localhost:3000)

## Endpoints

- `GET /tasks` – Obtener todas las tareas
- `POST /tasks` – Crear una nueva tarea
- `PUT /tasks/:id` – Actualizar estado de completado
- `DELETE /tasks/:id` – Eliminar una tarea

## Base de Datos

Se utiliza SQLite, el archivo se crea automáticamente en `src/db.sqlite`.

