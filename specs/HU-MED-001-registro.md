# HU-MED-001: Registro de médico

## Historia de Usuario
Como médico, quiero registrarme, iniciar y cerrar sesión, y recuperar contraseña, para acceder de forma segura al sistema.

## Rol
Médico

## Prioridad
Alta

## Riesgo
Alto

## Desarrollador responsable
María Fernanda Rodríguez Loachamin

## Criterios de Aceptación
- El sistema debe permitir al médico registrarse con sus datos profesionales.
- El sistema debe solicitar nombre, apellido, especialidad, certificaciones, títulos, edad e información de contacto.
- El sistema debe tener un diseño de interfaz intuitivo para el registro.
- El sistema debe garantizar la seguridad de los datos ingresados.
- El sistema debe permitir al médico iniciar sesión, cerrar sesión y recuperar contraseña una vez registrado.

## Observación
Debe existir un diseño de interfaces intuitivos para realizar el registro, con requerimientos específicos.

## Interfaz esperada
- Página de registro con logo QuitoHampi.
- Formulario con campos: nombre, apellido, email, especialidad (select), teléfono, contraseña.
- Zona de subida de documentos (título, licencia) con límite de 3MB por archivo.
- Formatos aceptados: PDF, JPG, PNG.
- Botón "Registrarse".
- Validación de campos obligatorios.
- Mensaje de éxito: "Registro exitoso, pendiente de verificación".
- Mensaje de error si faltan campos: "Campos obligatorios incompletos".
- Enlace a "Iniciar sesión".

## Colores
- Logo Quito: #2C3E55
- Logo Hampi: #3498DB
- Botones: #3498DB
- Borde de zona de archivos: #E0E0E0
- Fondo: #F5F7FA
- Texto: #1A1A1A