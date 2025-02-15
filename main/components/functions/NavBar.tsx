'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ModeToggle } from "../theme/ThemeSwitcher";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useAuth } from "@/app/_contexts/authcontext";

interface NavLinkProps {
    href: string;
    icon: React.ReactNode;
    text: string;
}

interface UserMenuProps {
    name: string;
    handleLogout: () => void;
}

interface NavbarProps {
    isMenuOpen: boolean;
    handleMenuToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isMenuOpen, handleMenuToggle }) => {
    const router = useRouter();
    const { token, logout } = useAuth();
    const [name, setName] = useState<string>('');
    const { resolvedTheme } = useTheme();

    const getName = async (): Promise<void> => {
        try {
            const res = await fetch("/api/getName", {
                method: "GET",
                headers: {
                    Authorization: token as string,
                },
            });
            const data = await res.json();
            console.log("data", data);
            setName(data[0].name);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        if (token) {
            getName();
        }
    }, [token]);

    const handleLogout = (): void => {
        logout();
        router.push("/");
    };

    return (
        <>
            <header className="mx-auto px-4 text-primary py-4 lg:px-24 border-b border-border bg-background sticky top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out w-full">
                <div className="w-full flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={handleMenuToggle}
                        >
                            <MenuIcon className="h-6 w-6" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                        <Link href="/">
                            <h5 className="text-lg sm:text-xl text-black dark:text-white font-black relative">
                                TaskMaster
                            </h5>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <ModeToggle />
                        <UserMenu name={name} handleLogout={handleLogout} />
                    </div>
                </div>
            </header>
        </>
    );
};

const UserMenu: React.FC<UserMenuProps> = ({ name, handleLogout }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="overflow-hidden rounded-full transition-all duration-200"
                >
                    <img
                        src="/avatar.jpg"
                        width={32}
                        height={32}
                        alt="Avatar"
                        className="overflow-hidden rounded-full"
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
    );
};

const LogOutIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M17 16l4-4m0 0l-4-4m4 4H7" />
            <path d="M3 21h18a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" />
        </svg>
    );
};

export default Navbar;
