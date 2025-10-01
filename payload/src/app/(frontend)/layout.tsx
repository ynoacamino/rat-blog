import React from 'react'
import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { NavBar } from '@/components/home/NavBar'
import './styles.css'

export const metadata = {
  description: 'Plataforma Electoral UNSA 2026 - Blog de candidatos universitarios',
  title: 'UNSA Blog 2026 - Plataforma Electoral',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  
  // Obtener el usuario actual
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50">
        <NavBar user={user} />
        <main className="pb-8">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-600">
              <p className="mb-2">
                © 2026 Plataforma Electoral UNSA - Universidad Nacional de San Agustín
              </p>
              <p className="text-sm">
                Desarrollado para facilitar el proceso electoral universitario
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
