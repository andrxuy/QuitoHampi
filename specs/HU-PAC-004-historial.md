# HU-PAC-004: Historial de citas del paciente

## Historia de Usuario
Como paciente, quiero ver mi historial de citas agendadas, canceladas y realizadas, para llevar un control de mis consultas.

## Rol
Paciente

## Prioridad
Media

## Criterios de Aceptación
- El sistema debe mostrar una lista con todas mis citas ordenadas por fecha.
- El sistema debe agrupar las citas por pestañas: Próximas, Realizadas, Canceladas.
- El sistema debe mostrar por cada cita: nombre del doctor, especialidad, fecha, hora, tipo, estado.
- El sistema debe permitir cancelar citas futuras con un botón "Cancelar cita".
- El sistema debe pedir confirmación antes de cancelar.
- El sistema debe mostrar un botón "Dejar reseña" en las citas realizadas.
- El sistema debe redirigir al perfil del doctor para dejar la reseña.

## Interfaz esperada
- Pestañas: Próximas | Realizadas | Canceladas.
- Lista de tarjetas de citas.
- Cada tarjeta muestra: foto del doctor, nombre, especialidad, fecha, hora, tipo, estado.
- Botón "Cancelar cita" en citas futuras.
- Botón "Dejar reseña" en citas realizadas.
- Modal de confirmación para cancelar.

## Colores
- Pestaña activa: #3498DB
- Badge agendada: #D5F5E3 / #27AE60
- Badge realizada: #3498DB / #FFFFFF
- Badge cancelada: #E0E0E0 / #999999
- Botón cancelar: #1A1A1A
- Fondo: #F5F7FA