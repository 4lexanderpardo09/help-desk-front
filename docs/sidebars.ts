import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Acceso',
      items: [
        'acceso/iniciar-sesion',
      ],
    },
    {
      type: 'category',
      label: 'Dashboard',
      items: [
        'dashboard/panel-principal',
      ],
    },
    {
      type: 'category',
      label: 'Tickets',
      items: [
        'tickets/crear-ticket',
        'tickets/ver-tickets',
        'tickets/responder-ticket',
        'tickets/reabrir-tickets',
        'tickets/gestionar-etiquetas',
        'tickets/gestionar-notificaciones',
        'tickets/estados-tickets',
      ],
    },
    {
      type: 'category',
      label: 'Usuarios',
      items: [
        'usuarios/gestionar-usuarios',
        'usuarios/roles-permisos',
        'usuarios/mi-perfil',
      ],
    },
    {
      type: 'category',
      label: 'Organigrama',
      items: [
        'organigrama/gestion-organigrama',
      ],
    },
    {
      type: 'category',
      label: 'Administración',
      items: [
        'administracion/gestion-empresas',
        'administracion/gestion-zonas',
        'administracion/gestion-regionales',
        'administracion/gestion-departamentos',
        'administracion/gestion-cargos',
        'administracion/gestion-perfiles',
        'administracion/gestion-categorias',
        'administracion/gestion-subcategorias',
        'administracion/gestion-tipos-errores',
        'administracion/gestion-respuestas-rapidas',
        'administracion/reglas-mapeo',
      ],
    },
    {
      type: 'category',
      label: 'Workflows',
      items: [
        'workflows/lista-workflows',
        'workflows/gestion-pasos',
      ],
    },
    'faq',
  ],
};

export default sidebars;
