'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const steps = [
  {
    number: '1',
    title: 'Escolha suas trilhas',
    description:
      'Comunicação, Trabalho em Equipe, Resolução de Problemas e outras soft skills essenciais.',
  },
  {
    number: '2',
    title: 'Pratique com microdesafios',
    description:
      'Desafios de 5 a 15 minutos para fazer no seu dia: explicar um projeto, dar feedback, registrar aprendizados.',
  },
  {
    number: '3',
    title: 'Acompanhe sua evolução',
    description:
      'Seu painel mostra quantos desafios você concluiu e como suas skills estão crescendo.',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-text-strong text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Como o SkillUp funciona na prática
        </motion.h2>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/20 hidden md:block"></div>

            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative flex gap-8 mb-12 last:mb-0"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                {/* Number circle */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {step.number}
                  </div>
                  {/* Dot on line */}
                  <div className="absolute left-1/2 top-16 w-3 h-3 bg-primary rounded-full transform -translate-x-1/2 hidden md:block"></div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-2">
                  <h3 className="text-2xl font-semibold text-text-strong mb-3">{step.title}</h3>
                  <p className="text-text-secondary leading-relaxed text-lg">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

