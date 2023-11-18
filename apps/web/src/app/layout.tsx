import '../styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import MainNav from '../components/Navbar/main-nav'
import { WagmiProvider } from '../components/Provider/wagmi-provider'
import ClientOnly from '../components/client-only'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OdulGit',
  description: 'Welcome to OdulGit',
  icons: {
    icon: [
      '/odulgit/Odulgit-Logo.png'
    ]
  }
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
            <Toaster />
          </WagmiProvider>
        </ThemeProvider>
      </body>
    </html >
  );
}
