'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const screens = [
  {
    title: 'Trilhas focadas em soft skills.',
    image: 'home',
    description: 'Trilhas tocadas em sort enile',
  },
  {
    title: 'Desafios rápidos, que cabem no seu dia.',
    image: 'challenges',
    description: 'Desafios rápidos que slakne morocza.',
  },
  {
    title: 'Progresso claro e motivador.',
    image: 'progress',
    description: 'Progresso daro erinistincartier.',
  },
];

export default function AppShowcaseSection() {
  const [currentScreen, setCurrentScreen] = useState(0);

  const nextScreen = () => {
    setCurrentScreen((prev) => (prev + 1) % screens.length);
  };

  const prevScreen = () => {
    setCurrentScreen((prev) => (prev - 1 + screens.length) % screens.length);
  };

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-text-strong text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Um app simples, pensado para a sua rotina
        </motion.h2>

        <div className="max-w-6xl mx-auto">
          {/* Carousel */}
          <div className="relative">
            <div className="flex items-center justify-center gap-8">
              <button
                onClick={prevScreen}
                className="p-2 rounded-full bg-white shadow-lg hover:bg-primary hover:text-white transition-colors"
                aria-label="Tela anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="flex-1 flex justify-center">
                <motion.div
                  key={currentScreen}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="w-64 bg-white rounded-3xl shadow-2xl p-2"
                >
                  <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 h-96">
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-primary font-bold text-lg">SkillUp</div>
                      <div className="w-8 h-8 bg-primary/20 rounded-full"></div>
                    </div>
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="h-3 bg-primary/20 rounded w-3/4 mb-2"></div>
                          <div className="h-2 bg-primary/10 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              <button
                onClick={nextScreen}
                className="p-2 rounded-full bg-white shadow-lg hover:bg-primary hover:text-white transition-colors"
                aria-label="Próxima tela"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {screens.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentScreen(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentScreen ? 'bg-primary w-8' : 'bg-primary/30'
                  }`}
                  aria-label={`Ir para tela ${index + 1}`}
                />
              ))}
            </div>

            {/* Description */}
            <motion.p
              key={currentScreen}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-text-secondary mt-6 text-lg"
            >
              {screens[currentScreen].title}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}

