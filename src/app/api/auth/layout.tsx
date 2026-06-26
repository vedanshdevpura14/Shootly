export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0d0d1a]">
      {children}
    </main>
  )
}