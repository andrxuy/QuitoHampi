# HU-PAC-001: Búsqueda de doctores por especialidad y ubicación

## Historia de Usuario
Como paciente, quiero buscar médicos por especialidad y ver su ubicación en un mapa, para encontrar al profesional más cercano a mi domicilio.

## Rol
Paciente

## Prioridad
Alta

## Criterios de Aceptación
- El sistema debe mostrar un input de búsqueda por especialidad con autocompletado.
- El sistema debe mostrar un mapa de Quito centrado en lat: -0.1807, lng: -78.4678, zoom 13.
- El sistema debe mostrar pines en el mapa con la ubicación de los doctores.
- El sistema debe mostrar una lista de resultados debajo del mapa con: foto, nombre, especialidad, estrellas, distancia aproximada.
- El sistema debe filtrar los resultados al escribir en el input de búsqueda.
- El sistema debe mostrar un botón "Agendar cita" por cada resultado.
- Al hacer clic en un pin del mapa, debe mostrar un popup con el nombre y especialidad del doctor.
- Al hacer clic en un resultado, debe redirigir al perfil del doctor.

## Interfaz esperada
- Página con Hero y Footer.
- Sección de búsqueda con input de especialidad.
- Mapa interactivo que ocupe el ancho completo.
- Pines azules (#3498DB) en el mapa.
- Lista de tarjetas de doctores debajo del mapa.
- Cada tarjeta muestra: foto circular, nombre, especialidad, estrellas, distancia, botón "Agendar cita".

## Colores
- Pines del mapa: #3498DB
- Botones: #3498DB
- Fondo: #F5F7FA
- Tarjetas: #FFFFFF
- Texto: #1A1A1A