'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(45, 108, 223, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(132, 88, 255, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(45, 108, 223, 0.1) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text + CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Logo */}
            <div className="flex items-center gap-2 mb-8">
              <CheckCircle2 className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold text-primary-dark">SkillUp</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-strong mb-6 leading-tight">
              Prepare suas soft skills para o futuro do trabalho
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-text-secondary mb-8 leading-relaxed">
              O SkillUp é um companion para estudantes de tecnologia praticarem comunicação,
              colaboração e resolução de problemas com desafios rápidos, focados na vida real.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/login"
                className="px-8 py-4 bg-primary text-white rounded-lg font-semibold text-center hover:bg-primary-dark transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                Começar agora
              </Link>
              <Link
                href="#como-funciona"
                className="px-8 py-4 border-2 border-primary text-primary rounded-lg font-semibold text-center hover:bg-primary hover:text-white transition-all duration-200"
              >
                Ver como funciona
              </Link>
            </div>
          </motion.div>

          {/* Right: Mock App Screens */}
          <motion.div
            className="relative hidden lg:block"
            style={{
              transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            }}
            transition={{ type: 'spring', stiffness: 50, damping: 20 }}
          >
            <div className="relative w-full max-w-md mx-auto">
              {/* Phone 1 - Left */}
              <motion.div
                className="absolute -left-20 top-10 w-48 bg-white rounded-3xl shadow-2xl p-2"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                style={{ transform: 'rotate(-12deg)' }}
              >
                <div className="bg-primary/10 rounded-2xl p-4 h-96">
                  <div className="text-primary font-semibold mb-4">Desafios</div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="h-2 bg-primary/20 rounded w-3/4 mb-2"></div>
                        <div className="h-2 bg-primary/10 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Phone 2 - Center */}
              <motion.div
                className="relative z-10 w-56 bg-white rounded-3xl shadow-2xl p-2 mx-auto"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-4 h-[28rem]">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-primary font-bold text-lg">SkillUp</div>
                    <div className="w-8 h-8 bg-primary/20 rounded-full"></div>
                  </div>
                  <div className="mb-4">
                    <div className="h-2 bg-primary/30 rounded-full mb-2">
                      <div className="h-full bg-primary rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <div className="text-xs text-text-secondary">Progresso</div>
                  </div>
                  <div className="space-y-3">
                    {['Comunicação', 'Pensamento Crítico', 'Trabalho em Equipe'].map((skill, i) => (
                      <div key={i} className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="font-semibold text-sm text-text-strong mb-1">{skill}</div>
                        <div className="h-1.5 bg-primary/20 rounded-full">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${60 + i * 15}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Phone 3 - Right */}
              <motion.div
                className="absolute -right-20 top-10 w-48 bg-white rounded-3xl shadow-2xl p-2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                style={{ transform: 'rotate(12deg)' }}
              >
                <div className="bg-secondary/10 rounded-2xl p-4 h-96">
                  <div className="text-secondary font-semibold mb-4">Progresso</div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="h-2 bg-secondary/20 rounded w-full mb-2"></div>
                        <div className="h-2 bg-secondary/10 rounded w-2/3"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

