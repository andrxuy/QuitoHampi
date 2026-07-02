# HU-MED-003: Gestión de citas

## Historia de Usuario
Como médico, quiero gestionar la disponibilidad de citas, para que los pacientes puedan agendar en los horarios habilitados.

## Rol
Médico

## Prioridad
Alta

## Riesgo
Alto

## Desarrollador responsable
Andrés Gustavo Oto Caza

## Criterios de Aceptación
- El sistema debe presentar un calendario semanal con las horas disponibles del médico.
- El sistema debe mostrar las horas que ya han sido ocupadas por otros pacientes.
- El sistema debe permitir al médico cancelar sus citas.
- El sistema debe permitir al médico marcar días de descanso.
- El sistema debe bloquear la atención en los días marcados como descanso.

## Observación
Debe existir días de descanso para el médico, no todos los días podrá atender al cliente.

## Interfaz esperada
- Página con sidebar de médico.
- Cabecera con nombre del médico y especialidad.
- Botón "Marcar día de descanso".
- Leyenda: Disponible (verde), Ocupado (rojo), Descanso (gris).
- Calendario semanal de 5 columnas (Lunes a Viernes).
- 8 slots horarios por día (08:00 a 16:00).
- Slots disponibles: fondo #D5F5E3, borde #27AE60, texto #27AE60.
- Slots ocupados: fondo #FADBD8, borde #E74C3C, texto #E74C3C, nombre del paciente debajo.
- Modal de detalle de cita: paciente, día, hora, especialidad.
- Botón "Cancelar cita" en el modal.
- Modal de confirmación antes de cancelar.
- Modal para marcar día de descanso con select de día.
- Al marcar descanso, todas las citas de ese día se cancelan.

## Colores
- Sidebar: #2C3E55
- Encabezado de día: #3498DB
- Slot disponible: #D5F5E3 / #27AE60
- Slot ocupado: #FADBD8 / #E74C3C
- Slot descanso: #E0E0E0 / #999999
- Botón cancelar: #1A1A1A
- Botón confirmar: #3498DB
- Fondo: #F5F7FA