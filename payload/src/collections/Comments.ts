import type { CollectionConfig } from 'payload'
import { 
  updateCommentCountsAfterChange, 
  updateCommentCountsAfterDelete, 
  createCommentNotification 
} from '../lib/hooks'

export const Comments: CollectionConfig = {
  slug: 'comments',
  admin: {
    useAsTitle: 'content',
    defaultColumns: ['content', 'author', 'post', 'parentComment', 'createdAt'],
  },
  access: {
    read: () => true, // Todos pueden leer comentarios
    create: ({ req: { user } }) => {
      // Solo usuarios autenticados pueden comentar
      return Boolean(user)
    },
    update: ({ req: { user } }) => {
      // Solo el autor puede editar su comentario
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
      // Solo el autor puede eliminar su comentario
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
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Comentario',
      admin: {
        description: 'Contenido del comentario',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Autor',
      admin: {
        description: 'Usuario que hace el comentario',
      },
    },
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      required: true,
      label: 'Post',
      admin: {
        description: 'Post al que pertenece el comentario',
      },
    },
    {
      name: 'parentComment',
      type: 'relationship',
      relationTo: 'comments',
      label: 'Comentario Padre',
      admin: {
        description: 'Si es una respuesta a otro comentario, seleccionar el comentario padre',
      },
    },
    {
      name: 'isEdited',
      type: 'checkbox',
      label: 'Editado',
      defaultValue: false,
      admin: {
        readOnly: true,
        description: 'Indica si el comentario ha sido editado',
      },
    },
    {
      name: 'editedAt',
      type: 'date',
      label: 'Fecha de Edición',
      admin: {
        readOnly: true,
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Última fecha de edición',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Público',
          value: 'public',
        },
        {
          label: 'Oculto',
          value: 'hidden',
        },
        {
          label: 'Reportado',
          value: 'reported',
        },
      ],
      defaultValue: 'public',
      admin: {
        description: 'Estado del comentario',
      },
    },
    // Campo virtual para contar likes
    {
      name: 'likesCount',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'Número de likes (calculado automáticamente)',
      },
      defaultValue: 0,
    },
    // Campo virtual para contar respuestas
    {
      name: 'repliesCount',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'Número de respuestas (calculado automáticamente)',
      },
      defaultValue: 0,
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation, originalDoc }) => {
        // Marcar como editado si es una actualización
        if (operation === 'update' && originalDoc) {
          data.isEdited = true
          data.editedAt = new Date().toISOString()
        }
        
        return data
      },
    ],
    afterChange: [updateCommentCountsAfterChange, createCommentNotification],
    afterDelete: [updateCommentCountsAfterDelete],
  },
  timestamps: true,
}