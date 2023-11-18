"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { Icons } from "@/components/ui/icons";
import {
    useWeb3Modal,
    useWeb3ModalEvents,
    useWeb3ModalState,
} from '@web3modal/wagmi/react'
import { useAccount } from 'wagmi'
import Image from 'next/image'

const MainNav = () => {
    const { address, isConnected } = useAccount()

    const modal = useWeb3Modal()
    const state = useWeb3ModalState()

    const routes = [
        {
            href: "/home",
            label: "OdulGit",
        },
        {
            href: "/repo-list",
            label: "Repositories",
        }
    ];

    return (
        <header className="sm:flex sm:justify-between py-2.5 px-7 bg-gray-800 w-full">
            <Container>
                <div className="relative flex h-12 items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/home" className="ml-4 lg:ml-0">
                            <Image
                                alt='OdulGit'
                                src='/odulgit/Odulgit-Logo.png'
                                width={48}
                                height={48}
                                className='w-12 h-12'
                            />
                        </Link>
                    </div>
                    <nav className="mx-5 flex flex-1 items-center space-x-4 lg:space-x-6 hidden md:block border-b">
                        {routes.map((route, i) => (
                            <Button asChild variant="ghost" size="origin">
                                <Link
                                    key={i}
                                    href={route.href}
                                    className="text-sm font-medium transition-colors"
                                >
                                    {route.label}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                    <div className="flex items-center">
                        {!isConnected
                            ? <Button variant="wallet" onClick={() => modal.open()}>
                                {state.open
                                    ? <div className="flex flex-row items-center">
                                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                        <p>Connecting...</p>
                                    </div>
                                    : "Connect Wallet"}
                            </Button>
                            : <w3m-account-button />
                        }
                    </div>
                </div>
            </Container>
        </header>
    );
};

export default MainNav;