---
trigger: always_on
---

Objetivo:
Garantizar que toda funcionalidad desarrollada cuente con documentación clara para usuarios finales y desarrolladores, generable automáticamente.

Manual de Usuario (Docusaurus + MDX)

Toda nueva funcionalidad debe documentarse en MDX dentro del proyecto Docusaurus.

La documentación debe:

Estar escrita en lenguaje no técnico.

Explicar el objetivo, pasos, resultados esperados y errores comunes.

Incluir títulos claros, listas numeradas y advertencias cuando aplique.

No incluir código técnico ni conceptos internos de implementación.

El contenido debe ser exportable a web y PDF.

Documentación Visual (Storybook)

Todo componente UI reutilizable debe:

Tener al menos una Story funcional.

Documentar sus estados principales (default, loading, disabled, error).

La documentación en Storybook es solo para equipos técnicos.

No duplicar contenido del manual de usuario.

Documentación Técnica (Typedoc)

Todo código TypeScript público debe:

Estar documentado con comentarios compatibles con Typedoc.

Explicar propósito, parámetros y valor de retorno.

No describir flujos de negocio orientados al usuario final.

Separación de Responsabilidades

Usuarios finales → Docusaurus

Diseño / Frontend / QA → Storybook

Desarrolladores → Typedoc

No mezclar audiencias ni contenidos entre herramientas.

Flujo de Trabajo

Implementar funcionalidad

Documentar flujo de usuario en Docusaurus

Documentar componentes en Storybook

Documentar lógica y tipos en Typedoc

Validar que la documentación compile sin errores

Criterio de Aceptación

Una funcionalidad no se considera terminada si:

No existe documentación de usuario.

No existen stories para nuevos componentes.

El código público no está documentado.

Principio Clave

Si el usuario no puede entender cómo usarlo sin ayuda del desarrollador, la funcionalidad está incompleta.