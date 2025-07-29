'use client';

import { useEffect, useRef, useState, forwardRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

const About = forwardRef<HTMLDivElement>((_, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showFirst, setShowFirst] = useState(false);
  const [showSecond, setShowSecond] = useState(false);
  const [showThird, setShowThird] = useState(false);
  const [showFixedBottle, setShowFixedBottle] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Switch to fixed bottle on scroll
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setShowFixedBottle(v >= 0.1);
  });

  // Rotate at defined scroll points
  const rotate = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 0.9, 1],
    [0, 120, 240, 360, 360]
  );

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const height = rect.height;
      const scrollY = window.innerHeight - rect.top;
      const percentScrolled = scrollY / height;

      if (percentScrolled >= 0.1) setShowFirst(true);
      if (percentScrolled >= 0.5) setShowSecond(true);
      if (percentScrolled >= 1) setShowThird(true);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={(node) => {
        containerRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      className="relative w-screen h-[222vh] bg-cover bg-center bg-no-repeat overflow-hidden px-12"
      style={{ backgroundImage: "url('./assets/about.png')" }}
    >
      {/* Static upright bottle (before scroll) */}
      {!showFixedBottle && (
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 z-[9999]">
          <Image
            src="./assets/orange2.png"
            alt="Bottle"
            width={150}
            height={150}
            className="rotate-[-45deg]"
          />
        </div>
      )}

      {/* Rotating bottle (on scroll) */}
      {showFixedBottle && (
        <motion.div
          className="fixed top-[12%] left-1/2 -translate-x-1/2 z-[9999] pointer-events-none"
          style={{
            rotate,
            transformOrigin: '50% 50%',
          }}
        >
          <Image
            src="./assets/orange2.png"
            alt="Rotating Bottle"
            width={150}
            height={150}
            className="rotate-[-100deg]"
          />
        </motion.div>
      )}

      {/* Text Sections */}
      <div className={`absolute top-[10%] right-12 w-1/2 text-white transition-opacity duration-700 z-20 ${showFirst ? 'opacity-100' : 'opacity-0'}`}>
        <Image src="./assets/heritage.png" alt="About Image 1" width={200} height={200} className="rounded-lg" />
        <p className="text-lg max-w-lg leading-relaxed mt-0">
        Decades ago, on a sun-drenched street corner in southern India, a local soda-maker poured his spiced syrup into thick glass bottles, sealed them with marbles, and stacked them in a crate chilled by blocks of ice. Children gathered, wide-eyed, waiting for that satisfying pop — the moment the marble shot down and the fizz burst upward. That small bottle held more than soda; it held ritual, identity, and pride. Goli Soda was born out of ingenuity and necessity, crafted with local flavors and a unique bottling method that captured the spirit of the streets.
        </p>
      </div>

      <div className={`absolute top-[30%] left-12 w-1/2 text-white transition-opacity duration-700 z-20 ${showSecond ? 'opacity-100' : 'opacity-0'}`}>
        <Image src="./assets/nostalgia.png" alt="About Image 2" width={200} height={200} className="rounded-lg" />
        <p className="text-lg max-w-md leading-relaxed mt-0">
        Goli Soda is more than a beverage — it is a symbol of cultural heritage deeply woven into the fabric of Indian street life. The clink of the marble, the hiss of carbonation, and the ritual of popping the bottle open are experiences passed down through generations. Reviving this tradition in a new land meant honoring its origins. Every detail, from the distinctive bottle design to the authentic flavors, was preserved to reflect the roots of where it all began. You’re reliving a story, told through bubbles, laughter, and timeless flavor
        </p>
      </div>

      <div className={`absolute top-[60%] right-10 w-1/2 text-white transition-opacity duration-700 z-20 ${showThird ? 'opacity-100' : 'opacity-0'}`}>
        <Image src="./assets/connection.png" alt="About Image 3" width={200} height={200} className="rounded-lg" />
        <p className="text-lg max-w-lg leading-relaxed mt-0">
        What began on the vibrant streets of India now fizzes to life in a new land, carrying with it the essence of home for many and a spark of discovery for others. Every bottle tells a shared story: of migration, memory, and reinvention. It connects generations of immigrants to their roots while inviting new audiences to experience a piece of Indian tradition. In this journey from India to America, Goli Soda becomes a cultural handshake — a small, joyful exchange that brings people together, one pop at a time.

        </p>
      </div>
    </div>
  );
});

About.displayName = 'About';
export default About;