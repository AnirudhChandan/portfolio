"use client";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section
      id="contact"
      className="py-32 px-6 md:px-24 max-w-4xl mx-auto text-center scroll-mt-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-teal-400 font-mono mb-4 text-sm tracking-wider uppercase">
          10. What Next?
        </p>
        <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter text-slate-100 mb-6 drop-shadow-sm">
          Get In Touch
        </h2>
        <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
          I am currently actively looking for new opportunities as a Backend or
          Full Stack Engineer. Whether you have a question or just want to say
          hi, my inbox is always open.
        </p>

        {/* Added motion.a with physics */}
        <motion.a
          href="mailto:anichandan124@gmail.com"
          whileHover={{ scale: 0.97 }}
          whileTap={{ scale: 0.93 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="inline-block px-8 py-4 bg-teal-500 text-slate-950 font-bold rounded hover:bg-teal-400 transition-colors shadow-[0_0_20px_rgba(45,212,191,0.2)] hover:shadow-[0_0_25px_rgba(45,212,191,0.4)]"
        >
          Say Hello
        </motion.a>
      </motion.div>
    </section>
  );
}
