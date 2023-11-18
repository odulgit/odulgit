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
import { useRouter, usePathname } from "next/navigation";


const SubNav = () => {
    const { address, isConnected } = useAccount()
    const pathname = usePathname()
    const regex = /^(\/repos\/repo\/0x[0-9a-fA-F]+)/;
    const match = pathname.match(regex);
    let repo = "";
    if (match) {
        repo = match[1];
    } else {
        console.log("No match found");
    }

    const router = useRouter()
    const modal = useWeb3Modal()
    const state = useWeb3ModalState()
    const routes = [
        {
            href: "/home",
            label: "Odulgit",
        },
        {
            href: "/repos",
            label: "Repositories",
        },
        {
            href: `${repo}/bounty`,
            label: "Bounty",
        },
        {
            href: `${repo}/reward-requests`,
            label: "Reward Requests",
        },
    ];
    return (
        <header className="sm:flex sm:justify-between py-2.5 px-7 bg-gray-800 w-full">
            <Container>
                <div className="relative flex h-12 items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/home" className="ml-4 lg:ml-0">
                            LOGO
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

export default SubNav;