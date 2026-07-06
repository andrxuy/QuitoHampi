# HU-ADM-006: Gestión de usuarios (pacientes)

## Historia de Usuario
Como administrador, quiero consultar, editar y desactivar cuentas de pacientes, para gestionar la base de usuarios del sistema.

## Rol
Administrador

## Prioridad
Alta

## Riesgo
Medio

## Desarrollador responsable
Andrés Gustavo Oto Caza

## Criterios de Aceptación
- El sistema debe permitir al administrador consultar la base de datos de pacientes.
- El sistema debe mostrar el comportamiento de los pacientes en la plataforma.
- El sistema debe permitir al administrador editar la información de un paciente.
- El sistema debe permitir al administrador desactivar o bloquear la cuenta de un paciente.
- El sistema debe permitir al administrador eliminar el perfil de un paciente.

## Observación
Debe existir un administrador que gestione al usuario.

## Interfaz esperada
- Página con sidebar de administrador.
- Tabla con columnas: #, Nombre, Email, Teléfono, Fecha de registro, Estado, Acciones.
- Filtro de búsqueda por nombre o email.
- Badges de estado: Activo, Bloqueado.
- Botones de acción: Ver historial, Editar, Bloquear/Desbloquear, Eliminar.
- Modal de edición con campos: nombre, apellido, email, teléfono.
- Modal de confirmación para bloquear y eliminar.
- Vista de historial del paciente (citas agendadas, canceladas, reseñas dejadas).

## Colores
- Sidebar: #2C3E55
- Botones: #3498DB
- Badge activo: #D5F5E3 con texto #27AE60
- Badge bloqueado: #E0E0E0 con texto #999999
- Fondo: #F5F7FA