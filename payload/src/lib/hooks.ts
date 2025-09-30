import { CollectionAfterChangeHook, CollectionBeforeChangeHook, CollectionAfterDeleteHook } from 'payload'

// Hook para actualizar contadores cuando se crea una reacción
export const updateReactionCountsAfterChange: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
}) => {
  if (operation !== 'create') return

  const { payload } = req

  try {
    const targetType = doc.targetType
    const targetId = doc.targetId

    if (targetType && targetId) {
      // Contar reacciones actuales para el objetivo
      const reactionCount = await payload.count({
        collection: 'reactions',
        where: {
          and: [
            { targetType: { equals: targetType } },
            { targetId: { equals: targetId } }
          ]
        }
      })

      // Actualizar contador en la colección correspondiente
      if (targetType === 'post') {
        await payload.update({
          collection: 'posts',
          id: targetId,
          data: {
            likesCount: reactionCount.totalDocs
          }
        })
      } else if (targetType === 'comment') {
        await payload.update({
          collection: 'comments',
          id: targetId,
          data: {
            likesCount: reactionCount.totalDocs
          }
        })
      }
    }
  } catch (error) {
    console.error('Error updating reaction counts:', error)
  }
}

// Hook para actualizar contadores cuando se elimina una reacción
export const updateReactionCountsAfterDelete: CollectionAfterDeleteHook = async ({
  doc,
  req,
}) => {
  const { payload } = req

  try {
    const targetType = doc.targetType
    const targetId = doc.targetId

    if (targetType && targetId) {
      // Contar reacciones actuales para el objetivo
      const reactionCount = await payload.count({
        collection: 'reactions',
        where: {
          and: [
            { targetType: { equals: targetType } },
            { targetId: { equals: targetId } }
          ]
        }
      })

      // Actualizar contador en la colección correspondiente
      if (targetType === 'post') {
        await payload.update({
          collection: 'posts',
          id: targetId,
          data: {
            likesCount: reactionCount.totalDocs
          }
        })
      } else if (targetType === 'comment') {
        await payload.update({
          collection: 'comments',
          id: targetId,
          data: {
            likesCount: reactionCount.totalDocs
          }
        })
      }
    }
  } catch (error) {
    console.error('Error updating reaction counts after delete:', error)
  }
}

// Hook para crear notificaciones cuando alguien reacciona
export const createReactionNotification: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
}) => {
  if (operation !== 'create') return

  const { payload } = req

  try {
    let recipient = null
    let message = ''
    let actionUrl = ''

    // Obtener el autor del contenido al que se reaccionó
    if (doc.targetType === 'post') {
      const post = await payload.findByID({
        collection: 'posts',
        id: doc.targetId
      })
      
      if (post && post.author && typeof post.author === 'object') {
        recipient = post.author.id
        message = `${req.user?.fullName || 'Alguien'} reaccionó a tu post "${post.title}"`
        actionUrl = `/posts/${post.id}`
      }
    } else if (doc.targetType === 'comment') {
      const comment = await payload.findByID({
        collection: 'comments',
        id: doc.targetId
      })
      
      if (comment && comment.author && typeof comment.author === 'object') {
        recipient = comment.author.id
        message = `${req.user?.fullName || 'Alguien'} reaccionó a tu comentario`
        
        // Obtener el post para generar la URL
        if (comment.post && typeof comment.post === 'object') {
          actionUrl = `/posts/${comment.post.id}#comment-${comment.id}`
        }
      }
    }

    // Crear notificación si no es el mismo usuario reaccionando a su propio contenido
    if (recipient && recipient !== req.user?.id) {
      await payload.create({
        collection: 'notifications',
        data: {
          type: doc.targetType === 'post' ? 'like_on_post' : 'like_on_comment',
          recipient,
          sender: req.user?.id,
          message,
          actionUrl,
          relatedPost: doc.targetType === 'post' ? doc.targetId : undefined,
          relatedComment: doc.targetType === 'comment' ? doc.targetId : undefined,
        }
      })
    }
  } catch (error) {
    console.error('Error creating reaction notification:', error)
  }
}

