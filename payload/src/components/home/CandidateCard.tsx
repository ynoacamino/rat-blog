import React from 'react'
import Link from 'next/link'
import { User, Media } from '@/payload-types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RichText } from '@payloadcms/richtext-lexical/react'
import {
  MapPin,
  Briefcase,
  Users,
  ExternalLink,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Globe
} from 'lucide-react'

interface CandidateCardProps {
  candidate: User
}

export function CandidateCard({ candidate }: CandidateCardProps) {
  const profileImage = candidate.profileImage as Media | null
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
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={profileImage?.url || undefined}
              alt={candidate.fullName}
            />
            <AvatarFallback className="text-lg">
              {candidate.fullName?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'C'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <Link
              href={`/candidatos/${candidate.id}`}
              className="block"
            >
              <h3 className="text-xl font-bold text-primary hover:text-primary transition-colors">
                {candidate.fullName}
              </h3>
            </Link>

            {candidateInfo?.position && (
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <Briefcase className="h-4 w-4 mr-1" />
                <span>Candidato a {getPositionName(candidateInfo.position)}</span>
              </div>
            )}

            {candidateInfo?.faculty && (
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="truncate">{getFacultyName(candidateInfo.faculty)}</span>
              </div>
            )}
          </div>

          <Badge variant="default" className="shrink-0">
            Candidato
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {/* Biografía */}
        {candidate.bio && (
          <div className="mb-4">
            <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
              {candidate.bio}
            </p>
          </div>
        )}

        {/* Propuesta electoral (preview) */}
        {candidateInfo?.proposal && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Propuesta Electoral</h4>
            <div className="text-sm text-gray-700 leading-relaxed line-clamp-2">
              <RichText data={candidateInfo.proposal} />
            </div>
          </div>
        )}

        {/* Experiencia destacada */}
        {candidateInfo?.experience && Array.isArray(candidateInfo.experience) && candidateInfo.experience.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
              <Users className="h-4 w-4 mr-1" />
              Experiencia
            </h4>
            <div className="space-y-2">
              {candidateInfo.experience.slice(0, 2).map((exp, index: number) => (
                <div key={index} className="text-sm">
                  <p className="font-medium text-gray-900">{exp.title}</p>
                  <p className="text-gray-600">{exp.organization}</p>
                  {exp.period && (
                    <p className="text-xs text-gray-500">{exp.period}</p>
                  )}
                </div>
              ))}
              {candidateInfo.experience.length > 2 && (
                <p className="text-xs text-primary">
                  +{candidateInfo.experience.length - 2} más...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Redes sociales */}
        {candidateInfo?.socialLinks && (
          <div className="mb-4">
            <div className="flex space-x-2">
              {candidateInfo.socialLinks.facebook && (
                <a
                  href={candidateInfo.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {candidateInfo.socialLinks.twitter && (
                <a
                  href={candidateInfo.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              {candidateInfo.socialLinks.instagram && (
                <a
                  href={candidateInfo.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-800 transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {candidateInfo.socialLinks.linkedin && (
                <a
                  href={candidateInfo.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {candidateInfo.socialLinks.website && (
                <a
                  href={candidateInfo.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <Globe className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex space-x-2">
          <Button variant="default" size="sm" asChild className="flex-1">
            <Link href={`/candidatos/${candidate.id}`}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver Perfil
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="flex-1">
            <Link href={`/candidatos/${candidate.id}/posts`}>
              Ver Posts
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
