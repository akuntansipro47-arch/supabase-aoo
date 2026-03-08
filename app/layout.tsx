import './globals.css'

export const metadata = {
  title: 'Supabase App',
  description: 'Application rebuilt with Supabase and Vercel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
