'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Search, Shield } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center overflow-hidden py-20 lg:py-32">
        {/* Enhanced Background */}
        <div className="absolute inset-0 z-0">
          {/* Main gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 dark:from-emerald-950 dark:via-teal-900 dark:to-cyan-950" />

          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-green-200/30 via-transparent to-blue-200/30 dark:from-green-900/20 dark:via-transparent dark:to-blue-900/20 animate-pulse" style={{ animationDuration: '4s' }} />

          {/* Decorative circles */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-300/20 dark:bg-emerald-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-300/20 dark:bg-teal-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-200/10 dark:bg-cyan-700/5 rounded-full blur-3xl" />

          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>

        <div className="container relative z-10 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-6 dark:bg-emerald-900/30 dark:text-emerald-300">
              {t.home.tagline}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6">
              {t.home.title} <br />
              <span className="text-primary">{t.home.subtitle}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              {t.home.description}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/search"
                className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                {t.home.explore}
              </Link>
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-4 bg-white text-foreground border border-input rounded-full font-semibold text-lg hover:bg-accent hover:text-accent-foreground transition-all flex items-center justify-center gap-2"
              >
                {t.nav.getStarted}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: t.home.smartSearch,
                description: t.home.smartSearchDesc
              },
              {
                icon: Leaf,
                title: t.home.careGuides,
                description: t.home.careGuidesDesc
              },
              {
                icon: Shield,
                title: t.home.plantTracking,
                description: t.home.plantTrackingDesc
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

