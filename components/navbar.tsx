"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Moon, Sun, Search, X, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { useSearch } from "@/contexts/search-context";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import Logo from "../app/logo.png";

export function Navbar() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const { searchQuery, setSearchQuery } = useSearch();
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const categories = [
        { name: "Home", href: "/", icon: "🏠" },
        { name: "World", href: "/category/world", icon: "🌍" },
        { name: "Nation", href: "/category/nation", icon: "🏛️" },
        { name: "Business", href: "/category/business", icon: "💼" },
        { name: "Technology", href: "/category/technology", icon: "💻" },
        { name: "Entertainment", href: "/category/entertainment", icon: "🎬" },
        { name: "Sports", href: "/category/sports", icon: "⚽" },
        { name: "Science", href: "/category/science", icon: "🔬" },
        { name: "Health", href: "/category/health", icon: "🏥" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/98 backdrop-blur-sm">
            {/* Top Bar - Logo, Brand, and Utilities */}
            <div className="border-b border-border/40">
                <div className="max-w-350 mx-auto flex h-20 items-center justify-center gap-18 px-8 py-4">
                    <div className="flex items-center gap-6">
                        <Image
                            src={Logo}
                            alt="TopNewsDaily Logo"
                            width={50}
                            height={50}
                        />
                        <Link href="/" className="flex flex-col">
                            <span className="text-2xl font-bold tracking-tight">
                                TopNewsDaily
                            </span>
                            <span className="text-xs font-normal text-right">
                                by SpiderBrain
                            </span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Desktop Search */}
                        <div className="relative hidden lg:block w-72">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search across all categories..."
                                className="pl-10 pr-10 h-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* Theme Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                                setTheme(theme === "dark" ? "light" : "dark")
                            }
                            className="h-9 w-9"
                        >
                            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>

                        {/* Mobile Menu Button */}
                        <Sheet
                            open={mobileMenuOpen}
                            onOpenChange={setMobileMenuOpen}
                        >
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="lg:hidden h-9 w-9"
                                >
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="right"
                                className="w-75 sm:w-100 p-6"
                            >
                                {/* Mobile Search */}
                                <div className="relative mb-6 pt-10">
                                    <Search className="absolute left-3 top-12.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search news..."
                                        className="pl-10 pr-10"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery("")}
                                            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>

                                {/* Mobile Categories */}
                                <nav className="flex flex-col gap-1">
                                    {categories.map((category) => (
                                        <Link
                                            key={category.href}
                                            href={category.href}
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                        >
                                            <Button
                                                variant={
                                                    pathname === category.href
                                                        ? "secondary"
                                                        : "ghost"
                                                }
                                                className="w-full justify-start text-base h-8"
                                            >
                                                {/* <span className="mr-3 text-xl">
                                                    {category.icon}
                                                </span> */}
                                                {category.name}
                                            </Button>
                                        </Link>
                                    ))}
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>

            {/* Desktop Navigation - Categories */}
            <div className="hidden lg:block bg-muted/30">
                <div className="max-w-350 mx-auto">
                    <nav className="flex items-center justify-center gap-2 px-8 py-3">
                        {categories.map((category) => (
                            <Link key={category.href} href={category.href}>
                                <Button
                                    variant={
                                        pathname === category.href
                                            ? "secondary"
                                            : "ghost"
                                    }
                                    size="sm"
                                    className="h-10 px-5"
                                >
                                    {/* <span className="mr-2">
                                        {category.icon}
                                    </span> */}
                                    {category.name}
                                </Button>
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Tablet Navigation - Horizontal Scroll */}
            {/* <div className="hidden md:block border-t bg-muted/30">
                <div className="max-w-350 mx-auto px-6 py-3">
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map((category) => (
                            <Link key={category.href} href={category.href}>
                                <Button
                                    variant={
                                        pathname === category.href
                                            ? "secondary"
                                            : "ghost"
                                    }
                                    size="sm"
                                    className="whitespace-nowrap h-10 px-4"
                                >
                                    <span className="mr-1.5">
                                        {category.icon}
                                    </span>
                                    {category.name}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>
            </div> */}
        </header>
    );
}
