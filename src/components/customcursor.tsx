'use client';

import { useEffect, useRef } from 'react';
import { usePhaseStore } from '@/store/usePhaseStore';

const CustomCursor = () => {
  const phase = usePhaseStore((state) => state.phase);
  const dotRef = useRef<HTMLDivElement>(null);
  const blurRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let blurX = 0, blurY = 0;

    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const target = e.target as HTMLElement;
      const isInteractive = target.closest('a, button, [role="button"], [role="link"]');

      if (blurRef.current) {
        blurRef.current.style.opacity = isInteractive ? '0' : '1';
      }
    };

    const animate = () => {
      dotX = lerp(dotX, mouseX, 0.35);
      dotY = lerp(dotY, mouseY, 0.35);
      blurX = lerp(blurX, mouseX, 0.12);
      blurY = lerp(blurY, mouseY, 0.12);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
      }
      if (blurRef.current) {
        blurRef.current.style.transform = `translate3d(${blurX - 45}px, ${blurY - 45}px, 0)`;
      }

      requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMouseMove);
    animate();

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <>
      {/* Yellow Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] w-[13px] h-[13px] rounded-full bg-yellow-400 pointer-events-none mix-blend-normal"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      />

      {/* Glassmorphism Blur with text */}
      <div
        ref={blurRef}
        className="fixed top-0 left-0 z-[9998] w-[90px] h-[90px] rounded-full pointer-events-none border border-yellow-400 bg-yellow-200/20 backdrop-blur-[6px] transition-opacity duration-200 flex items-center justify-center"
        style={{ transform: 'translate3d(-100px, -100px, 0)', opacity: 1 }}
      >
        {phase === 'shake' && (
          <span className="text-yellow-200 text-[10px] font-semibold text-center leading-tight pointer-events-none">
            shake<br />the bottle
          </span>
        )}
      </div>
    </>
  );
};

export default CustomCursor;
