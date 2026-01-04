import type { Metadata } from "next";
import { Newsreader, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SearchProvider } from "@/contexts/search-context";
import { Navbar } from "@/components/navbar";

const newsreader = Newsreader({
    variable: "--font-newsreader",
    subsets: ["latin"],
    display: "swap",
});

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "TopNewsDaily - Latest News from Around the World",
    description:
        "Stay updated with the latest news from Tech, Sports, and Science. Daily top stories from trusted sources.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${newsreader.variable} ${inter.variable} font-sans antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <SearchProvider>
                        <Navbar />
                        <main className="min-h-screen">{children}</main>
                    </SearchProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
