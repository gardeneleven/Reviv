'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import Navbar from '@/components/navbar';
import Flavours from '@/components/flavours';
import BottlePop from '@/components/bottlepop';

import ChooseFrom from '@/components/chooseFrom';
import Footer from '@/components/footer';
import "./globals.css";
import Hero from '@/components/hero';
import CustomCursor from '@/components/customcursor';

export default function Page() {
  const bottleRef = useRef(null);
  const flavourRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: bottleRef,
    offset: ["start end", "end start"],
  });

  // (kept from your snippet, currently unused)
  const parallaxY = useTransform(scrollYProgress, [0.9, 1], [200, 0]);
  const baseOpacity = useTransform(scrollYProgress, [0.95, 1], [0, 1]);

  return (
    <div className="relative w-[100vw]" style={{ backgroundImage: "url('/assets/bg.png')" }}>
      <CustomCursor />
      <Navbar />

      {/* Fixed dim overlay (no scroll animation) */}
      <div className="fixed inset-0 bg-black/20 pointer-events-none z-[9000]" />

      <div ref={bottleRef}>
        <BottlePop />
      </div>

      <motion.div
        style={{
          opacity: useTransform(scrollYProgress, [0.125, 0.16], [1, 0]),
          y: useTransform(scrollYProgress, [0.125, 0.16], [0, -100]),
        }}
        className="absolute top-0 left-0 w-full h-screen z-[100]"
      >
        <Hero />

        <motion.div
          style={{
            opacity: useTransform(scrollYProgress, [0.17, 0.18], [0, 1]),
            y: useTransform(scrollYProgress, [0.17, 0.18], [100, 0]),
          }}
          className="relative z-10"
        >
          {/* additional content */}
        </motion.div>
      </motion.div>

      <motion.div
        style={{
          opacity: useTransform(scrollYProgress, [0.17, 0.18], [0, 1]),
          y: useTransform(scrollYProgress, [0.17, 0.18], [100, 0]),
        }}
        className="relative z-10"
      >
        {/* additional content */}
      </motion.div>

      <ChooseFrom />
      <Footer />
    </div>
  );
}
