import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import './styles.css'


export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  // Determinar el tipo de contenido a mostrar basado en el usuario
  const isAdmin = user?.userType === 'admin'
  const isCandidate = user?.userType === 'candidate'
  const isVoter = user?.userType === 'voter'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Saludo personalizado según tipo de usuario */}
          {!user && (
            <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-8 leading-tight">
              Bienvenido a la Plataforma Electoral
            </h1>
          )}
          {isAdmin && (
            <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-8 leading-tight">
              Panel de <span className="text-red-600 dark:text-red-400">Administración</span>
            </h1>
          )}
          {isCandidate && (
            <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-8 leading-tight">
              Bienvenido, <span className="text-green-600 dark:text-green-400">Candidato</span> {user.fullName}
            </h1>
          )}
          {isVoter && (
            <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-8 leading-tight">
              Bienvenido, <span className="text-blue-600 dark:text-blue-400">{user.fullName}</span>
            </h1>
          )}
          
          {/* Botones diferentes según el tipo de usuario */}
          {!user && (
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <a
                href="/login"
                className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Iniciar Sesión
              </a>
              <a
                href="/register"
                className="inline-flex items-center px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white font-semibold rounded-lg shadow-lg hover:shadow-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Registrarse
              </a>
            </div>
          )}

          {/* Panel específico para administradores */}
          {isAdmin && (
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <a
                href={payloadConfig.routes.admin}
                rel="noopener noreferrer"
                target="_blank"
                className="inline-flex items-center px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Administrar Sistema
              </a>
              <a
                href="/dashboard/admin"
                className="inline-flex items-center px-8 py-4 bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H9z" />
                </svg>
                Dashboard Administrativo
              </a>
            </div>
          )}

          {/* Panel específico para candidatos */}
          {isCandidate && (
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <a
                href="/dashboard/candidate"
                className="inline-flex items-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Mi Perfil de Candidato
              </a>
              <a
                href="/dashboard/campaign"
                className="inline-flex items-center px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white font-semibold rounded-lg shadow-lg hover:shadow-xl border-2 border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-500 transition-all duration-300 transform hover:-translate-y-1"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
                Gestionar Campaña
              </a>
            </div>
          )}

          {/* Panel específico para votantes */}
          {isVoter && (
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <a
                href="/candidates"
                className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Ver Candidatos
              </a>
              <a
                href="/vote"
                className="inline-flex items-center px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white font-semibold rounded-lg shadow-lg hover:shadow-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Votar Ahora
              </a>
            </div>
          )}
          
          {/* Información general de la plataforma */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            {!user && (
              <>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                  Plataforma Electoral Digital
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Participa en el proceso democrático de tu institución de manera transparente y segura.
                </p>
              </>
            )}
            {isAdmin && (
              <>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                  Control Total del Sistema
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Gestiona usuarios, supervisa elecciones y mantén la integridad del proceso electoral.
                </p>
              </>
            )}
            {isCandidate && (
              <>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                  Tu Espacio de Campaña
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Comparte tu propuesta, conecta con los votantes y haz que tu mensaje llegue a todos.
                </p>
              </>
            )}
            {isVoter && (
              <>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                  Tu Voto, Tu Voz
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Conoce a los candidatos, revisa sus propuestas y ejerce tu derecho al voto.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
