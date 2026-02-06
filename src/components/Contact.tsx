"use client";

import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section
      id="contact"
      className="py-24 px-6 md:px-24 max-w-4xl mx-auto text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-teal-400 font-mono mb-4">04. What Next?</p>
        <h2 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6">
          Get In Touch
        </h2>
        <p className="text-slate-400 text-lg leading-relaxed mb-10">
          I am currently actively looking for new opportunities as a Backend or
          Full Stack Engineer. Whether you have a question or just want to say
          hi, my inbox is always open.
        </p>

        <a
          href="mailto:anichandan124@gmail.com"
          className="inline-block px-8 py-4 border border-teal-400 text-teal-400 font-mono rounded hover:bg-teal-400/10 transition-colors"
        >
          Say Hello
        </a>
      </motion.div>
    </section>
  );
}
