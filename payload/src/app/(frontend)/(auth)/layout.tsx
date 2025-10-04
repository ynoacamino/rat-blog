export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <main className="flex items-center justify-center min-h-screen w-full max-w-lg mx-auto">
        {children}
      </main>
  )
}
