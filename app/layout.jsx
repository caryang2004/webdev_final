
import '@/app/globals.css'

export const metadata = {
  title: 'Expense Tracker',
  description: 'Track and manage your expenses',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}

