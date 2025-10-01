import type { CollectionConfig } from 'payload'
import { validateCandidateOnly } from '../lib/hooks'
import { User } from '@/payload-types'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'author', 'status', 'createdAt'],
  },
  access: {
    read: () => true, // Todos pueden leer posts públicos
    create: ({ req: { user } }) => {
      // Solo candidatos pueden crear posts
      return Boolean(user && (user as User).userType === 'candidate')
    },
    update: ({ req: { user } }) => {
      // Solo el autor puede editar su post
      if (user) {
        return {
          author: {
            equals: user.id,
          },
        }
      }
      return false
    },
    delete: ({ req: { user } }) => {
      // Solo el autor puede eliminar su post
      if (user) {
        return {
          author: {
            equals: user.id,
          },
        }
      }
      return false
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Título',
      admin: {
        description: 'Título del post (opcional para posts cortos)',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Post Corto',
          value: 'short',
        },
        {
          label: 'Post Largo (Blog)',
          value: 'long',
        },
      ],
      defaultValue: 'short',
      admin: {
        description: 'Tipo de publicación: corta (estilo Facebook) o larga (estilo Medium)',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Contenido',
      admin: {
        description: 'Contenido principal del post',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Resumen',
      admin: {
        condition: (data) => data.type === 'long',
        description: 'Breve resumen para posts largos (se muestra en previews)',
      },
    },
    {
      name: 'featuredImage',
      type: 'relationship',
      relationTo: 'media',
      label: 'Imagen Destacada',
      admin: {
        description: 'Imagen principal del post',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Galería de Imágenes',
      admin: {
        description: 'Imágenes adicionales para el post',
      },
      fields: [
        {
          name: 'image',
          type: 'relationship',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Descripción',
        },
      ],
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Autor',
      admin: {
        description: 'Candidato que publica el post',
      },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      label: 'Categorías',
      admin: {
        description: 'Categorías del post para mejor organización',
      },
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Etiquetas',
      admin: {
        description: 'Etiquetas para categorizar el post',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Borrador',
          value: 'draft',
        },
        {
          label: 'Publicado',
          value: 'published',
        },
        {
          label: 'Archivado',
          value: 'archived',
        },
      ],
      defaultValue: 'draft',
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Fecha de Publicación',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Fecha y hora de publicación (se asigna automáticamente)',
      },
    },
    {
      name: 'allowComments',
      type: 'checkbox',
      label: 'Permitir Comentarios',
      defaultValue: true,
      admin: {
        description: 'Si está desmarcado, no se podrán hacer comentarios en este post',
      },
    },
    {
      name: 'isPinned',
      type: 'checkbox',
      label: 'Post Fijado',
      defaultValue: false,
      admin: {
        description: 'Los posts fijados aparecen primero en el feed',
      },
    },
    // Campos virtuales para contar interacciones (se calculan dinámicamente)
    {
      name: 'likesCount',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'Número de likes (calculado automáticamente)',
      },
      defaultValue: 0,
    },
    {
      name: 'commentsCount',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'Número de comentarios (calculado automáticamente)',
      },
      defaultValue: 0,
    },
    {
      name: 'viewsCount',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'Número de vistas (calculado automáticamente)',
      },
      defaultValue: 0,
    },
  ],
  hooks: {
    beforeChange: [
      validateCandidateOnly,
      ({ data, operation }) => {
        // Asignar fecha de publicación automáticamente
        if (operation === 'create' && data.status === 'published' && !data.publishedAt) {
          data.publishedAt = new Date().toISOString()
        }
        
        // Si no tiene título y es post corto, usar preview del contenido
        if (!data.title && data.type === 'short' && data.content) {
          // Extraer texto plano del rich text para crear un título automático
          const textContent = typeof data.content === 'string' ? data.content : JSON.stringify(data.content)
          data.title = textContent.slice(0, 50) + (textContent.length > 50 ? '...' : '')
        }
        
        return data
      },
    ],
  },
  timestamps: true,
}