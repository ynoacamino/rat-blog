import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import config from '@/payload.config'
import { CandidateCard } from '@/components/home/CandidateCard'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Users,
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
                  <Users className="mr-3 h-8 w-8 text-primary" />
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

        </div>
      </section>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {candidates.docs.length > 0 ? (
          <div className="space-y-12">
            {candidates.docs.map((candidate) => (
              <section key={candidate.id}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <CandidateCard key={candidate.id} candidate={candidate} />
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
