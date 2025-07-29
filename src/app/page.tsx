'use client';

import Navbar from '@/components/navbar';

import Flavours from '@/components/flavours';
import BottlePop from '@/components/bottlepop';
import Experience from '@/components/experience';
import ChooseFrom from '@/components/chooseFrom';
import Footer from '@/components/footer';
import "./globals.css";

export default function Page() {
  

  return (
    <div className="relative w-[100vw] "
         style={{ backgroundImage: "url('./assets/bg3.png')" }}>
      <Navbar />
      <div className='overflow-x-hidden'>
        <Experience/>
      </div>
      <BottlePop/>
      <Flavours/>
      <ChooseFrom/>
      <Footer/>
    </div>
  );
}