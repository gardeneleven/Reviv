'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

// Add topSm, leftSm, and widthSm where needed
const items = [
  { src: 'from.svg', top: '9%', left: '19%', width: 140, topSm: '15%', leftSm: '12%', widthSm: 100 },
  { src: 'the.svg', top: '18%', left: '23%', width: 70, topSm: '22%', leftSm: '16%', widthSm: 50 },
  { src: 'streets.svg', top: '18%', left: '22%', width: 300, topSm: '22%', leftSm: '12%', widthSm: 240 },
  { src: 'of.svg', top: '32%', left: '35%', width: 60, topSm: '26%', leftSm: '30%', widthSm: 45 },
  { src: 'india.svg', top: '13%', left: '16%', width: 950, center: true, topSm: '25%', leftSm: '2%', widthSm: 550 },
  { src: 'to.svg', top: '63%', left: '49%', width: 96, topSm: '56%', leftSm: '52%', widthSm: 70 },
  { src: 'the2.svg', top: '66%', left: '54%', width: 70, topSm: '62%', leftSm: '56%', widthSm: 50 },
  { src: 'world.svg', top: '65%', left: '46%', width: 350, topSm: '62%', leftSm: '50%', widthSm: 240 },
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
          className={`absolute z-10 fade-slide ${item.src === 'india.svg' ? 'india-pop' : ''} sm:hidden`}
          style={{
            top: item.topSm || item.top,
            left: item.leftSm || item.left,
            transform: item.center ? 'translateX(-50%)' : 'none',
            width: `${item.widthSm || item.width}px`,
            height: 'auto',
          }}
        >
          <Image
            src={`/assets/${item.src}`}
            alt={item.src}
            width={item.widthSm || item.width}
            height={0}
            style={{ height: 'auto' }}
            draggable={false}
            priority={i === 0}
          />
        </div>
      ))}

      {/* Default (md+) positioned items */}
      {items.slice(0, visibleCount).map((item, i) => (
        <div
          key={`lg-${i}`}
          className={`absolute z-10 fade-slide ${item.src === 'india.svg' ? 'india-pop' : ''} hidden sm:block`}
          style={{
            top: item.top,
            left: item.left,
            transform: item.center ? 'translateX(-50%)' : 'none',
            width: `${item.width}px`,
            height: 'auto',
          }}
        >
          <Image
            src={`/assets/${item.src}`}
            alt={item.src}
            width={item.width}
            height={0}
            style={{ height: 'auto' }}
            draggable={false}
            priority={i === 0}
          />
        </div>
      ))}

      {/* Scroll Cue Text */}
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
