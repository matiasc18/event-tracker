import NavBar from '@/components/layout/components/navBar'
import { AuthProvider } from '@/contexts/AuthContext'
import Head from 'next/head'

export default function Layout({ children }) {
  return (
    <AuthProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <NavBar />
      {children}
    </AuthProvider>
  )
}