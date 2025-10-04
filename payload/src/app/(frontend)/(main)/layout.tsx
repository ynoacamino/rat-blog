import { NavBar } from '@/components/layout/NavBar'
import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import config from '@/payload.config'
import Footer from '@/components/layout/Footer'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  return (
    <>
      <NavBar user={user} />
      <main className="pb-8">
        {children}
      </main>
      <Footer />
    </>
  )
}
