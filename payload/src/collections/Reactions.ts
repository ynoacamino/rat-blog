import type { CollectionConfig } from 'payload'
import { 
  updateReactionCountsAfterChange, 
  updateReactionCountsAfterDelete, 
  createReactionNotification 
} from '../lib/hooks'

export const Reactions: CollectionConfig = {
  slug: 'reactions',
  admin: {
    useAsTitle: 'type',
    defaultColumns: ['type', 'user', 'targetType', 'target', 'createdAt'],
  },
  access: {
    read: () => true, // Todos pueden leer reacciones
    create: ({ req: { user } }) => {
      // Solo usuarios autenticados pueden reaccionar
      return Boolean(user)
    },
    update: ({ req: { user } }) => {
      // Solo el usuario puede cambiar su reacción
      if (user) {
        return {
          user: {
            equals: user.id,
          },
        }
      }
      return false
    },
    delete: ({ req: { user } }) => {
      // Solo el usuario puede eliminar su reacción
      if (user) {
        return {
          user: {
            equals: user.id,
          },
        }
      }
      return false
    },
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        {
          label: '👍 Like',
          value: 'like',
        },
        {
          label: '❤️ Love',
          value: 'love',
        },
        {
          label: '💪 Support',
          value: 'support',
        },
        {
          label: '🎉 Celebrate',
          value: 'celebrate',
        },
        {
          label: '💡 Insightful',
          value: 'insightful',
        },
      ],
      defaultValue: 'like',
      admin: {
        description: 'Tipo de reacción',
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Usuario',
      admin: {
        description: 'Usuario que reacciona',
      },
    },
    {
      name: 'targetType',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Post',
          value: 'post',
        },
        {
          label: 'Comentario',
          value: 'comment',
        },
      ],
      admin: {
        description: 'Tipo de contenido al que se reacciona',
      },
    },
    {
      name: 'targetId',
      type: 'text',
      required: true,
      label: 'ID del Objetivo',
      admin: {
        description: 'ID del post o comentario al que se reacciona',
      },
    },
  ],
  timestamps: true,
  hooks: {
    afterChange: [updateReactionCountsAfterChange, createReactionNotification],
    afterDelete: [updateReactionCountsAfterDelete],
  },
  // Índice único para evitar reacciones duplicadas del mismo usuario al mismo contenido
  indexes: [
    {
      fields: ['user', 'targetType', 'targetId'],
      unique: true,
    },
  ],
}