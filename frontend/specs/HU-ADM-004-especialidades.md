# HU-ADM-004: Gestión de especialidades

## Historia de Usuario
Como administrador, quiero gestionar las especialidades médicas disponibles en el sistema (crear, editar, desactivar), para mantener actualizada la oferta de búsqueda.

## Rol
Administrador

## Prioridad
Media

## Riesgo
Bajo

## Desarrollador responsable
María Fernanda Rodríguez Loachamin

## Criterios de Aceptación
- El sistema debe permitir crear una nueva especialidad médica.
- El sistema debe permitir editar el nombre de una especialidad existente.
- El sistema debe permitir desactivar una especialidad sin eliminarla permanentemente.
- El sistema debe tener un filtro "otros" donde el especialista pueda escribir el nombre de su especialidad.
- El sistema debe generar un informe de las especialidades que no encajan en los filtros existentes para que el administrador pueda integrarlas.

## Observación
Debe existir un administrador que pueda crear una nueva lista de filtros.

## Interfaz esperada
- Página con sidebar de administrador.
- Tabla con columnas: #, Nombre, Estado (Activo/Inactivo), Fecha de creación, Acciones.
- Botón "Nueva especialidad" que abre modal con campo de texto.
- Botones de acción: Editar, Desactivar.
- Modal de confirmación para desactivar.
- Filtro de búsqueda por nombre.

## Colores
- Sidebar: #2C3E55
- Botones: #3498DB
- Badge activo: #D5F5E3 con texto #27AE60
- Badge inactivo: #E0E0E0 con texto #999999
- Fondo: #F5F7FA