import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaLinkedin, FaFacebook, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="relative w-full h-screen text-yellow-400 font-bold flex flex-col justify-between">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('/assets/bg.png')" }}
      />

      {/* Logo over background - always visible */}
      <div className="absolute top-20 -left-40 z-20">
        <Image
          src="/assets/footer.png"
          alt="Reviv Logo"
          width={800}
          height={800}
          priority
        />
      </div>

      {/* Main content */}
      <div
        className="
          relative z-20 flex-grow
          px-4 md:px-6 py-12
          max-w-6xl
          flex flex-col md:flex-row
          gap-8 md:gap-12
          mt-24 md:mt-20
          ml-4 md:ml-auto
          justify-end items-start
        "
      >
        {/* Menu - hidden on small screens */}
        <div className="hidden md:block">
          <h4 className="font-medium mb-3">Menu</h4>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li><Link href="/about" className="hover:underline">About</Link></li>
            <li><Link href="/partners" className="hover:underline">Partners</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>

        {/* Reach Us with icons */}
        <div>
          <h4 className="font-medium mb-3">Reach Us</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <FaPhoneAlt className="text-yellow-400" />
              <a href="tel:+16692967533" className="hover:underline">+1 (669) 296-7533</a>
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-yellow-400" />
              <a href="mailto:admin@galacticbev.com" className="hover:underline">admin@galacticbev.com</a>
            </li>
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-yellow-400" />
              1798 Timothy Dr, San Leandro, California, 94577, United States
            </li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h4 className="font-medium mb-3">Follow Us</h4>
          <div className="flex space-x-4 text-2xl">
            <a href="https://instagram.com/revivsoda" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400">
              <FaInstagram />
            </a>
            <a href="https://linkedin.com/company/revivsoda" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
              <FaLinkedin />
            </a>
            <a href="https://x.com/revivsoda" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
              <FaXTwitter />
            </a>
            <a href="https://facebook.com/revivsoda" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
              <FaFacebook />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="relative z-20 text-center text-xs text-yellow-400 mb-6">
        &copy; {new Date().getFullYear()} Reviv. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;


