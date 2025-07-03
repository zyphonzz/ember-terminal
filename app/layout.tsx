// app/layout.tsx
export const metadata = {
  title: 'Ember Terminal',
  description: 'A terminal-style interface',
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
