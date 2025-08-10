'use client';
import { usePhaseStore } from '@/store/usePhaseStore';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useScroll, useTransform, motion, PanInfo } from 'framer-motion';
import Image from 'next/image';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
declare global {
  interface WindowEventMap {
    scrollend: Event;
  }
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------
const SCROLL_FRAMES = 16;
const LAST_SCROLL_FRAME = SCROLL_FRAMES - 1; // 15

// Snap points for pages 0..8
const STEPS: number[] = [0.02, 0.06, 0.095, 0.13, 0.19, 0.25, 0.625, 0.74, 0.8];

// Optional pinned frames per step
const STEP_FRAMES: number[] = [0, 0, 1, 3, 5, 7, 9, 12, 14, 14];

// Wheel gesture thresholds to avoid accidental reverses in "flavors"
const WHEEL_EXIT_THRESHOLD_UP = -60;    // cumulative deltaY ≤ this triggers reverse to shake
const WHEEL_EXIT_THRESHOLD_DOWN = 60;   // cumulative deltaY ≥ this allows pass-through
const WHEEL_ACC_RESET_MS = 180;

const BottleAnimation = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { phase, setPhase } = usePhaseStore();

  const [currentFrame, setCurrentFrame] = useState(0);
  const [isScrollClamped, setIsScrollClamped] = useState(false);
  const [flavorIndex, setFlavorIndex] = useState(0);

  // Track if the drop has already played
  const hasDropped = useRef(false);

  // Base progress (used for bottle motion; page snaps jump progress)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Bottle zoom/rotate/frame
  const zoomInStart = 0.125;
  const zoomInEnd = 0.225;
  const scrollEnd = 0.8;

  const scale = useTransform(
    scrollYProgress,
    [zoomInStart, zoomInStart + 0.02, zoomInStart + 0.04, zoomInStart + 0.06, zoomInStart + 0.08, zoomInEnd, scrollEnd],
    [1, 1.2, 1.4, 1.6, 1.8, 2, 1]
  );
  const rotate = useTransform(scrollYProgress, [zoomInStart, scrollEnd], [5, 0]);
  const frame = useTransform(scrollYProgress, [zoomInEnd, scrollEnd], [0, LAST_SCROLL_FRAME]);

  useEffect(() => {
    const unsub = frame.on('change', (v) => {
      if (phase !== 'scroll') return;
      setCurrentFrame(Math.min(LAST_SCROLL_FRAME, Math.round(v)));
    });
    return () => unsub();
  }, [frame, phase]);

  const [step, setStep] = useState(0);

  const handleDropComplete = () => {
    hasDropped.current = true;
    setPhase('float');
    setStep(1); // move to float page after first drop completes
  };

  // Assets
  const flavorImages = useMemo(
    () => [
      '/assets/bottles/orange.png',
      '/assets/bottles/lemon.png',
      '/assets/bottles/guava.png',
      '/assets/bottles/mango.png',
      '/assets/bottles/cola.png',
    ],
    []
  );
  const flavorTitle = useMemo(
    () => [
      '/assets/names/orange.png',
      '/assets/names/lemon.png',
      '/assets/names/guava.png',
      '/assets/names/mango.png',
      '/assets/names/cola.png',
    ],
    []
  );
  const flavorBackgrounds = useMemo(
    () => [
      '/assets/backgrounds/orange.png',
      '/assets/backgrounds/lemon.png',
      '/assets/backgrounds/guava.png',
      '/assets/backgrounds/mango.png',
      '/assets/backgrounds/cola.png',
    ],
    []
  );
  const flavorFruits = useMemo(
    () => [
      '/assets/fruits/orange.png',
      '/assets/fruits/lemon.png',
      '/assets/fruits/guava.png',
      '/assets/fruits/mango.png',
      '/assets/fruits/cola.png',
    ],
    []
  );
  const flavorNames = useMemo(() => ['Orange', 'Lemon', 'Guava', 'Mango', 'Cola'], []);

  const isLockedRef = useRef(false);

  const scrollToProgress = useCallback((p: number) => {
    if (!ref.current) return;
    const containerTop = ref.current.offsetTop;
    const containerHeight = ref.current.offsetHeight;
    const vh = window.innerHeight;
    // mapping for offset: ['start end','end start']
    const startTop = containerTop - vh; // progress 0
    const span = containerHeight + vh;  // total scrollable span
    const target = startTop + p * span;
    window.scrollTo({ top: target, behavior: 'smooth' });
  }, []);

  // ---- Stepper with scrollend unlock ----
  const SCROLL_UNLOCK_FALLBACK_MS = 1200;

  const goToStep = useCallback((next: number) => {
    if (!ref.current) return;
    isLockedRef.current = true;
    setStep(next);
    scrollToProgress(STEPS[next]);

    let unlocked = false;
    const unlock = () => {
      if (unlocked) return;
      unlocked = true;
      isLockedRef.current = false;
      window.removeEventListener('scrollend', unlock);
    };

    window.addEventListener('scrollend', unlock, { once: true });
    window.setTimeout(unlock, SCROLL_UNLOCK_FALLBACK_MS);
  }, [scrollToProgress]);

  // Wheel: one page per gesture; robust thresholds in "flavors"
  const wheelAccRef = useRef(0);
  const wheelTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const resetWheelAcc = () => {
      wheelAccRef.current = 0;
      if (wheelTimerRef.current) {
        window.clearTimeout(wheelTimerRef.current);
        wheelTimerRef.current = null;
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (isLockedRef.current) return;

      // In flavors: only reverse on a clear upward gesture (cumulative threshold).
      if (phase === 'flavors') {
        wheelAccRef.current += e.deltaY;
        if (wheelTimerRef.current) window.clearTimeout(wheelTimerRef.current);
        wheelTimerRef.current = window.setTimeout(resetWheelAcc, WHEEL_ACC_RESET_MS);

        // Strong upward: go back to shake
        if (wheelAccRef.current <= WHEEL_EXIT_THRESHOLD_UP) {
          e.preventDefault();
          resetWheelAcc();
          setIsScrollClamped(false);
          setPhase('shake');
          goToStep(8);
          return;
        }

        // Strong downward: allow pass-through to content after component
        if (wheelAccRef.current >= WHEEL_EXIT_THRESHOLD_DOWN) {
          // do NOT preventDefault; also drop clamp so page can move
          setIsScrollClamped(false);
          // keep natural scrolling
          return;
        }

        // Small jitters: ignore (no preventDefault so clamp keeps you in place)
        return;
      }

      // Outside flavors: paging inside experience
      e.preventDefault();
      const dir = e.deltaY > 0 ? 1 : -1; // down -> next, up -> prev
      const next = Math.max(0, Math.min(STEPS.length - 1, step + dir));
      if (next !== step) goToStep(next);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', onWheel);
      if (wheelTimerRef.current) window.clearTimeout(wheelTimerRef.current);
    };
  }, [step, phase, goToStep]);

  // Touch: vertical swipe to page; allow pass-through after Flavors (already thresholded)
  useEffect(() => {
    let startY = 0;
    const threshold = 24;

    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isLockedRef.current) return;

      const dy = e.touches[0].clientY - startY;
      if (Math.abs(dy) < threshold) return;

      const dir = dy < 0 ? 1 : -1; // swipe up -> next (downward scroll)

      if (phase === 'flavors') {
        if (dir < 0) {
          // reverse to shake (clear upward swipe)
          e.preventDefault();
          setIsScrollClamped(false);
          setPhase('shake');
          goToStep(8);
        } else {
          // forward: allow natural page scroll to content after animation
          setIsScrollClamped(false);
          // no preventDefault: let it scroll
        }
        return;
      }

      e.preventDefault();
      const next = Math.max(0, Math.min(STEPS.length - 1, step + dir));
      if (next !== step) goToStep(next);
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [step, phase, goToStep]);

  // Drive phases from step indexing
  useEffect(() => {
    if (phase === 'flavors') return; // flavors is manual until user reverses

    if (step === 0) {
      setPhase(hasDropped.current ? 'float' : 'drop');
    } else if (step === 1) {
      setPhase('float');
    } else if (step >= 2 && step <= 7) {
      setPhase('scroll');
    } else if (step === 8) {
      setPhase('shake');
    }
  }, [step, phase, setPhase]);

  // Optional: pin bottle frames for narrative beats
  useEffect(() => {
    if (phase === 'scroll') {
      setCurrentFrame(STEP_FRAMES[step] ?? 0);
    }
  }, [step, phase]);

  // Shake logic
  const lastDirection = useRef<'left' | 'right' | null>(null);
  const shakeCount = useRef(0);

  const handleDrag = (_event: MouseEvent | TouchEvent, info: PanInfo) => {
    const direction = info.delta.x > 0 ? 'right' : 'left';
    if (lastDirection.current && direction !== lastDirection.current) {
      shakeCount.current += 1;
    }
    lastDirection.current = direction;

    if (shakeCount.current >= 6) {
      const bottle = document.getElementById('pop16');
      bottle?.classList.add('ink-burst');

      setTimeout(() => {
        setPhase('flavors');
        setCurrentFrame(0);
        shakeCount.current = 0;
        lastDirection.current = null;
        setIsScrollClamped(true); // enable clamp while in flavors
      }, 600);
    }
  };

  // Clamp only to the container’s end (fixes small screens + “stuck after flavors”)
  useEffect(() => {
    if (!isScrollClamped) return;

    const handleClampScroll = () => {
      const containerTop = ref.current?.offsetTop ?? 0;
      const containerHeight = ref.current?.offsetHeight ?? 0;
      const viewHeight = window.innerHeight;

      // Stop at the bottom of this component (not an arbitrary vh)
      const endOfComponent = containerTop + Math.max(0, containerHeight - viewHeight);

      if (window.scrollY > endOfComponent) {
        window.scrollTo({ top: endOfComponent, behavior: 'smooth' });
      }
    };

    window.addEventListener('scroll', handleClampScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleClampScroll);
  }, [isScrollClamped]);

  return (
    <div ref={ref} className="relative h-[2000vh]">
      {/* Background */}
      <div className="fixed top-0 left-0 w-screen h-screen z-0">
        <Image
          src={phase === 'flavors' ? flavorBackgrounds[flavorIndex] : '/assets/bg.png'}
          alt="Background"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      <motion.div style={{ position: 'sticky', top: 0, zIndex: 10 }} className="w-screen h-screen flex items-center justify-center">
        {/* ---- Overlay Pages (binary visibility per step) ---- */}
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center gap-2 pointer-events-none">
          {/* Step 2: Intro image */}
          <motion.div
            style={{ opacity: step === 2 ? 1 : 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-6 pointer-events-none z-20"
          >
            <Image
              src="/assets/reviv.png"
              alt="Reviv"
              width={500}
              height={500}
              className="w-[80vw] max-w-[900px] h-auto"
              priority
            />
          </motion.div>

          {/* Step 3: We Bring You */}
          <motion.div
            style={{ opacity: step === 3 ? 1 : 0 }}
            className="absolute top-[30%] left-1/2 sm:left-[30%] -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[500px] px-6 z-[9999]"
          >
            <h1 className="text-yellow-400 text-2xl sm:text-4xl font-bold mb-4 font-cinzel">
              We Bring You
            </h1>
            <p className="text-yellow-400 text-sm sm:text-base leading-relaxed text-justify">
              a playful pop of nostalgia with a bold new look and 5 refreshing flavors that scream summer, stories, and second sips.
              Pop it. Sip it. Relive it.
            </p>
          </motion.div>

          {/* Step 4: So.....We Packed it in a Bottle */}
          <motion.div
            style={{ opacity: step === 4 ? 1 : 0 }}
            className="absolute top-1/2 left-1/2 sm:left-[18%] -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[500px] px-6 z-[9999]"
          >
            <h1 className="text-yellow-400 text-2xl sm:text-4xl font-bold mb-4">
              So.....We Packed it in a Bottle
            </h1>
          </motion.div>

          {/* Step 5: Instruction Overlay */}
          <motion.div
            style={{ opacity: step === 5 ? 1 : 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-[999]"
          >
            <div className="relative w-full h-full">
              <p className="absolute top-50 left-30 text-yellow-400 text-xl sm:text-2xl font-light z-20">Well, go on.....</p>

              <div className="absolute bottom-24 left-80 sm:bottom-32 sm:left-[25vw] flex flex-col items-center z-10">
                <div className="w-[2px] h-32 bg-yellow-400 opacity-80" />
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative"
                >
                  <div className="absolute inset-0 w-12 h-12 rounded-full bg-yellow-400/20 blur-md -z-10" />
                  <Image src="/assets/finger.png" alt="Finger" width={48} height={48} className="my-1 opacity-90 relative z-10" />
                </motion.div>
                <div className="w-[1px] h-16 bg-yellow-200 opacity-50" />
                {[...Array(3)].map((_, i) => (
                  <motion.div key={i} animate={{ y: [0, 4, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}>
                    <Image src="/assets/down.png" alt={`Down Arrow ${i + 1}`} width={24} height={24} className="opacity-90 mt-[5px]" />
                  </motion.div>
                ))}
              </div>

              <Image
                alt=""
                src="/assets/pm.png"
                width={500}
                height={700}
                className="mx-auto mt-40"
                style={{ objectFit: 'contain' }}
                priority={false}
                draggable={false}
              />
              <p className="absolute bottom-0 left-0 w-full text-white text-center text-sm sm:text-base pb-1">
                scroll down to pop the marble and feel the fizz
              </p>
            </div>
          </motion.div>

          {/* Step 6: That Pop? Now thats an experience */}
          <motion.div
            style={{ opacity: step === 6 ? 1 : 0 }}
            className="absolute top-1/2 left-1/2 sm:left-[75%] -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[500px] px-6 z-[9999]"
          >
            <h1 className="text-yellow-400 text-2xl sm:text-4xl font-bold mb-4">
              That Pop? Now thats an experience
            </h1>
            <p className="text-yellow-400 text-sm sm:text-base leading-relaxed text-justify">
              Born in the heart of Indian summers — now shared with the world.
            </p>
          </motion.div>

          {/* Step 7: Soda overlay image */}
          <motion.div
            style={{ opacity: step === 7 ? 1 : 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          >
            <Image src="/assets/sodaa.png" alt="Soda Overlay" width={1000} height={1000} className="w-[80vw] max-w-[900px] h-auto" priority />
          </motion.div>

          {/* Step 8: Shake overlay (shown until shake completes) */}
          {!isScrollClamped && (
            <motion.div
              style={{ opacity: step === 8 ? 1 : 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
            >
              <Image src="/assets/shake.png" alt="Shake Overlay" width={1000} height={1000} className="w-[80vw] max-w-[900px] h-auto" priority />
              <div className="absolute bottom-1 sm:bottom-2 left-1/2 -translate-x-1/2 z-30 text-yellow-400 text-center space-y-3 pointer-events-none">
                <div className="flex items-center justify-center gap-2">
                  <Image src="/assets/arrow-left.png" alt="Left Arrow" width={20} height={20} />
                  <div className="w-24 h-1.5 bg-yellow-400 rounded-full opacity-80" />
                  <Image src="/assets/arrow-right.png" alt="Right Arrow" width={20} height={20} />
                </div>
                <p className="text-sm sm:text-base text-white font-medium">drag the bottle left and right really fast</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* ---- Bottle container (drop/float/scroll/shake/flavors) ---- */}
        <div className="relative w-[130vw] sm:w-[120vw] h-[180vh] sm:h-[160vh]">
          {/* DROP — only the first time */}
          {phase === 'drop' && !hasDropped.current && (
            <motion.div
              initial={{ y: '-100vh', opacity: 0, rotate: -10 }}
              animate={{ y: 0, opacity: 1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 70, damping: 9, mass: 0.6 }}
              onAnimationComplete={handleDropComplete}
              className="absolute inset-0 z-40"
              style={{ originY: 0, transformOrigin: 'top center' }}
            >
              <Image src="/assets/pop/pop-1.png" alt="Bottle Drop" fill style={{ objectFit: 'contain' }} priority draggable={false} />
            </motion.div>
          )}

          {/* FLOAT */}
          {phase === 'float' && (
            <motion.div
              animate={{ scale: 1, rotate: 5, y: [1, -3, 1, 3, 1] }}
              transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
              initial={{ scale: 1, rotate: 5 }}
              className="absolute inset-0"
              style={{ originY: 0, transformOrigin: 'top center' }}
            >
              <Image src="/assets/pop/pop-1.png" alt="Bottle Float" fill style={{ objectFit: 'contain' }} priority draggable={false} />
            </motion.div>
          )}

          {/* SCROLL */}
          {phase === 'scroll' && (
            <motion.div
              style={{ scale, y: '0%', rotate, originY: 0, transformOrigin: 'top center' }}
              className="absolute inset-0"
            >
              {Array.from({ length: SCROLL_FRAMES }).map((_, i) => (
                <div
                  key={i}
                  style={{ opacity: currentFrame === i ? 1 : 0 }}
                  className="absolute inset-0 transition-opacity duration-100"
                >
                  <Image
                    src={`/assets/pop/pop-${i + 1}.png`}
                    alt={`Pop Frame ${i + 1}`}
                    fill
                    style={{ objectFit: 'contain' }}
                    priority={i === 0}
                    draggable={false}
                  />
                </div>
              ))}
            </motion.div>
          )}

          {/* SHAKE */}
          {phase === 'shake' && (
            <motion.div
              className="absolute inset-0 z-10 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="relative w-full h-full">
                <div className="absolute inset-0 z-10">
                  <motion.div
                    drag="x"
                    dragElastic={0.25}
                    dragConstraints={{ left: -60, right: 60 }}
                    onDrag={handleDrag}
                    style={{ originY: 0.1, transformOrigin: 'top center' }}
                    className="w-full h-full pointer-events-auto"
                  >
                    <Image
                      id="pop16"
                      src="/assets/pop/pop-16.png"
                      alt="Shake Bottle"
                      fill
                      style={{ objectFit: 'contain' }}
                      draggable={false}
                      className="select-none"
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {/* FLAVORS */}
          {phase === 'flavors' && (
            <motion.div
              className="absolute inset-0 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Title OVERLAY – always on top of bottle */}
                <div className="absolute inset-0 z-[60] pointer-events-none">
                  <Image
                    src={flavorTitle[flavorIndex]}
                    alt="Flavor Title"
                    fill
                    style={{ objectFit: 'contain' }}
                    priority
                    draggable={false}
                    className="select-none"
                  />
                </div>

                {/* Bottle layer – below title (FIXED SIZE) */}
                <div
                  className="
                    absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                    z-[40]
                    w-[60vw] sm:w-[50vw] md:w-[42vw] lg:w-[36vw]
                    max-w-[520px]
                    aspect-[3/4]
                  "
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={flavorImages[flavorIndex]}
                      alt="Flavor Bottle"
                      fill
                      style={{ objectFit: 'contain' }}
                      priority
                      draggable={false}
                      className="select-none"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="absolute right-6 sm:right-8 top-1/2 -translate-y-1/2 flex items-center gap-4 sm:gap-6 z-[70]">
                  <div className="flex flex-col gap-3 sm:gap-4">
                    {flavorFruits.map((fruitSrc, i) => (
                      <button
                        key={i}
                        onClick={() => setFlavorIndex(i)}
                        className={`transition-transform duration-300 ${flavorIndex === i ? 'scale-125' : 'scale-100'}`}
                      >
                        <Image
                          src={fruitSrc}
                          alt={`Select ${flavorNames[i]}`}
                          width={56}
                          height={56}
                          className="rounded-full"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default BottleAnimation;
