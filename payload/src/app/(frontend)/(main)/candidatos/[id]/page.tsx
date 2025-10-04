import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import config from '@/payload.config'
import { PostCard } from '@/components/home/PostCard'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RichText } from '@payloadcms/richtext-lexical/react'
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Calendar,
  ExternalLink,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Globe,
  BookOpen,
  User
} from 'lucide-react'
import { Media } from '@/payload-types'

interface CandidateDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function CandidateDetailPage({ params }: CandidateDetailPageProps) {
  const paramsResolved = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Obtener candidato por ID
  try {
    const candidate = await payload.findByID({
      collection: 'users',
      id: paramsResolved.id,
      depth: 2
    })

    // Verificar que sea un candidato
    if (candidate.userType !== 'candidate') {
      notFound()
    }

    // Obtener posts del candidato
    const candidatePosts = await payload.find({
      collection: 'posts',
      where: {
        and: [
          {
            author: {
              equals: candidate.id
            }
          },
          {
            status: {
              equals: 'published'
            }
          }
        ]
      },
      sort: '-publishedAt',
      depth: 2,
      limit: 10
    })

    const profileImage = candidate.profileImage as Media
    const candidateInfo = candidate.candidateInfo

    const getFacultyName = (facultyCode: string) => {
      const faculties: Record<string, string> = {
        'ips': 'Ingeniería de Producción y Servicios',
        'civil': 'Ingeniería Civil',
        'procesos': 'Ingeniería de Procesos',
        'medicina': 'Medicina Humana',
        'enfermeria': 'Enfermería',
        'biologicas': 'Ciencias Biológicas y Agropecuarias',
        'naturales': 'Ciencias Naturales y Formales',
        'sociales': 'Ciencias Sociales',
        'educacion': 'Ciencias de la Educación',
        'contables': 'Ciencias Contables y Financieras',
        'administracion': 'Administración',
        'derecho': 'Derecho',
        'psicologia': 'Psicología, RR.II. y CC. de la Comunicación',
        'filosofia': 'Filosofía y Humanidades',
        'arquitectura': 'Arquitectura y Urbanismo'
      }
      return faculties[facultyCode] || facultyCode
    }

    const getPositionName = (positionCode: string) => {
      const positions: Record<string, string> = {
        'rector': 'Rector',
        'vicerrector_academico': 'Vicerrector Académico',
        'vicerrector_investigacion': 'Vicerrector de Investigación',
        'decano': 'Decano',
        'vicedecano': 'Vicedecano',
        'director_escuela': 'Director de Escuela',
        'representante_estudiantil': 'Representante Estudiantil'
      }
      return positions[positionCode] || positionCode
    }

    return (
      <div className="">
        {/* Header del candidato */}
        <section className="bg-white border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <Button variant="outline" size="sm" asChild>
                <Link href="/candidatos">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a candidatos
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Información principal */}
              <div className="lg:col-span-2">
                <div className="flex items-start space-x-6">
                  {/* Foto del candidato */}
                  <div className="flex-shrink-0">
                    {profileImage?.url ? (
                      <Image
                        src={profileImage.url}
                        alt={candidate.fullName}
                        width={150}
                        height={150}
                        className="w-32 h-32 md:w-40 md:h-40 object-cover border-4 border-border"
                      />
                    ) : (
                      <div className="w-32 h-32 md:w-40 md:h-40 bg-blue-100 flex items-center justify-center border-4 border-border">
                        <User className="h-16 w-16 text-primary" />
                      </div>
                    )}
                  </div>

                  {/* Info básica */}
                  <div className="flex-1 min-w-0">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                      {candidate.fullName}
                    </h1>

                    {candidateInfo?.position && (
                      <div className="flex items-center text-lg text-gray-700 mb-2">
                        <Briefcase className="h-5 w-5 mr-2 text-primary" />
                        <span>Candidato a {getPositionName(candidateInfo.position)}</span>
                      </div>
                    )}

                    {candidateInfo?.faculty && (
                      <div className="flex items-center text-gray-600 mb-4">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{getFacultyName(candidateInfo.faculty)}</span>
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <Badge variant="default" className="text-base px-3 py-1">
                        Candidato
                      </Badge>
                      <Badge variant="outline" className="text-base px-3 py-1">
                        {candidatePosts.totalDocs} publicaciones
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Biografía */}
                {candidate.bio && (
                  <div className="mt-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-3">Biografía</h2>
                    <p className="text-gray-700 leading-relaxed">
                      {candidate.bio}
                    </p>
                  </div>
                )}
              </div>

              {/* Redes sociales */}
              <div className="lg:col-span-1">
                {candidateInfo?.socialLinks && (
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold">Redes Sociales</h3>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {candidateInfo.socialLinks.facebook && (
                          <a
                            href={candidateInfo.socialLinks.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-primary/80 hover:text-primary transition-colors"
                          >
                            <Facebook className="h-5 w-5 mr-3" />
                            <span>Facebook</span>
                            <ExternalLink className="h-4 w-4 ml-auto" />
                          </a>
                        )}
                        {candidateInfo.socialLinks.twitter && (
                          <a
                            href={candidateInfo.socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-primary/80 hover:text-primary transition-colors"
                          >
                            <Twitter className="h-5 w-5 mr-3" />
                            <span>Twitter/X</span>
                            <ExternalLink className="h-4 w-4 ml-auto" />
                          </a>
                        )}
                        {candidateInfo.socialLinks.instagram && (
                          <a
                            href={candidateInfo.socialLinks.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-pink-600 hover:text-pink-800 transition-colors"
                          >
                            <Instagram className="h-5 w-5 mr-3" />
                            <span>Instagram</span>
                            <ExternalLink className="h-4 w-4 ml-auto" />
                          </a>
                        )}
                        {candidateInfo.socialLinks.linkedin && (
                          <a
                            href={candidateInfo.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-primary/80 hover:text-primary transition-colors"
                          >
                            <Linkedin className="h-5 w-5 mr-3" />
                            <span>LinkedIn</span>
                            <ExternalLink className="h-4 w-4 ml-auto" />
                          </a>
                        )}
                        {candidateInfo.socialLinks.website && (
                          <a
                            href={candidateInfo.socialLinks.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            <Globe className="h-5 w-5 mr-3" />
                            <span>Sitio Web</span>
                            <ExternalLink className="h-4 w-4 ml-auto" />
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contenido principal */}
            <div className="lg:col-span-2 space-y-8">
              {/* Propuesta electoral */}
              {candidateInfo?.proposal && (
                <Card>
                  <CardHeader>
                    <h2 className="text-2xl font-bold text-gray-900">Propuesta Electoral</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-lg max-w-none">
                      <RichText data={candidateInfo.proposal} />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Publicaciones del candidato */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <BookOpen className="mr-2 h-6 w-6 text-green-600" />
                    Publicaciones
                  </h2>
                  <Badge variant="outline">
                    {candidatePosts.totalDocs} publicación{candidatePosts.totalDocs !== 1 ? 'es' : ''}
                  </Badge>
                </div>

                {candidatePosts.docs.length > 0 ? (
                  <div className="space-y-6">
                    {candidatePosts.docs.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        Este candidato aún no ha publicado contenido.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Experiencia */}
              {candidateInfo?.experience && Array.isArray(candidateInfo.experience) && candidateInfo.experience.length > 0 && (
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Experiencia</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {candidateInfo.experience.map((exp, index: number) => (
                        <div key={index} className="border-l-2 border-border pl-4">
                          <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                          <p className="text-gray-700">{exp.organization}</p>
                          {exp.period && (
                            <p className="text-sm text-gray-500 flex items-center mt-1">
                              <Calendar className="h-3 w-3 mr-1" />
                              {exp.period}
                            </p>
                          )}
                          {exp.description && (
                            <p className="text-sm text-gray-600 mt-2">{exp.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  } catch (_error) {
    notFound()
  }
}
