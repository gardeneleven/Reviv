'use client';

import Image from 'next/image';

export default function Flavours() {
  return (
    <section className="relative w-full h-screen overflow-hidden flex justify-center items-center">
      <Image
        src="/assets/allflavours.png"
        alt="All Flavours"
        fill
        className="object-contain"
        priority
      />
    </section>
  );
}