# HU-ADM-001: Inicio de sesión

## Historia de Usuario
Como administrador, quiero iniciar y cerrar sesión, recuperar la contraseña, para acceder de forma segura al sistema.

## Rol
Administrador

## Prioridad
Alta

## Riesgo
Alto

## Desarrollador responsable
Andrés Gustavo Oto Caza

## Criterios de Aceptación
- El sistema debe validar las credenciales de email y contraseña al iniciar sesión.
- El sistema debe permitir cambiar la contraseña con validación de seguridad.
- El sistema debe bloquear el acceso por 5 minutos después de 3 intentos fallidos consecutivos.
- El sistema debe permitir recuperar la contraseña mediante un enlace enviado al correo electrónico.
- El sistema debe tener un administrador registrado permanentemente en la base de datos.

## Observación
Debe existir un administrador que garantice un registro permanente en la base de datos de los usuarios.

## Interfaz esperada
- Página de login con logo QuitoHampi.
- Campos: email y contraseña.
- Botón "Ingresar".
- Enlace "¿Olvidaste tu contraseña?".
- Pantalla de recuperación con campo de email y botón "Enviar enlace".
- Mensaje de bloqueo tras 3 intentos fallidos.

## Colores
- Logo Quito: #2C3E55
- Logo Hampi: #3498DB
- Botones: #3498DB
- Fondo: #F5F7FA
- Texto: #1A1A1A