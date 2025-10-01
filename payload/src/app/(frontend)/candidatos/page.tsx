import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import config from '@/payload.config'
import { CandidateCard } from '@/components/home/CandidateCard'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  Search,
  Filter,
  ArrowLeft
} from 'lucide-react'

export default async function CandidatesPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Obtener todos los candidatos activos
  const candidates = await payload.find({
    collection: 'users',
    where: {
      and: [
        {
          userType: {
            equals: 'candidate'
          }
        },
        {
          isActive: {
            equals: true
          }
        }
      ]
    },
    sort: 'fullName',
    depth: 1,
    limit: 50
  })

  // Agrupar candidatos por cargo
  const candidatesByPosition = candidates.docs.reduce((acc, candidate) => {
    const position = candidate.candidateInfo?.position || 'other'
    if (!acc[position]) {
      acc[position] = []
    }
    acc[position].push(candidate)
    return acc
  }, {} as Record<string, typeof candidates.docs>)

  const getPositionName = (positionCode: string) => {
    const positions: Record<string, string> = {
      'rector': 'Rector',
      'vicerrector_academico': 'Vicerrector Académico',
      'vicerrector_investigacion': 'Vicerrector de Investigación',
      'decano': 'Decano',
      'vicedecano': 'Vicedecano',
      'director_escuela': 'Director de Escuela',
      'representante_estudiantil': 'Representante Estudiantil',
      'other': 'Otros'
    }
    return positions[positionCode] || positionCode
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al inicio
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Users className="mr-3 h-8 w-8 text-blue-600" />
                  Candidatos UNSA 2026
                </h1>
                <p className="text-gray-600 mt-1">
                  Conoce a todos los candidatos registrados para las elecciones universitarias
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="text-base px-4 py-2">
              {candidates.totalDocs} candidatos
            </Badge>
          </div>

          {/* Filtros y búsqueda */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Buscar candidatos por nombre..." 
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="shrink-0">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>
      </section>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {candidates.docs.length > 0 ? (
          <div className="space-y-12">
            {Object.entries(candidatesByPosition).map(([position, positionCandidates]) => (
              <section key={position}>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {getPositionName(position)}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      {positionCandidates.length} candidato{positionCandidates.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {positionCandidates.map((candidate) => (
                    <CandidateCard key={candidate.id} candidate={candidate} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-16">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No hay candidatos registrados
              </h3>
              <p className="text-gray-600 mb-6">
                Aún no se han registrado candidatos para las elecciones.
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