import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import config from '@/payload.config'
import { PostCard } from '@/components/home/PostCard'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen,
  ArrowLeft,
  TrendingUp
} from 'lucide-react'

export default async function PostsPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Obtener todos los posts publicados
  const posts = await payload.find({
    collection: 'posts',
    where: {
      status: {
        equals: 'published'
      }
    },
    sort: '-publishedAt',
    depth: 2,
    limit: 20
  })

  // Obtener posts fijados
  const pinnedPosts = await payload.find({
    collection: 'posts',
    where: {
      and: [
        {
          status: {
            equals: 'published'
          }
        },
        {
          isPinned: {
            equals: true
          }
        }
      ]
    },
    sort: '-publishedAt',
    depth: 2,
    limit: 5
  })

  // Obtener categorías disponibles
  const categories = await payload.find({
    collection: 'categories',
    limit: 20,
    sort: 'name'
  })

  // Separar posts por tipo
  const longPosts = posts.docs.filter(post => post.type === 'long')
  const shortPosts = posts.docs.filter(post => post.type === 'short')

  return (
    <div className="">
      {/* Header */}
      <section className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col items-start space-y-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al inicio
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <BookOpen className="mr-3 h-8 w-8 text-primary" />
                  Publicaciones
                </h1>
                <p className="text-gray-600 mt-1">
                  Todas las propuestas y publicaciones de los candidatos
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="text-base px-4 py-2">
              {posts.totalDocs} publicaciones
            </Badge>
          </div>

          {/* Categorías */}
          {categories.docs.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Categorías:</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                  Todas
                </Badge>
                {categories.docs.map((category) => (
                  <Badge
                    key={category.id}
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {posts.docs.length > 0 ? (
          <div className="space-y-12">
            {/* Posts Destacados */}
            {pinnedPosts.docs.length > 0 && (
              <section>
                <div className="flex items-center mb-6">
                  <TrendingUp className="mr-2 h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold text-primary">
                    Posts Destacados
                  </h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {pinnedPosts.docs.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </section>
            )}

            {/* Blogs/Posts Largos */}
            {longPosts.length > 0 && (
              <section>
                <div className="flex items-center mb-6">
                  <BookOpen className="mr-2 h-6 w-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Artículos de Blog
                  </h2>
                  <Badge variant="outline" className="ml-3">
                    {longPosts.length} artículo{longPosts.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {longPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </section>
            )}

            {/* Posts Cortos */}
            {shortPosts.length > 0 && (
              <section>
                <div className="flex items-center mb-6">
                  <BookOpen className="mr-2 h-6 w-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Posts Cortos
                  </h2>
                  <Badge variant="outline" className="ml-3">
                    {shortPosts.length} post{shortPosts.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                <div className="space-y-6">
                  {shortPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </section>
            )}

            {/* Todos los posts si no hay separación */}
            {longPosts.length === 0 && shortPosts.length === 0 && posts.docs.length > 0 && (
              <section>
                <div className="flex items-center mb-6">
                  <BookOpen className="mr-2 h-6 w-6 text-gray-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Todas las Publicaciones
                  </h2>
                </div>
                <div className="space-y-6">
                  {posts.docs.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-16">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No hay publicaciones disponibles
              </h3>
              <p className="text-gray-600 mb-6">
                Aún no se han publicado propuestas o artículos.
              </p>
              <Button asChild>
                <Link href="/">Volver al inicio</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
