import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import config from '@/payload.config'
import { PostCard } from '../../components/home/PostCard'
import { CandidateCard } from '../../components/home/CandidateCard'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  Calendar,
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

  // const update = await payload.create({
  //   collection: 'posts',
  //   data: {

  //   }
  // })

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

  // Obtener estadísticas básicas
  const postsCount = await payload.count({ collection: 'posts' })
  const candidatesCount = await payload.count({ 
    collection: 'users',
    where: {
      userType: {
        equals: 'candidate'
      }
    }
  })

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">
              Elecciones UNSA 2026
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
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
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
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

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{candidatesCount.totalDocs}</div>
              <div className="text-gray-600">Candidatos</div>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{postsCount.totalDocs}</div>
              <div className="text-gray-600">Publicaciones</div>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">2026</div>
              <div className="text-gray-600">Elecciones</div>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">24/7</div>
              <div className="text-gray-600">Disponible</div>
            </div>
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
                    <TrendingUp className="mr-2 h-6 w-6 text-blue-600" />
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
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <BookOpen className="mr-2 h-6 w-6 text-green-600" />
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
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Users className="mr-2 h-6 w-6 text-purple-600" />
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