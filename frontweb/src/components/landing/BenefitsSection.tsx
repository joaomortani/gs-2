'use client';

import { motion } from 'framer-motion';
import { Target, Zap, TrendingUp } from 'lucide-react';

const benefits = [
  {
    icon: Target,
    title: 'Autoavaliação honesta',
    description: 'Mapeie seus pontos fortes e gaps em soft skills em poucos minutos.',
  },
  {
    icon: Zap,
    title: 'Desafios práticos',
    description: 'Pequenas missões aplicadas ao seu dia a dia: conversas, feedbacks, apresentações.',
  },
  {
    icon: TrendingUp,
    title: 'Progresso visível',
    description: 'Veja sua evolução em cada trilha e ganhe confiança antes das entrevistas.',
  },
];

export default function BenefitsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-text-strong text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Por que só estudar técnica não basta?
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                className="relative p-8 rounded-lg border-2 border-transparent bg-gradient-to-br from-white to-slate-50 hover:border-primary transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-strong mb-3">{benefit.title}</h3>
                  <p className="text-text-secondary leading-relaxed">{benefit.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

