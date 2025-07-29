const Footer = () => {
  return (
    <footer
      className="relative w-full h-screen text-white flex flex-col justify-between"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: "url('/assets/bg.png')",
        }}
      />
      
      {/* Main content */}
      <div className="relative z-20 flex-grow px-6 py-12 max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-6 mt-20">
        {/* Brand */}
        <div>
          <h3 className="text-3xl font-bold">Reviv</h3>
          <p className="text-base text-gray-300 mt-2">Refreshing tradition.</p>
        </div>

        {/* Contact Info */}
        <div className="text-base space-y-2">
          <p>
            <a href="mailto:admin@galacticbev.com" className="hover:underline text-white">
              admin@galacticbev.com
            </a>
          </p>
          <p>
            <a href="tel:+16692967533" className="hover:underline text-white">
              +1 (669) 296-7533
            </a>
          </p>
          <p>
            <span className="font-medium text-white">:</span>{' '}
            <span className="text-white">1798 Timothy Dr, San Leandro, California, 94577, United States</span>
          </p>
        </div>

        {/* Social */}
        <div className="text-base">
          <p className="font-medium mb-2 text-white">Follow Us</p>
          <a
            href="https://instagram.com/revivsoda"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-white-300"
          >
            @revivsoda
          </a>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="relative z-20 text-center text-xs text-gray-400 mb-6">
        &copy; {new Date().getFullYear()} Reviv. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;