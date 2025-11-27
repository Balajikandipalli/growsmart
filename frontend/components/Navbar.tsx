'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Leaf, Search, Heart, LogOut, User, Shield, Bell, ShoppingBag, LayoutDashboard, BookOpen, Globe } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Language } from '@/lib/translations';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { t, language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '/dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
        { href: '/search', label: t.nav.search, icon: Search },
        { href: '/tutorials', label: t.nav.tutorials, icon: BookOpen },
        { href: '/reminders', label: t.nav.reminders, icon: Bell },
        { href: '/shop', label: t.nav.shop, icon: ShoppingBag },
        ...(user ? [{ href: '/favorites', label: t.nav.favorites, icon: Heart }] : []),
        ...(user?.isAdmin ? [{ href: '/admin', label: t.nav.admin, icon: Shield }] : []),
    ];

    const toggleLanguage = () => {
        const langs: Language[] = ['en', 'hi', 'te'];
        const currentIndex = langs.indexOf(language);
        const nextIndex = (currentIndex + 1) % langs.length;
        setLanguage(langs[nextIndex]);
    };

    return (
        <nav
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b' : 'bg-transparent'
            )}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
                            <Leaf className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                            Horticulture Learning Hub
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        'flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary',
                                        isActive ? 'text-primary' : 'text-muted-foreground'
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    {link.label}
                                </Link>
                            );
                        })}

                        <div className="h-6 w-px bg-border mx-2" />

                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors uppercase"
                        >
                            <Globe className="h-4 w-4" />
                            {language}
                        </button>

                        {user ? (
                            <div className="flex items-center gap-4 pl-4 border-l">
                                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    {user.name}
                                </span>
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-2 text-sm font-medium text-destructive hover:text-destructive/80 transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    {t.nav.logout}
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/login"
                                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                                >
                                    {t.nav.login}
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                                >
                                    {t.nav.getStarted}
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b overflow-hidden"
                    >
                        <div className="px-4 py-4 space-y-4">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                                            isActive
                                                ? 'bg-primary/10 text-primary'
                                                : 'text-muted-foreground hover:bg-muted'
                                        )}
                                    >
                                        <Icon className="h-5 w-5" />
                                        {link.label}
                                    </Link>
                                );
                            })}

                            <button
                                onClick={toggleLanguage}
                                className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted uppercase"
                            >
                                <Globe className="h-5 w-5" />
                                Switch Language ({language})
                            </button>

                            <div className="border-t pt-4 mt-4">
                                {user ? (
                                    <div className="space-y-4 px-4">
                                        <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                                            <User className="h-5 w-5" />
                                            {user.name}
                                        </div>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsOpen(false);
                                            }}
                                            className="flex w-full items-center gap-3 text-sm font-medium text-destructive hover:text-destructive/80"
                                        >
                                            <LogOut className="h-5 w-5" />
                                            {t.nav.logout}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3 px-4">
                                        <Link
                                            href="/login"
                                            onClick={() => setIsOpen(false)}
                                            className="block w-full text-center py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                                        >
                                            {t.nav.login}
                                        </Link>
                                        <Link
                                            href="/register"
                                            onClick={() => setIsOpen(false)}
                                            className="block w-full text-center bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium hover:bg-primary/90"
                                        >
                                            {t.nav.getStarted}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}


