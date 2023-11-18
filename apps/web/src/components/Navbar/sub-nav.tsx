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
import { useAccount, useSignMessage } from 'wagmi'
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useInitWeb3InboxClient, useManageSubscription, useW3iAccount } from "@web3inbox/widget-react";
import { useCallback, useEffect } from "react";

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string;
const SubNav = () => {
    // web3 inbox init
    const isW3iInitialized = useInitWeb3InboxClient({
        projectId,
    });
    const {
        account,
        setAccount,
        register: registerIdentity,
        identityKey,
    } = useW3iAccount();
    const {
        subscribe,
        unsubscribe,
        isSubscribed,
        isSubscribing,
        isUnsubscribing,
    } = useManageSubscription(account);
    
    const searchParams = useSearchParams()
    const repoAddress = searchParams.get('address') ?? ''
    
    // web3 inbox account
    const { signMessageAsync } = useSignMessage();
    const signMessage = useCallback(
        async (message: string) => {
          const res = await signMessageAsync({
            message,
          });
    
          return res as string;
        },
        [signMessageAsync]
      );
    const { address, isConnected } = useAccount({
        onDisconnect: () => {
            setAccount("");
        },
    })
    useEffect(() => {
        if (!Boolean(address)) return;
        setAccount(`eip155:1:${address}`);
      }, [signMessage, address, setAccount]);

      const handleRegistration = useCallback(async () => {
        if (!account) return;
        try {
          await registerIdentity(signMessage);
        } catch (registerIdentityError) {
          console.error({ registerIdentityError });
        }
      }, [signMessage, registerIdentity, account]);
    
    // web3 inbox subscription
    useEffect(() => {
    // register even if an identity key exists, to account for stale keys
    handleRegistration();
    }, [handleRegistration]);

    const handleSubscribe = useCallback(async () => {
    if(!identityKey) {
        await handleRegistration();
    }

    await subscribe();
    }, [subscribe, identityKey])
    
    const router = useRouter()
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
        },
        {
            href: `/bounty-list?address=${repoAddress}`,
            label: "Bounty",
        },
        {
            href: `/reward-request-list?address=${repoAddress}`,
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
                        {isW3iInitialized && !isSubscribed && !isSubscribing && !isUnsubscribing && (
                            <Button variant="wallet" onClick={handleSubscribe}>
                                Subscribe
                            </Button>
                        )}
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