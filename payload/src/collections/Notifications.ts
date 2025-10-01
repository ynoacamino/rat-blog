import type { CollectionConfig } from 'payload'

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: {
    useAsTitle: 'message',
    defaultColumns: ['message', 'recipient', 'type', 'read', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      // Los usuarios solo pueden ver sus propias notificaciones
      if (user) {
        return {
          recipient: {
            equals: user.id,
          },
        }
      }
      return false
    },
    create: () => true, // El sistema puede crear notificaciones
    update: ({ req: { user } }) => {
      // Los usuarios solo pueden marcar como leídas sus notificaciones
      if (user) {
        return {
          recipient: {
            equals: user.id,
          },
        }
      }
      return false
    },
    delete: ({ req: { user } }) => {
      // Los usuarios pueden eliminar sus notificaciones
      if (user) {
        return {
          recipient: {
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
        { label: 'Nuevo comentario en tu post', value: 'new_comment_on_post' },
        { label: 'Respuesta a tu comentario', value: 'reply_to_comment' },
        { label: 'Like en tu post', value: 'like_on_post' },
        { label: 'Like en tu comentario', value: 'like_on_comment' },
        { label: 'Mención en post', value: 'mention_in_post' },
        { label: 'Mención en comentario', value: 'mention_in_comment' },
        { label: 'Nuevo seguidor', value: 'new_follower' },
        { label: 'Post de candidato seguido', value: 'followed_candidate_post' },
        { label: 'Sistema', value: 'system' },
      ],
      admin: {
        description: 'Tipo de notificación',
      },
    },
    {
      name: 'recipient',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Destinatario',
      admin: {
        description: 'Usuario que recibe la notificación',
      },
    },
    {
      name: 'sender',
      type: 'relationship',
      relationTo: 'users',
      label: 'Remitente',
      admin: {
        description: 'Usuario que genera la notificación (si aplica)',
      },
    },
    {
      name: 'message',
      type: 'text',
      required: true,
      label: 'Mensaje',
      admin: {
        description: 'Texto de la notificación',
      },
    },
    {
      name: 'read',
      type: 'checkbox',
      label: 'Leída',
      defaultValue: false,
      admin: {
        description: 'Si la notificación ha sido leída',
      },
    },
    {
      name: 'relatedPost',
      type: 'relationship',
      relationTo: 'posts',
      label: 'Post Relacionado',
      admin: {
        description: 'Post relacionado con la notificación (si aplica)',
      },
    },
    {
      name: 'relatedComment',
      type: 'relationship',
      relationTo: 'comments',
      label: 'Comentario Relacionado',
      admin: {
        description: 'Comentario relacionado con la notificación (si aplica)',
      },
    },
    {
      name: 'actionUrl',
      type: 'text',
      label: 'URL de Acción',
      admin: {
        description: 'URL a la que dirigir cuando se haga clic en la notificación',
      },
    },
    {
      name: 'readAt',
      type: 'date',
      label: 'Fecha de Lectura',
      admin: {
        readOnly: true,
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Fecha y hora en que se marcó como leída',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Marcar fecha de lectura cuando se marca como leída
        if (data.read && !data.readAt) {
          data.readAt = new Date().toISOString()
        }
        
        return data
      },
    ],
  },
  timestamps: true,
}