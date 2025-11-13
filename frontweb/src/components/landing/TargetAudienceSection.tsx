'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, Users } from 'lucide-react';

const cards = [
  {
    icon: GraduationCap,
    title: 'Estudantes de TI',
    description: 'Querem sair da faculdade prontos para entrevistas.',
  },
  {
    icon: Briefcase,
    title: 'Quem busca o primeiro estágio',
    description: 'Precisam mostrar atitude e comunicação, não só certificados.',
  },
  {
    icon: Users,
    title: 'Juniores em transição',
    description: 'Querem se destacar em times já formados.',
  },
];

export default function TargetAudienceSection() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-text-strong text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Para quem está começando a carreira em tecnologia
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={index}
                className="bg-white rounded-lg p-6 shadow-sm border border-border hover:shadow-lg hover:-translate-y-1 hover:border-primary transition-all duration-300 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-text-strong mb-2">{card.title}</h3>
                <p className="text-text-secondary">{card.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

