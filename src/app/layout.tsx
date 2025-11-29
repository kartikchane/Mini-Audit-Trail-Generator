import './globals.css'

export const metadata = {
  title: 'Mini Audit Trail Generator',
  description: 'Track text changes with automatic version history and diff detection',
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
