import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Post, User, Media } from '@/payload-types'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Heart, MessageCircle, Eye, Calendar } from 'lucide-react'

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const author = post.author as User
  const featuredImage = post.featuredImage as Media | null
  const publishedDate = post.publishedAt ? new Date(post.publishedAt) : new Date(post.createdAt)

  return (
    <Card className="w-full mb-6 hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        {/* Autor info */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={(author.profileImage as Media)?.url || undefined}
                alt={author.fullName}
              />
              <AvatarFallback>
                {author.fullName?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <Link
                href={`/candidatos/${author.id}`}
                className="text-sm font-semibold text-gray-primary hover:text-primary transition-colors"
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
          <Badge variant={post.type === 'long' ? 'default' : 'secondary'}>
            {post.type === 'long' ? 'Blog' : 'Post'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {/* Título del post */}
        {post.title && (
          <Link href={`/posts/${post.id}`}>
            <h2 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-3 line-clamp-2">
              {post.title}
            </h2>
          </Link>
        )}

        {/* Imagen destacada */}
        {featuredImage && (
          <div className="mb-4">
            <Image
              src={featuredImage.url || ''}
              alt={featuredImage.alt || post.title || 'Imagen del post'}
              width={800}
              height={400}
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        {/* Contenido del post (preview) */}
        <div className="prose prose-sm max-w-none">
          {post.excerpt ? (
            <p className="text-gray-700 leading-relaxed">{post.excerpt}</p>
          ) : (
            <div className="text-gray-700 leading-relaxed line-clamp-3">
              {post.content && (
                <RichText data={post.content} />
              )}
            </div>
          )}
        </div>

        {/* Categorías */}
        {post.categories && Array.isArray(post.categories) && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.categories.map((category, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {typeof category === 'object' && 'name' in category ? category.name : category}
              </Badge>
            ))}
          </div>
        )}

        {/* Tags */}
        {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {post.tags.map((tagObj, index: number) => (
              <span key={index} className="text-xs text-blue-600 hover:text-blue-800">
                #{typeof tagObj === 'object' && 'tag' in tagObj ? tagObj.tag : tagObj}
              </span>
            ))}
          </div>
        )}
      </CardContent>

      <Separator />

      <CardFooter className="pt-3">
        {/* Interacciones */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1 hover:text-red-500 transition-colors cursor-pointer">
              <Heart className="h-4 w-4" />
              <span>{post.likesCount || 0}</span>
            </div>
            <div className="flex items-center space-x-1 hover:text-blue-500 transition-colors cursor-pointer">
              <MessageCircle className="h-4 w-4" />
              <span>{post.commentsCount || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{post.viewsCount || 0}</span>
            </div>
          </div>

          <Link
            href={`/posts/${post.id}`}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            {post.type === 'long' ? 'Leer más' : 'Ver post'}
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
