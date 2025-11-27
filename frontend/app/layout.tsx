import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Horticulture Learning Hub",
  description: "Experience Interactive Content & AR for plant enthusiasts.",
};

import { LanguageProvider } from "@/context/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(outfit.className, "min-h-screen bg-background font-sans antialiased")}>
        <LanguageProvider>
          <AuthProvider>
            <NotificationProvider>
              <div className="relative flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1 pt-16">{children}</main>
                <footer className="border-t bg-muted/50 py-6 text-center text-sm text-muted-foreground">
                  <p>&copy; {new Date().getFullYear()} Horticulture Learning Hub. All rights reserved.</p>
                </footer>
              </div>
            </NotificationProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

