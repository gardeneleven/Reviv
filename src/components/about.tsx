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
      style={{ backgroundImage: "url('./assets/aboutb.png')" }}
    >
      {/* Always-on top-right badge */}
      <div className="absolute top-20 left-4 sm:top-[120px] sm:left-10 z-[1000] pointer-events-none">
  <Image
    src="/assets/about.png"
    alt="About Us"
    width={200} // default for mobile
    height={160}
    className="h-auto w-[200px] sm:w-[320px] sm:h-auto"
    priority
  />
</div>


      {/* Static upright bottle (before scroll) */}
      {!showFixedBottle && (
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 z-[9999]">
          <Image
            src="/assets/orange.png"
            alt="Bottle"
            width={450}
            height={450}
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
            src="/assets/orange.png"
            alt="Rotating Bottle"
            width={450}
            height={450}
            className="rotate-[-100deg]"
          />
        </motion.div>
      )}

      {/* Text Sections */}
      <div className="
  absolute top-[12%] left-1/2 -translate-x-1/2 w-[90vw] text-white z-20
  sm:top-[10%] sm:right-12 sm:left-auto sm:translate-x-0 sm:w-1/2
">
  <Image
    src="/assets/heritage.svg"
    alt="About Image 1"
    width={120}
    height={120}
    className="rounded-lg sm:w-[200px] sm:h-[200px]"
  />
  <p className="text-sm sm:text-lg leading-relaxed mt-2 sm:mt-0 max-w-none sm:max-w-lg">
  Decades ago, on a sun-drenched street corner in southern India, a local soda-maker poured his spiced syrup into thick glass bottles, sealed them with marbles, and stacked them in a crate chilled by blocks of ice. Children gathered, wide-eyed, waiting for that satisfying pop — the moment the marble shot down and the fizz burst upward. That small bottle held more than soda; it held ritual, identity, and pride. Goli Soda was born out of ingenuity and necessity, crafted with local flavors and a unique bottling method that captured the spirit of the streets.
  </p>
</div>


<div className={`
  absolute top-[40%] left-1/2 -translate-x-1/2 w-[90vw] text-white transition-opacity duration-700 z-20
  sm:top-[30%] sm:left-12 sm:translate-x-0 sm:w-1/2
  ${showSecond ? 'opacity-100' : 'opacity-0'}
`}>
  <Image
    src="/assets/nostalgia.svg"
    alt="About Image 2"
    width={120}
    height={120}
    className="rounded-lg sm:w-[200px] sm:h-[200px]"
  />
  <p className="text-sm sm:text-lg leading-relaxed mt-2 sm:mt-0 max-w-none sm:max-w-md">
  Goli Soda is more than a beverage — it is a symbol of cultural heritage deeply woven into the fabric of Indian street life. The clink of the marble, the hiss of carbonation, and the ritual of popping the bottle open are experiences passed down through generations. Reviving this tradition in a new land meant honoring its origins. Every detail, from the distinctive bottle design to the authentic flavors, was preserved to reflect the roots of where it all began. You’re reliving a story, told through bubbles, laughter, and timeless flavor
  </p>
</div>


<div className={`
  absolute top-[70%] left-1/2 -translate-x-1/2 w-[90vw] text-white transition-opacity duration-700 z-20
  sm:top-[60%] sm:right-10 sm:left-auto sm:translate-x-0 sm:w-1/2
  ${showThird ? 'opacity-100' : 'opacity-0'}
`}>
  <Image
    src="/assets/connection.svg"
    alt="About Image 3"
    width={120}
    height={120}
    className="rounded-lg sm:w-[200px] sm:h-[200px]"
  />
  <p className="text-sm sm:text-lg leading-relaxed mt-2 sm:mt-0 max-w-none sm:max-w-lg">
  What began on the vibrant streets of India now fizzes to life in a new land, carrying with it the essence of home for many and a spark of discovery for others. Every bottle tells a shared story: of migration, memory, and reinvention. It connects generations of immigrants to their roots while inviting new audiences to experience a piece of Indian tradition. In this journey from India to America, Goli Soda becomes a cultural handshake — a small, joyful exchange that brings people together, one pop at a time.
  </p>
</div>

    </div>
  );
});

About.displayName = 'About';
export default About;