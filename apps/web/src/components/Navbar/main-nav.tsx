"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { Menu, Moon, ShoppingCart, Sun } from "lucide-react";

const MainNav = () => {
    const routes = [
        {
            href: "/home",
            label: "Git Hunt",
        },
        {
            href: "/issues",
            label: "Issues",
        },
        {
            href: "/code",
            label: "Code",
        },
        {
            href: "/pr",
            label: "Pull Requests",
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
                            <Button asChild variant="ghost">
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
                        Wallet
                    </div>
                </div>
            </Container>
        </header>
    );
};

export default MainNav;