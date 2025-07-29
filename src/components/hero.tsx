'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const items = [
  { src: 'from.svg', top: '9%', left: '19%', width: 140 },
  { src: 'the.svg', top: '18%', left: '23%', width: 70 },
  { src: 'streets.svg', top: '18%', left: '22%', width: 300 },
  { src: 'of.svg', top: '32%', left: '35%', width: 60 },
  { src: 'india.svg', top: '13%', left: '16%', width: 950, center: true },
  { src: 'to.svg', top: '63%', left: '49%', width: 96 },
  { src: 'the2.svg', top: '66%', left: '54%', width: 70 },
  { src: 'world.svg', top: '65%', left: '46%', width: 350 },
];

const Hero = () => {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCount((prev) => {
        const next = prev + 1;
        if (next === items.length) clearInterval(interval);
        return next <= items.length ? next : prev;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative w-screen h-screen bg-cover bg-center bg-no-repeat overflow-x-hidden"
      style={{ backgroundImage: "url('/assets/')" }}
    >
      {/* Animated Text Items */}
      {items.slice(0, visibleCount).map((item, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: item.top,
            left: item.left,
            transform: item.center ? 'translateX(-50%)' : 'none',
            zIndex: 10,
            width: `${item.width}px`,
            height: 'auto',
          }}
          className={`fade-slide ${item.src === 'india.svg' ? 'india-pop' : ''}`}
        >
          <Image
            src={`./assets/${item.src}`}
            alt={item.src}
            width={item.width}
            height={0}
            draggable={false}
            style={{ height: 'auto' }}
            priority={i === 0}
          />
        </div>
      ))}

      {/* Bottle with buoyancy drop to top-center */}
      {visibleCount >= items.length && (
        <motion.div
          initial={{ y: '-100vh', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 70,
            damping: 9,
            mass: 0.6,
          }}
          className="absolute top-1/2 left-[43%] z-40 pointer-events-none bottle-float"
          style={{
            transform: 'translate(-50%, -50%) rotate(5deg)',
          }}
        >
          <Image
            src="./assets/orange2.png"
            alt="Bottle"
            width={180}
            height={0}
            style={{ height: 'auto' }}
            draggable={false}
            priority
          />
        </motion.div>
      )}

      {/* Footer Text */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex text-[22px] text-yellow-400 tracking-wide z-50 font-light">
        {'scroll to experience the fizz'.split('').map((char, i) => (
          <span
            key={i}
            className="glow-letter"
            style={{
              animationDelay: `${i * 0.12}s`,
              marginRight: char === ' ' ? '0.45em' : '0em',
            }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Hero;
