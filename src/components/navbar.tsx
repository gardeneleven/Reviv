'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  const pathname = usePathname();

  const links = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Partners', href: '/partner' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="w-full px-6 py-2 flex justify-between items-center bg-transparent fixed top-0 z-50">
      <div className="w-26">
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

      <ul className="flex gap-8 items-center text-yellow-400 font-light text-xl">
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
    </nav>
  );
};

export default Navbar;
