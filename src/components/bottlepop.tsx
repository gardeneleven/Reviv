'use client';
import { usePhaseStore } from '@/store/usePhaseStore';

import { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, motion, PanInfo } from 'framer-motion';
import Image from 'next/image';


const SCROLL_FRAMES = 16;
const LAST_SCROLL_FRAME = SCROLL_FRAMES - 1; // 15

const BottleAnimation = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { phase, setPhase } = usePhaseStore();
  const [currentFrame, setCurrentFrame] = useState(0);
  const FLAVOR_START_FRAME = 0; // corresponds to pop-1
  const [isScrollClamped, setIsScrollClamped] = useState(false);

  const [flavorIndex, setFlavorIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const zoomInStart = 0.125;
  const zoomInEnd = 0.225;
  const scrollEnd = 0.8;
  const flavorStart = 0.95;

  const scale = useTransform(
    scrollYProgress,
    [zoomInStart, zoomInStart + 0.02, zoomInStart + 0.04, zoomInStart + 0.06, zoomInStart + 0.08, zoomInEnd, scrollEnd],
    [1, 1.2, 1.4, 1.6, 1.8, 2, 1]
  );

  const rotate = useTransform(scrollYProgress, [zoomInStart, scrollEnd], [5, 0]);

  const frame = useTransform(scrollYProgress, [zoomInEnd, scrollEnd], [0, LAST_SCROLL_FRAME]);

  const isScrollStarted = useTransform(scrollYProgress, (v) => v > zoomInStart);

  useEffect(() => {
    const unsub = isScrollStarted.on('change', (v) => {
      if (v && phase === 'float') setPhase('scroll');
      if (!v && phase !== 'drop') setPhase('drop');
    });
    return () => unsub();
  }, [isScrollStarted, phase, setPhase]);

  useEffect(() => {
    const unsub = frame.on('change', (v) => {
      if (phase !== 'scroll') return;
      setCurrentFrame(Math.min(LAST_SCROLL_FRAME, Math.round(v)));
    });
    return () => unsub();
  }, [frame, phase]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      if (v > flavorStart && phase !== 'flavors') setPhase('flavors');
      if (v <= flavorStart && phase === 'flavors') setPhase('scroll');
    });
    return () => unsubscribe();
  }, [scrollYProgress, phase, setPhase]);
  
  useEffect(() => {
    if (phase === 'scroll' && currentFrame === LAST_SCROLL_FRAME) {
      setPhase('shake');
    }
  }, [phase, currentFrame, setPhase]);

  const handleDropComplete = () => setPhase('float');

  const flavorImages = [
    '/assets/bottles/orange.png',
    '/assets/bottles/lemon.png',
    '/assets/bottles/guava.png',
    '/assets/bottles/mango.png',
    '/assets/bottles/cola.png',
  ];

  const flavorTitle = [
    '/assets/names/orange.png',
    '/assets/names/lemon.png',
    '/assets/names/guava.png',
    '/assets/names/mango.png',
    '/assets/names/cola.png',
  ];

  const flavorBackgrounds = [
    '/assets/backgrounds/orange.png',
    '/assets/backgrounds/lemon.png',
    '/assets/backgrounds/guava.png',
    '/assets/backgrounds/mango.png',
    '/assets/backgrounds/cola.png',
  ];

  const flavorFruits = [
    '/assets/fruits/orange.png',
    '/assets/fruits/lemon.png',
    '/assets/fruits/guava.png',
    '/assets/fruits/mango.png',
    '/assets/fruits/cola.png',
  ];

  const flavorNames = ['Orange', 'Lemon', 'Guava', 'Mango', 'Cola'];

  const flavorDescriptions = [
    'Bright, citrusy, and full of zing.',
    'Zesty lemon that wakes up your senses.',
    'Tropical sweetness with a tangy twist.',
    'Juicy mango magic in every sip.',
    'Classic fizz with a bold cola kick.',
  ];

  const introImgOpacity = useTransform(scrollYProgress, [0.06, 0.075, 0.10], [0, 1, 0]);
  const introImgY = useTransform(scrollYProgress, [0.06, 0.075, 0.10], [40, 0, -40]);

  const text1Opacity = useTransform(scrollYProgress, [0.11, 0.13, 0.17], [0, 1, 0]);
  const text1Y = useTransform(scrollYProgress, [0.11, 0.13, 0.17], [40, 0, -40]);

  const text2Opacity = useTransform(scrollYProgress, [0.17, 0.19, 0.21], [0, 1, 0]);
  const text2Y = useTransform(scrollYProgress, [0.17, 0.19, 0.21], [40, 0, -40]);

  const text3Opacity = useTransform(scrollYProgress, [0.61, 0.625, 0.7], [0, 1, 0]);
  const text3Y = useTransform(scrollYProgress, [0.61, 0.625, 0.7], [40, 0, -40]);

  const text4Opacity = useTransform(scrollYProgress, [0.81, 0.84, 0.87], [0, 1, 0]);
  const text4Y = useTransform(scrollYProgress, [0.81, 0.84, 0.87], [40, 0, -40]);

  const overlayOpacity = useTransform(scrollYProgress, [0.22, 0.25, 0.40], [0, 1, 0]);
  const overlayY = useTransform(scrollYProgress, [0.22, 0.25, 0.40], [40, 0, -40]);

  const sodaImgOpacity = useTransform(scrollYProgress, [0.71, 0.74, 0.77], [0, 1, 0]);
  const sodaImgY = useTransform(scrollYProgress, [0.71, 0.74, 0.77], [40, 0, -40]);
  const shakeImgOpacity = useTransform(scrollYProgress, [0.79, 0.80, 0.81], [0, 1, 0]);
  const shakeImgY = useTransform(scrollYProgress, [0.79, 0.80, 0.81], [40, 0, -40]);

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
        setIsScrollClamped(true); // ✅ Trigger scroll clamp
      }, 600);
    }
  };

  // ✅ Keep your clamp logic unchanged
  useEffect(() => {
    if (!isScrollClamped) return;

    const handleClampScroll = () => {
      const scrollTop = window.scrollY;
      const maxScroll = ref.current?.offsetTop || 0;
      const viewHeight = window.innerHeight;

      const scrollLimit = maxScroll + 0.95 * viewHeight * 3000; // Approximate 0.95 of h-[3000vh]

      if (scrollTop > scrollLimit) {
        window.scrollTo({ top: scrollLimit, behavior: 'smooth' });
      }
    };

    window.addEventListener('scroll', handleClampScroll);
    return () => window.removeEventListener('scroll', handleClampScroll);
  }, [isScrollClamped]);

  return (
    <div ref={ref} className="relative h-[2000vh]">
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
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center gap-2 pointer-events-none">
          <motion.div
            style={{ opacity: introImgOpacity, y: introImgY }}
            className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center gap-6 pointer-events-none z-20"
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

          <motion.div
            style={{ opacity: text1Opacity, y: text1Y }}
            className="absolute top-1/2 left-1/2 sm:left-[75%] transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[500px] h-auto flex flex-col justify-center items-start text-left px-6 z-[9999] sm:z-auto"
          >
            <h1 className="text-yellow-400 text-2xl sm:text-4xl font-bold mb-4">
              Not just a Soda, We wanted to bring you an Experience
            </h1>
            <p className="text-yellow-400 text-sm sm:text-base leading-relaxed text-justify">
              one that captures the essence of growing up in India. <br />
              A playful moment. A street-side memory. <br />
              A flavour of childhood, reimagined.
            </p>
          </motion.div>

          <motion.div
            style={{ opacity: text1Opacity, y: text1Y }}
            className="absolute top-[30%] left-[50%] sm:left-[30%] transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[500px] h-auto flex flex-col justify-center items-start text-left px-6 z-[9999] sm:z-auto"
          >
            <h1 className="text-yellow-400 text-2xl sm:text-4xl font-bold mb-4 font-cinzel">
              We Bring You
            </h1>
            <p className="text-yellow-400 text-sm sm:text-base leading-relaxed text-justify">
              a playful pop of nostalgia with a bold new look and 5 refreshing flavors that scream summer, stories, and second sips.
              Pop it. Sip it. Relive it.
            </p>
          </motion.div>

          <motion.div
            style={{ opacity: text2Opacity, y: text2Y }}
            className="absolute top-1/2 left-1/2 sm:left-[18%] transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[500px] h-auto flex flex-col justify-center items-start text-left px-6 z-[9999] sm:z-auto"
          >
            <h1 className="text-yellow-400 text-2xl sm:text-4xl font-bold mb-4">
              So.....We Packed it in a Bottle
            </h1>
            <p className="text-yellow-400 text-sm sm:text-base leading-relaxed text-justify"></p>
          </motion.div>

          <motion.div
            style={{ opacity: text3Opacity, y: text3Y }}
            className="absolute top-1/2 left-1/2 sm:left-[75%] transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[500px] h-auto flex flex-col justify-center items-start text-left px-6 z-[9999] sm:z-auto"
          >
            <h1 className="text-yellow-400 text-2xl sm:text-4xl font-bold mb-4">
              That Pop? Now thats an experience
            </h1>
            <p className="text-yellow-400 text-sm sm:text-base leading-relaxed text-justify">
              Born in the heart of Indian summers — now shared with the world.
            </p>
          </motion.div>
        </div>

        {/* Instruction Overlay */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none z-[999]"
          style={{ opacity: overlayOpacity, y: overlayY }}
        >
          <div className="relative w-full h-full">
            <p className="absolute top-50 left-30 text-yellow-400 text-xl sm:text-2xl font-light z-20">Well, go on.....</p>

            <div className="absolute bottom-24 left-80 sm:bottom-32 sm:left=[25vw] flex flex-col items-center z-10">
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

        <motion.div
          style={{ opacity: sodaImgOpacity, y: sodaImgY }}
          className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none z-20"
        >
          <Image src="/assets/sodaa.png" alt="Soda Overlay" width={1000} height={1000} className="w-[80vw] max-w-[900px] h-auto" priority />
        </motion.div>

        {!isScrollClamped && (
          <motion.div
            style={{ opacity: shakeImgOpacity, y: shakeImgY }}
            className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none z-20"
          >
            <Image src="/assets/shake.png" alt="Shake Overlay" width={1000} height={1000} className="w-[80vw] max-w-[900px] h-auto" priority />
            <div className="absolute bottom-1 sm:bottom-2 left-1/2 transform -translate-x-1/2 z-30 text-yellow-400 text-center space-y-3 pointer-events-none">
              <div className="flex items-center justify-center gap-2">
                <Image src="/assets/arrow-left.png" alt="Left Arrow" width={20} height={20} />
                <div className="w-24 h-1.5 bg-yellow-400 rounded-full opacity-80" />
                <Image src="/assets/arrow-right.png" alt="Right Arrow" width={20} height={20} />
              </div>
              <p className="text-sm sm:text-base text-white font-medium">drag the bottle left and right really fast</p>
            </div>
          </motion.div>
        )}

        <div className="relative w-[130vw] sm:w-[120vw] h-[180vh] sm:h-[160vh]">
          {phase === 'drop' && (
            <motion.div
              initial={{ y: '-100vh', opacity: 0, rotate: -10 }}
              animate={{ y: 0, opacity: 1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 70, damping: 9, mass: 0.6 }}
              onAnimationComplete={handleDropComplete}
              className="absolute top-0 left-0 w-full h-full z-40"
              style={{ originY: 0, transformOrigin: 'top center' }}
            >
              <Image src="/assets/pop/pop-1.png" alt="Bottle Drop" fill style={{ objectFit: 'contain' }} priority draggable={false} />
            </motion.div>
          )}

          {phase === 'float' && (
            <motion.div
              animate={{ scale: 1, rotate: 5, y: [1, -3, 1, 3, 1] }}
              transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
              initial={{ scale: 1, rotate: 5 }}
              className="absolute top-0 left-0 w-full h-full"
              style={{ originY: 0, transformOrigin: 'top center' }}
            >
              <Image src="/assets/pop/pop-1.png" alt="Bottle Float" fill style={{ objectFit: 'contain' }} priority draggable={false} />
            </motion.div>
          )}

          {phase === 'scroll' && (
            <motion.div
              style={{ scale, y: '0%', rotate, originY: 0, transformOrigin: 'top center' }}
              className="absolute top-0 left-0 w-full h-full"
            >
              {Array.from({ length: SCROLL_FRAMES }).map((_, i) => (
                <div
                  key={i}
                  style={{ opacity: currentFrame === i ? 1 : 0 }}
                  className="absolute top-0 left-0 w-full h-full transition-opacity duration-100"
                >
                  <Image
                    src={`/assets/pop/pop-${i + 1}.png`} // pop-1 ... pop-16
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

          {phase === 'shake' && (
            <motion.div
              className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="relative w-full h-full">
                <div className="absolute top-0 left-0 w-full h-full z-10">
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

          {phase === 'flavors' && (
            <motion.div
              className="absolute top-0 left-0 w-full h-full z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={flavorTitle[flavorIndex]}
                  alt="Flavor Bottle"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                  draggable={false}
                  className="select-none"
                />

                {/* 🔒 Bottle – fixed size like scroll/shake */}
                <div className="absolute top-[50] left-1/2 -translate-x-1/2 z-10 w-[600px] h-[800px]">
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

                {/* ✅ Flavor Description + Buttons – center right */}
                <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-6 z-20">
                  <div className="flex flex-col gap-4">
                    {flavorFruits.map((fruitSrc, i) => (
                      <button
                        key={i}
                        onClick={() => setFlavorIndex(i)}
                        className={`transition-transform duration-300 ${flavorIndex === i ? 'scale-125' : 'scale-100'}`}
                      >
                        <Image
                          src={fruitSrc}
                          alt={`Select ${flavorNames[i]}`}
                          width={60}
                          height={60}
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
