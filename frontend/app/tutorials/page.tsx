'use client';

import { motion } from 'framer-motion';
import { Sprout, Shovel, Droplets, Sun, ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';

import { useLanguage } from '@/context/LanguageContext';

export default function TutorialsPage() {
    const { t } = useLanguage();

    const staticGuides = [
        {
            icon: Shovel,
            color: 'text-amber-600',
            bg: 'bg-amber-100 dark:bg-amber-900/30',
            videoId: '8ulpy_GFLDk',
        },
        {
            icon: Sprout,
            color: 'text-emerald-600',
            bg: 'bg-emerald-100 dark:bg-emerald-900/30',
            videoId: 'BO8yuSTc3fo',
        },
        {
            icon: Droplets,
            color: 'text-blue-600',
            bg: 'bg-blue-100 dark:bg-blue-900/30',
            videoId: 'yVJ5cUoSVHI',
        },
        {
            icon: Sun,
            color: 'text-yellow-600',
            bg: 'bg-yellow-100 dark:bg-yellow-900/30',
            videoId: 'Yqo6-qDQoMA',
        }
    ];

    const guides = t.tutorials.guides.map((guide, index) => ({
        ...guide,
        ...staticGuides[index]
    }));

    return (
        <div className="container mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                    {t.tutorials.knowledgeBase}
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.tutorials.title}</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    {t.tutorials.subtitle}
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {guides.map((guide, index) => (
                    <motion.div
                        key={guide.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-card border rounded-3xl p-8 shadow-sm hover:shadow-md transition-all"
                    >
                        <div className="flex items-start gap-6 mb-6">
                            <div className={`p-4 rounded-2xl ${guide.bg}`}>
                                <guide.icon className={`w-8 h-8 ${guide.color}`} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-2">{guide.title}</h2>
                                <p className="text-muted-foreground">{guide.description}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-primary" />
                                {t.tutorials.keySteps}:
                            </h3>
                            <ul className="space-y-3 mb-6">
                                {guide.steps.map((step, i) => (
                                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium mt-0.5">
                                            {i + 1}
                                        </span>
                                        {step}
                                    </li>
                                ))}
                            </ul>

                            <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${guide.videoId}`}
                                    title={guide.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="border-0"
                                ></iframe>
                            </div>
                        </div>

                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-20 bg-gradient-to-r from-primary to-emerald-600 rounded-3xl p-12 text-center text-white relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-6">{t.tutorials.readyToStart}</h2>
                    <p className="text-emerald-50 text-lg mb-8 max-w-2xl mx-auto">
                        {t.tutorials.exploreDatabase}
                    </p>
                    <Link
                        href="/search"
                        className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-lg"
                    >
                        {t.tutorials.findPlants} <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
