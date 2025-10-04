import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import config from '@/payload.config'
import { PostCard } from '@/components/home/PostCard'
import { CandidateCard } from '@/components/home/CandidateCard'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp,
  Users,
  BookOpen,
  ArrowRight
} from 'lucide-react'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  // Obtener posts recientes
  const recentPosts = await payload.find({
    collection: 'posts',
    where: {
      status: {
        equals: 'published'
      }
    },
    sort: '-publishedAt',
    limit: 6,
    depth: 2
  })

  // Obtener candidatos activos
  const candidates = await payload.find({
    collection: 'users',
    where: {
      userType: {
        equals: 'candidate'
      },
      isActive: {
        equals: true
      }
    },
    limit: 8,
    depth: 1
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
    limit: 3,
    depth: 2
  })

  return (
    <div className="">
      {/* Hero Section */}
      <section className="bg-gradient-to-br bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 text-primary-foreground">
              Elecciones UNSA 2026
            </h1>
            <p className="text-xl text-primary-foreground mb-8 leading-relaxed">
              Plataforma oficial para conocer a los candidatos y sus propuestas
              para las elecciones universitarias de la Universidad Nacional de San Agustín
            </p>

            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/candidatos">
                    <Users className="mr-2 h-5 w-5" />
                    Ver Candidatos
                  </Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/posts">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Leer Propuestas
                  </Link>
                </Button>
              </div>
            )}

            {user && (
              <div className="text-lg">
                <p className="mb-4">
                  Bienvenido, <strong>{user.fullName}</strong>
                </p>
                {user.userType === 'candidate' && (
                  <Badge variant="secondary" className="text-base px-4 py-2">
                    Candidato Registrado
                  </Badge>
                )}
                {user.userType === 'voter' && (
                  <Badge variant="secondary" className="text-base px-4 py-2">
                    Votante Registrado
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Principal - Posts */}
          <div className="lg:col-span-2">
            {/* Posts Fijados */}
            {pinnedPosts.docs.length > 0 && (
              <section className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <TrendingUp className="mr-2 h-6 w-6 text-primary" />
                    Posts Destacados
                  </h2>
                </div>
                <div className="space-y-4">
                  {pinnedPosts.docs.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </section>
            )}

            {/* Posts Recientes */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-primary flex items-center">
                  <BookOpen className="mr-2 h-6 w-6 text-primary" />
                  Publicaciones Recientes
                </h2>
                <Button variant="outline" asChild>
                  <Link href="/posts">
                    Ver todos
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {recentPosts.docs.length > 0 ? (
                <div className="space-y-4">
                  {recentPosts.docs.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No hay publicaciones disponibles.</p>
                  </CardContent>
                </Card>
              )}
            </section>
          </div>

          {/* Sidebar - Candidatos */}
          <div className="lg:col-span-1">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-primary flex items-center">
                  <Users className="mr-2 h-6 w-6 text-primary" />
                  Candidatos
                </h2>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/candidatos">
                    Ver todos
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {candidates.docs.length > 0 ? (
                <div className="space-y-4">
                  {candidates.docs.slice(0, 4).map((candidate) => (
                    <CandidateCard key={candidate.id} candidate={candidate} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Users className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 text-sm">No hay candidatos registrados.</p>
                  </CardContent>
                </Card>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
