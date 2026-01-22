---
trigger: always_on
---

1. Estructura de Archivos
Organización de carpetas (interfaces, services, components, pages)
2. Interfaces y DTOs
Template con index signature
CreateDto, UpdateDto, FilterDto
3. API Service
Template completo
Usar PUT (no PATCH)
Manejo de filtros
4. Página Principal
Imports necesarios
Estado completo
useCallback para evitar bucles
Handlers CRUD
Columnas de DataTable
Configuración de filtros
JSX con estructura exacta
5. Modales
CreateModal template
EditModal template
Manejo de errores
6. Integración
Rutas
Menú lateral
7. Checklist de Estandarización
Lista completa de verificación
8. Colores y Estilos Clave
Todos los colores exactos
Espaciados
9. Errores Comunes
Qué NO hacer
Qué SÍ hacer
Puntos Clave:
Botón principal: variant="brand" (rojo)
Botones acción: text-gray-400 hover:text-brand-blue / hover:text-red-600
Layout: mb-6 (NO space-y-6)
Iconos: material-symbols (NO tabler-icons)
Método HTTP: PUT (NO PATCH)
Debounce: 300ms en búsqueda