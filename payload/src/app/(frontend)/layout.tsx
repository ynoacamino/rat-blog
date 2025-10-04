import './styles.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  description: 'Plataforma Electoral UNSA 2026 - Blog de candidatos universitarios',
  title: 'UNSA Blog 2026 - Plataforma Electoral',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="es">
      <body className="min-h-screen bg-background flex flex-col">
        { children }
      </body>
    </html>
  )
}