// Hook para actualizar contador de comentarios en posts cuando se crea
export const updateCommentCountsAfterChange: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
}) => {
  if (operation !== 'create') return

  const { payload } = req

  try {
    const postId = doc.post

    if (postId) {
      // Contar comentarios actuales para el post
      const commentCount = await payload.count({
        collection: 'comments',
        where: {
          post: { equals: typeof postId === 'object' ? postId.id : postId }
        }
      })

      // Actualizar contador en el post
      await payload.update({
        collection: 'posts',
        id: typeof postId === 'object' ? postId.id : postId,
        data: {
          commentsCount: commentCount.totalDocs
        }
      })
    }
  } catch (error) {
    console.error('Error updating comment counts:', error)
  }
}

// Hook para actualizar contador de comentarios cuando se elimina
export const updateCommentCountsAfterDelete: CollectionAfterDeleteHook = async ({
  doc,
  req,
}) => {
  const { payload } = req

  try {
    const postId = doc.post

    if (postId) {
      // Contar comentarios actuales para el post
      const commentCount = await payload.count({
        collection: 'comments',
        where: {
          post: { equals: typeof postId === 'object' ? postId.id : postId }
        }
      })

      // Actualizar contador en el post
      await payload.update({
        collection: 'posts',
        id: typeof postId === 'object' ? postId.id : postId,
        data: {
          commentsCount: commentCount.totalDocs
        }
      })
    }
  } catch (error) {
    console.error('Error updating comment counts after delete:', error)
  }
}

// Hook para crear notificaciones cuando alguien comenta
export const createCommentNotification: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
}) => {
  if (operation !== 'create') return

  const { payload } = req

  try {
    // Si es respuesta a un comentario
    if (doc.parentComment) {
      const parentComment = await payload.findByID({
        collection: 'comments',
        id: typeof doc.parentComment === 'object' ? doc.parentComment.id : doc.parentComment
      })

      if (parentComment && parentComment.author && typeof parentComment.author === 'object') {
        const recipient = parentComment.author.id

        // No notificar si es el mismo usuario respondiendo a su propio comentario
        if (recipient !== req.user?.id) {
          await payload.create({
            collection: 'notifications',
            data: {
              type: 'reply_to_comment',
              recipient,
              sender: req.user?.id,
              message: `${req.user?.fullName || 'Alguien'} respondió a tu comentario`,
              actionUrl: `/posts/${typeof doc.post === 'object' ? doc.post.id : doc.post}#comment-${doc.id}`,
              relatedPost: typeof doc.post === 'object' ? doc.post.id : doc.post,
              relatedComment: doc.id,
            }
          })
        }
      }
    }

    // Notificar al autor del post (si no es respuesta a comentario)
    if (!doc.parentComment && doc.post) {
      const post = await payload.findByID({
        collection: 'posts',
        id: typeof doc.post === 'object' ? doc.post.id : doc.post
      })

      if (post && post.author && typeof post.author === 'object') {
        const recipient = post.author.id

        // No notificar si es el autor del post comentando en su propio post
        if (recipient !== req.user?.id) {
          await payload.create({
            collection: 'notifications',
            data: {
              type: 'new_comment_on_post',
              recipient,
              sender: req.user?.id,
              message: `${req.user?.fullName || 'Alguien'} comentó en tu post "${post.title}"`,
              actionUrl: `/posts/${post.id}#comment-${doc.id}`,
              relatedPost: post.id,
              relatedComment: doc.id,
            }
          })
        }
      }
    }
  } catch (error) {
    console.error('Error creating comment notification:', error)
  }
}

// Función para validar que solo candidatos puedan crear posts
export const validateCandidateOnly: CollectionBeforeChangeHook = async ({ req, operation }) => {
  if (operation === 'create') {
    const user = req.user as any
    
    if (!user || user.userType !== 'candidate') {
      throw new Error('Solo los candidatos pueden crear publicaciones')
    }
  }
}