'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary to-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Pronto para treinar as habilidades que a IA não substitui?
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Crie sua conta gratuita, escolha uma trilha e conclua seu primeiro desafio hoje.
          </p>
          <Link
            href="/login"
            className="inline-block px-8 py-4 bg-white text-primary rounded-lg font-semibold text-lg hover:bg-slate-100 transition-all duration-200 hover:scale-105 hover:shadow-xl"
          >
            Começar agora
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

