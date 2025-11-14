'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Ana',
    age: 21,
    course: 'ADS',
    text: 'Eu tinha vergonha de explicar meus projetos. Depois de algumas semanas de desafios de comunicação, consegui conduzir uma entrevista técnica sem travar.',
  },
  {
    name: 'Rafael',
    age: 23,
    course: 'Dev Jr.',
    text: 'Percebi que eu não sabia dar feedback sem parecer grosso. Os desafios de trabalho em equipe me ajudaram a me posicionar melhor.',
  },
  {
    name: 'Mariana',
    age: 22,
    course: 'Ciência da Computação',
    text: 'O SkillUp me ajudou a estruturar melhor minhas ideias e apresentar projetos de forma mais clara. Isso fez toda a diferença nas entrevistas.',
  },
];

export default function TestimonialsSection() {
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
          O que alunos diriam depois de usar o SkillUp
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-slate-50 rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Quote className="w-8 h-8 text-primary/30 mb-4" />
              <p className="text-text-secondary mb-6 leading-relaxed italic">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-text-strong">{testimonial.name}</div>
                  <div className="text-sm text-text-secondary">
                    {testimonial.age} anos, {testimonial.course}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

