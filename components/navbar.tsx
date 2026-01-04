"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Moon, Sun, Search, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useSearch } from "@/contexts/search-context";

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import Logo from "../app/logo.png";

export function Navbar() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const { searchQuery, setSearchQuery } = useSearch();
    const [mobileSearchOpen, setMobileSearchOpen] = React.useState(false);

    const categories = [
        { name: "Home", href: "/" },
        { name: "Tech", href: "/category/tech" },
        { name: "Sports", href: "/category/sports" },
        { name: "Science", href: "/category/science" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/98 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
                <Image src={Logo} alt="TopNewsDaily Logo" width={50} />
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold tracking-tight">
                            TopNewsDaily
                            <sub
                                style={{
                                    fontSize: "0.5em",
                                    fontWeight: "normal",
                                }}
                            >
                                by SpiderBrain
                            </sub>
                        </span>
                    </Link>

                    <NavigationMenu className="hidden md:flex">
                        <NavigationMenuList>
                            {categories.map((category) => (
                                <NavigationMenuItem key={category.href}>
                                    <NavigationMenuLink
                                        asChild
                                        className={navigationMenuTriggerStyle()}
                                        active={pathname === category.href}
                                    >
                                        <Link href={category.href}>
                                            {category.name}
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative hidden sm:block w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search news..."
                            className="pl-8 pr-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                            setTheme(theme === "dark" ? "light" : "dark")
                        }
                    >
                        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden border-t">
                <div className="max-w-7xl mx-auto px-6 py-2">
                    <div className="flex justify-between gap-2 overflow-x-auto">
                        {categories.map((category) => (
                            <Link key={category.href} href={category.href}>
                                <Button
                                    variant={
                                        pathname === category.href
                                            ? "default"
                                            : "ghost"
                                    }
                                    size="sm"
                                    className="whitespace-nowrap"
                                >
                                    {category.name}
                                </Button>
                            </Link>
                        ))}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                            className="whitespace-nowrap"
                        >
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                    {mobileSearchOpen && (
                        <div className="relative mt-2">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search news..."
                                className="pl-8 pr-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
