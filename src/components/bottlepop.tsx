'use client';

import { useScroll, useTransform, useMotionValue, motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

const TOTAL_FRAMES = 16;

const BottlePop = () => {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const frame = useTransform(scrollYProgress, [0, 1], [0, TOTAL_FRAMES - 1]);
  const scale = useTransform(frame, [0, 2, TOTAL_FRAMES - 1], [1.8, 1.8, 1]);
  const containerY = useTransform(frame, [0, 2, TOTAL_FRAMES - 1], ['-30%', '-30%', '0%']);
  const rotate = useTransform(frame, [0, 2, TOTAL_FRAMES - 1], [-10, -10, 0]);

  const pulseOpacity = useTransform(
    scrollYProgress,
    [0.159, 0.16, 0.20, 0.21],
    [0, 1, 1, 0]
  );

  // ✅ Store current frame index in state
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    const unsubscribe = frame.on('change', (v) => {
      setCurrentFrame(Math.round(v));
    });
    return () => unsubscribe();
  }, [frame]);

  return (
    <div ref={ref} className="relative h-[200vh] mt-[50vh]">
      <motion.div
        style={{ position: 'sticky', top: 0 }}
        className="w-screen h-screen flex items-center justify-center bg-[url('/assets/bg0.png')] bg-cover bg-center"
      >
        <motion.div
          style={{
            scale,
            y: containerY,
            rotate,
            originY: 0,
            transformOrigin: 'top center',
          }}
          className="relative w-[120vw] h-[160vh]"
        >
          {/* ✅ NO HOOKS IN LOOP */}
          {Array.from({ length: TOTAL_FRAMES }).map((_, i) => (
            <div
              key={i}
              style={{
                opacity: currentFrame === i ? 1 : 0,
              }}
              className="absolute top-0 left-0 w-full h-full transition-opacity duration-100"
            >
              <Image
                src={`/assets/pop/pop-${i + 1}.png`}
                alt={`Pop Frame ${i + 1}`}
                fill
                style={{ objectFit: 'contain' }}
                priority={i === 0}
              />
            </div>
          ))}
        </motion.div>

        {/* Pulse overlay */}
        <motion.div
          style={{ opacity: pulseOpacity }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] flex flex-col items-center pointer-events-none"
        >
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute w-15 h-15 rounded-full border-2 border-yellow-300 opacity-60 animate-ping" />
            <div className="w-6 h-6 rounded-full bg-yellow-400 shadow-lg z-10" />
          </div>
          <div className="mt-2 text-yellow-800 font-bold text-sm text-center">
            push the marble
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BottlePop;
