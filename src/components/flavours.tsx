'use client';

import { useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

const flavours = [
  {
    name: 'Orange',
    bottle: './assets/bottles/orange.png',
    bgImage: './assets/backgrounds/orange.png',
    bgText: 'orange',
  },
  
  
  {
    name: 'Lemon',
    bottle: './assets/bottles/lemon.png',
    bgImage: './assets/backgrounds/lemon.png',
    bgText: 'LEMON',
  },
  {
    name: 'Guava',
    bottle: './assets/bottles/guava.png',
    bgImage: './assets/backgrounds/guava.png',
    bgText: 'GUAVA',
  },
  {
    name: 'Cola',
    bottle: './assets/bottles/cola.png',
    bgImage: './assets/backgrounds/cola.png',
    bgText: 'COLA',
  },
  {
    name: 'Mango',
    bottle: './assets/bottles/mango.png',
    bgImage: './assets/backgrounds/mango.png',
    bgText: 'MANGO',
  },
];

export default function Flavours() {
  const [active, setActive] = useState(flavours[0]);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 transition-opacity duration-700">
        <Image
          src={active.bgImage}
          alt={`${active.name} Background`}
          fill
          className="object-cover object-center transition-opacity duration-700"
          priority
        />
      </div>

      {/* Background Text */}
      <div className="absolute inset-0 flex justify-center items-center z-10 pointer-events-none">
        <h1 className="text-[18vw] font-extrabold opacity-10 text-white select-none">
          {active.bgText}
        </h1>
      </div>

      {/* Bottle */}
      <div className="relative z-20 flex justify-center items-center h-full">
        <Image
          src={active.bottle}
          alt={`${active.name} Bottle`}
          width={300}
          height={600}
          className="transition-transform duration-500 drop-shadow-lg"
        />
      </div>

      {/* Flavour Selector */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-6 z-30">
        {flavours.map((flavour) => (
          <button
            key={flavour.name}
            onClick={() => setActive(flavour)}
            className={clsx(
              'px-6 py-2 rounded-full font-semibold border-2 transition-all duration-300 backdrop-blur-md',
              flavour.name === active.name
                ? 'bg-white text-black border-white'
                : 'bg-transparent text-white border-white hover:bg-white hover:text-black'
            )}
          >
            {flavour.name}
          </button>
        ))}
      </div>
    </section>
  );
} 