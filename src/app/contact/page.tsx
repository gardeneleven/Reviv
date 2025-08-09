import ContactForm from "@/components/contact";
import Navbar from "@/components/navbar";
import Image from "next/image";
import { FaInstagram, FaLinkedin, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Page = () => {
  return (
    <div className="min-h-screen bg-[url('/assets/bg.png')] bg-center bg-cover bg-no-repeat bg-fixed">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6 md:mt-10 lg:mt-12">
        <div className="flex flex-col lg:flex-row items-start gap-8 md:gap-10 lg:gap-12">
          
          {/* Image: stacked on mobile, left on lg+ */}
          <div className="w-full lg:w-1/4">
            <div className="mx-auto w-2/3 sm:w-1/2 md:w-2/5 lg:w-full">
              <Image
                src="/assets/contactus.png"
                alt="Contact Us"
                width={600}
                height={600}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="w-full md:w-3/4 lg:w-2/5 lg:mt-16 xl:mt-24">
            <ContactForm />
          </div>

          {/* Contact Info */}
          <aside className="w-full md:w-3/4 lg:w-1/4 lg:mt-16 xl:mt-24 text-yellow-400">
            {/* Reach Us */}
            <div className="space-y-3">
              <h4 className="font-medium text-base sm:text-lg">Reach Us</h4>
              <ul className="space-y-3 text-sm sm:text-base">
                <li className="flex items-center gap-3">
                  <FaPhone aria-hidden /> +1 (669) 296-7533
                </li>
                <li className="flex items-center gap-3">
                  <FaEnvelope aria-hidden /> admin@galacticbev.com
                </li>
                <li className="flex items-center gap-3">
                  <FaMapMarkerAlt aria-hidden /> 1798 Timothy Dr, San Leandro, CA 94577
                </li>
              </ul>
            </div>

            {/* Follow Us */}
            <div className="mt-8 space-y-3">
              <h4 className="font-medium text-base sm:text-lg">Follow Us</h4>
              <div className="flex flex-wrap gap-5 text-2xl">
                <a
                  href="https://instagram.com/revivsoda"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="hover:opacity-80"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://linkedin.com/company/revivsoda"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="hover:opacity-80"
                >
                  <FaLinkedin />
                </a>
                <a
                  href="https://x.com/revivsoda"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (Twitter)"
                  className="hover:opacity-80"
                >
                  <FaXTwitter />
                </a>
                <a
                  href="https://facebook.com/revivsoda"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="hover:opacity-80"
                >
                  <FaFacebook />
                </a>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Page;
