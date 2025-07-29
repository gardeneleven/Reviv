'use client';

import Image from 'next/image';

const Page = () => {
  return (
    <div
      className="w-screen h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('./assets/bg.png')" }}
    >
      <div
        className="absolute top-1/2 left-1/2"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <Image
          src="./assets/comingsoon.png"
          alt="Bottle"
          width={1280}
          height={0} // Use 0 to preserve aspect ratio when only width is defined
          draggable={false}
          priority
        />
      </div>
    </div>
  );
};

export default Page;
