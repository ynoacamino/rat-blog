import { User } from '@/payload-types'
import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'description', 'color', 'postsCount'],
  },
  access: {
    read: () => true, // Todos pueden leer categorías
    create: ({ req: { user } }) => {
      // Solo candidatos pueden crear categorías
      return Boolean(user && (user as User).userType === 'candidate')
    },
    update: ({ req: { user } }) => {
      // Solo candidatos pueden editar categorías
      return Boolean(user && (user as User).userType === 'candidate')
    },
    delete: ({ req: { user } }) => {
      // Solo candidatos pueden eliminar categorías
      return Boolean(user && (user as User).userType === 'candidate')
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      label: 'Nombre',
      admin: {
        description: 'Nombre de la categoría (ej: Propuestas, Eventos, Debates)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        description: 'URL amigable (se genera automáticamente)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripción',
      admin: {
        description: 'Breve descripción de la categoría',
      },
    },
    {
      name: 'color',
      type: 'text',
      label: 'Color',
      admin: {
        description: 'Color hexadecimal para la categoría (ej: #FF5733)',
      },
    },
    {
      name: 'icon',
      type: 'select',
      label: 'Icono',
      options: [
        { label: '📢 Propuestas', value: 'proposals' },
        { label: '📅 Eventos', value: 'events' },
        { label: '💬 Debates', value: 'debates' },
        { label: '📊 Encuestas', value: 'polls' },
        { label: '📰 Noticias', value: 'news' },
        { label: '🎯 Objetivos', value: 'goals' },
        { label: '🤝 Alianzas', value: 'alliances' },
        { label: '📚 Educación', value: 'education' },
        { label: '💼 Gestión', value: 'management' },
        { label: '🔬 Investigación', value: 'research' },
      ],
      admin: {
        description: 'Icono representativo de la categoría',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Activa',
      defaultValue: true,
      admin: {
        description: 'Si está desactivada, no aparecerá en el frontend',
      },
    },
    // Campo virtual para contar posts
    {
      name: 'postsCount',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'Número de posts en esta categoría (calculado automáticamente)',
      },
      defaultValue: 0,
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Generar slug automáticamente desde el nombre
        if (data.name && !data.slug) {
          data.slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        }
        
        return data
      },
    ],
  },
  timestamps: true,
}