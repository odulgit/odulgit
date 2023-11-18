import SubNav from '@/components/Navbar/sub-nav'
import ClientOnly from '@/components/client-only'
import { WagmiProvider } from '@/components/Provider/wagmi-provider'
import { ThemeProvider } from "@/components/theme-provider"

export default function CreateRRLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {
    return (
        <section>
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
            >
                <WagmiProvider>
                    <ClientOnly>
                        <SubNav />
                    </ClientOnly>
                    {children}
                </WagmiProvider>
            </ThemeProvider>
        </section>
    )
}