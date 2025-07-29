'use client';

import Image from 'next/image';

const flavors = [
  { name: 'Orange', src: '/assets/bottles/orange.png', color: '#FF7F00' }, 
  { name: 'Lemon Lime', src: '/assets/bottles/lemon.png', color: '#32CD32' }, 
  { name: 'Guava', src: '/assets/bottles/guava.png', color: '#FF4F87' },       
  { name: 'Cola', src: '/assets/bottles/cola.png', color: '#5C4033' },         
  { name: 'Mango', src: '/assets/bottles/mango.png', color: '#FFC107' },       
];

const ChooseFlavor = () => {
  return (
    <section className="h-screen w-full bg-white px-0 py-6 flex flex-col items-center justify-center overflow-hidden">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Choose Your Flavor
      </h2>

      <div className="flex justify-center items-end gap-2 w-full">
        {flavors.map((flavor, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="relative w-[18vw] h-[65vh]">
              <Image
                src={flavor.src}
                alt={flavor.name}
                fill
                style={{ objectFit: 'contain' }}
                draggable={false}
              />
            </div>
            <span
              className="mt-2 text-2xl font-medium leading-tight text-center"
              style={{ color: flavor.color }}
            >
              {flavor.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ChooseFlavor;