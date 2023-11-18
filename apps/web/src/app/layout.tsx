import '../styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import MainNav from '../components/Navbar/main-nav'
import { WagmiProvider } from '../components/Provider/wagmi-provider'
import ClientOnly from '../components/client-only'
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TurGit',
  description: 'Welcome to TurGit',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-800">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <WagmiProvider>
            <ClientOnly>
              <MainNav />
            </ClientOnly>
            {children}
          </WagmiProvider>
        </ThemeProvider>
      </body>
    </html >
  );
}
