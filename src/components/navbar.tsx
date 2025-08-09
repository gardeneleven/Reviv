'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Partners', href: '/partner' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="w-full px-6 py-3 flex justify-between items-center bg-transparent fixed top-0 z-50">
      {/* Logo */}
      <div className="w-26 z-[100000]">
        <Link href="/">
          <Image
            src="/assets/logo.png"
            alt="Reviv Logo"
            width={120}
            height={40}
            className="w-full h-auto object-contain drop-shadow-md"
            priority
          />
        </Link>
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex gap-8 items-center text-yellow-400 font-light text-xl">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`transition hover:text-white ${
                pathname === link.href ? 'underline underline-offset-8' : ''
              }`}
            >
              {link.name}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/shop"
            className="bg-yellow-400 text-white px-4 py-2 rounded-md font-bold hover:bg-yellow-300 transition"
          >
            Shop Now
          </Link>
        </li>
      </ul>

      {/* Hamburger / X Button */}
      <button
        className="md:hidden text-yellow-400 z-[100000] relative"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-orange-400 z-[99999] flex flex-col items-start justify-center pl-8 space-y-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`text-yellow-400 text-5xl font-extrabold tracking-wide hover:text-white transition ${
                pathname === link.href ? 'underline underline-offset-4' : ''
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/shop"
            onClick={() => setIsOpen(false)}
            className="mt-8 bg-yellow-400 text-orange-400 px-6 py-3 rounded-md font-bold text-2xl hover:bg-opacity-80 transition"
          >
            Shop Now
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
