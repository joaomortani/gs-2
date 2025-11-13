'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function FutureOfWorkSection() {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(true);
  }, []);

  const progressData = [
    { label: 'Comunicação', value: 85 },
    { label: 'Colaboração', value: 72 },
    { label: 'Resolução de Problemas', value: 90 },
    { label: 'Adaptabilidade', value: 68 },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-text-strong mb-6">
              O futuro do trabalho é de quem sabe resolver problemas (não de quem decora conteúdo)
            </h2>
            <div className="space-y-4 text-text-secondary text-lg leading-relaxed">
              <p>
                Ferramentas de IA já escrevem código, geram textos e automatizam tarefas repetitivas.
              </p>
              <p>
                O diferencial de quem entra no mercado agora está em comunicar ideias, colaborar em
                equipe e aprender rápido.
              </p>
              <p className="font-semibold text-text-strong">
                O SkillUp foi criado para treinar exatamente essas habilidades.
              </p>
            </div>
          </motion.div>

          {/* Right: Mock Dashboard */}
          <motion.div
            className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 shadow-xl"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-semibold text-text-strong mb-6">Progresso Geral</h3>
            <div className="space-y-6">
              {progressData.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-text-strong">{item.label}</span>
                    <span className="text-sm text-text-secondary">{item.value}%</span>
                  </div>
                  <div className="h-3 bg-white rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: animated ? `${item.value}%` : 0 }}
                      transition={{ delay: index * 0.2, duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

