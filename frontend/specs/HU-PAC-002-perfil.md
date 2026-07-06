# HU-PAC-002: Perfil del doctor con reseñas

## Historia de Usuario
Como paciente, quiero ver el perfil completo de un doctor con sus reseñas, para decidir si agendar una cita con él.

## Rol
Paciente

## Prioridad
Alta

## Criterios de Aceptación
- El sistema debe mostrar la foto, nombre completo y especialidad del doctor.
- El sistema debe mostrar un mapa pequeño con la ubicación del consultorio.
- El sistema debe mostrar la dirección del consultorio.
- El sistema debe mostrar el promedio de estrellas y el número total de reseñas.
- El sistema debe mostrar la lista de reseñas del doctor con: nombre del paciente, estrellas, fecha y comentario.
- El sistema debe permitir al paciente logueado dejar una reseña con calificación de 1 a 5 estrellas y comentario.
- El sistema debe mostrar un botón "Agendar cita".
- El sistema debe validar que el paciente haya tenido una cita realizada con ese doctor antes de dejar reseña.

## Interfaz esperada
- Cabecera con foto grande del doctor, nombre, especialidad, estrellas.
- Mapa pequeño (300px de alto) con un pin en la ubicación del consultorio.
- Sección de reseñas con lista de tarjetas.
- Formulario para dejar reseña (solo visible para pacientes logueados).
- Botón "Agendar cita" destacado.

## Colores
- Fondo: #F5F7FA
- Tarjetas: #FFFFFF
- Estrellas: #F39C12
- Botón principal: #3498DB
- Texto: #1A1A1A