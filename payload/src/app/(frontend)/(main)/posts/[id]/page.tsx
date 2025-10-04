import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import config from '@/payload.config'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Eye,
  Calendar,
  Share2,
  Bookmark
} from 'lucide-react'
import { Media, User } from '@/payload-types'

interface PostDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const paramsResolved = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  try {
    // Obtener post por ID
    const post = await payload.findByID({
      collection: 'posts',
      id: paramsResolved.id,
      depth: 3
    })

    // Verificar que esté publicado
    if (post.status !== 'published') {
      notFound()
    }

    // Obtener comentarios del post
    const comments = await payload.find({
      collection: 'comments',
      where: {
        and: [
          {
            post: {
              equals: post.id
            }
          },
          {
            status: {
              equals: 'public'
            }
          }
        ]
      },
      sort: '-createdAt',
      depth: 2,
      limit: 20
    })

    // Obtener posts relacionados del mismo autor
    const relatedPosts = await payload.find({
      collection: 'posts',
      where: {
        and: [
          {
            author: {
              equals: (post.author as User).id
            }
          },
          {
            status: {
              equals: 'published'
            }
          },
          {
            id: {
              not_equals: post.id
            }
          }
        ]
      },
      sort: '-publishedAt',
      depth: 2,
      limit: 3
    })

    const author = post.author as User
    const featuredImage = post.featuredImage as Media
    const publishedDate = post.publishedAt ? new Date(post.publishedAt) : new Date(post.createdAt)

    return (
      <div className="">
        {/* Header */}
        <section className="bg-white border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Button variant="outline" size="sm" asChild className="mb-4">
              <Link href="/posts">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a publicaciones
              </Link>
            </Button>

            <div className="flex items-center justify-between">
              <Badge variant={post.type === 'long' ? 'default' : 'secondary'}>
                {post.type === 'long' ? 'Artículo de Blog' : 'Post Corto'}
              </Badge>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartir
                </Button>
                <Button variant="outline" size="sm">
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Contenido principal */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <article className="bg-white shadow-sm border border-border overflow-hidden">
            {/* Header del post */}
            <div className="p-6 border-b border-border">
              {/* Título */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {post.title}
              </h1>

              {/* Información del autor */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={(author.profileImage as Media).url ?? ''}
                      alt={author.fullName}
                    />
                    <AvatarFallback>
                      {author.fullName?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Link
                      href={`/candidatos/${author.id}`}
                      className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                      {author.fullName}
                    </Link>
                    <div className="flex items-center text-xs text-gray-500 space-x-2">
                      <span>
                        {author.userType === 'candidate' && author.candidateInfo?.position && (
                          <>Candidato a {author.candidateInfo.position}</>
                        )}
                      </span>
                      <span>•</span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDistanceToNow(publishedDate, { addSuffix: true, locale: es })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Estadísticas del post */}
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{post.viewsCount || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span>{post.likesCount || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.commentsCount || 0}</span>
                  </div>
                </div>
              </div>

              {/* Categorías y tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {post.categories && Array.isArray(post.categories) && post.categories.length > 0 && (
                  <>
                    {post.categories.map((category, index: number) => (
                      <Badge key={index} variant="outline">
                        {typeof category === 'object' && 'name' in category ? category.name : category}
                      </Badge>
                    ))}
                  </>
                )}
                {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
                  <>
                    {post.tags.map((tagObj, index: number) => (
                      <span key={index} className="text-xs text-primary/80 hover:text-primary">
                        #{typeof tagObj === 'object' && 'tag' in tagObj ? tagObj.tag : tagObj}
                      </span>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Imagen destacada */}
            {featuredImage && (
              <div className="relative h-64 md:h-96">
                <Image
                  src={(featuredImage as Media).url ?? ''}
                  alt={featuredImage.alt || post.title || 'Imagen del post'}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Contenido */}
            <div className="p-6">
              {post.excerpt && post.type === 'long' && (
                <div className="mb-6">
                  <p className="text-lg text-gray-700 leading-relaxed italic border-l-4 border-border pl-4">
                    {post.excerpt}
                  </p>
                </div>
              )}

              <div className="prose prose-lg max-w-none">
                <RichText data={post.content} />
              </div>

              {/* Galería de imágenes */}
              {post.gallery && Array.isArray(post.gallery) && post.gallery.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Galería</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {post.gallery.map((item, index: number) => (
                      <div key={index} className="relative">
                        <Image
                          src={(item.image as Media).url || ''}
                          alt={item.caption || `Imagen ${index + 1}`}
                          width={400}
                          height={300}
                          className="w-full h-48 object-cover"
                        />
                        {item.caption && (
                          <p className="text-sm text-gray-600 mt-2">{item.caption}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Acciones */}
            <Separator />
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <Heart className="h-4 w-4" />
                    <span>Me gusta ({post.likesCount || 0})</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <MessageCircle className="h-4 w-4" />
                    <span>Comentar ({post.commentsCount || 0})</span>
                  </Button>
                </div>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartir
                </Button>
              </div>
            </div>
          </article>

          {/* Comentarios */}
          {post.allowComments && (
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-bold">
                    Comentarios ({comments.totalDocs})
                  </h2>
                </CardHeader>
                <CardContent>
                  {comments.docs.length > 0 ? (
                    <div className="space-y-6">
                      {comments.docs.map((comment) => (
                        <div key={comment.id} className="border-b border-border pb-4 last:border-b-0">
                          <div className="flex items-start space-x-3">
                            {/* <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={comment.author?.profileImage?.url}
                                alt={comment.author?.fullName}
                              />
                              <AvatarFallback>
                                {comment.author?.fullName?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U'}
                              </AvatarFallback>
                            </Avatar> */}
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-sm font-semibold text-gray-900">
                                  {(comment.author as User)?.fullName}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: es })}
                                </span>
                              </div>
                              <div className="text-sm text-gray-700">
                                <RichText data={comment.content} />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">No hay comentarios aún.</p>
                      <p className="text-sm text-gray-500">¡Sé el primero en comentar!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Posts relacionados */}
          {relatedPosts.docs.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Más publicaciones de {author.fullName}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.docs.map((relatedPost) => (
                  <Card key={relatedPost.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <Link href={`/posts/${relatedPost.id}`}>
                        <h3 className="font-semibold text-primary hover:primary/80 transition-colors line-clamp-2 mb-2">
                          {relatedPost.title}
                        </h3>
                      </Link>
                      {relatedPost.excerpt && (
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {relatedPost.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                        <span>
                          {formatDistanceToNow(
                            new Date(relatedPost.publishedAt || relatedPost.createdAt),
                            { addSuffix: true, locale: es }
                          )}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {relatedPost.type === 'long' ? 'Blog' : 'Post'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  } catch (_error) {
    notFound()
  }
}
