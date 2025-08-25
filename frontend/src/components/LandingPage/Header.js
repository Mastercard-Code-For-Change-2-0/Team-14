import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = ["Home", "About Us", "Our Work", "Get Involved", "Contact", "Events"];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-gray-900 shadow-md py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <div className="text-3xl md:text-4xl font-extrabold text-white tracking-wide">
          <span className="text-teal-400">Kind</span>Heart
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => {
            if (link === "Home") {
              return (
                <Link
                  key={link}
                  to="/"
                  className="text-lg text-white font-medium relative"
                >
                  {link}
                </Link>
              );
            }
            if (link === "Events") {
              return (
                <Link
                  key={link}
                  to="/events"
                  className="text-lg text-white font-medium relative"
                >
                  {link}
                </Link>
              );
            }
            return (
              <motion.a
                key={link}
                href={`#${link.toLowerCase().replace(" ", "-")}`}
                className="text-lg text-white font-medium relative"
                whileHover="hover"
              >
                {link}
                <motion.div
                  className="absolute bottom-[-6px] left-0 right-0 h-0.5 bg-teal-400"
                  variants={{
                    initial: { scaleX: 0 },
                    hover: { scaleX: 1 },
                  }}
                  initial="initial"
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            );
          })}
        </nav>

        {/* Desktop Profile Button */}
        <Link to="/dashboard">
          <motion.button
            className="hidden md:block bg-teal-500 text-white px-6 py-2 rounded-full font-semibold shadow-lg"
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 5px 15px rgba(0, 150, 136, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            animate={{
              scale: [1, 1.02, 1],
              transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            Profile
          </motion.button>
        </Link>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden bg-gray-900 text-white px-6 py-6 space-y-6"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
          >
            {navLinks.map((link) => {
              if (link === "Home") {
                return (
                  <Link
                    key={link}
                    to="/"
                    className="block text-lg font-medium hover:text-teal-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link}
                  </Link>
                );
              }
              if (link === "Events") {
                return (
                  <Link
                    key={link}
                    to="/events"
                    className="block text-lg font-medium hover:text-teal-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link}
                  </Link>
                );
              }
              return (
                <a
                  key={link}
                  href={`#${link.toLowerCase().replace(" ", "-")}`}
                  className="block text-lg font-medium hover:text-teal-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link}
                </a>
              );
            })}
            {/* Mobile Profile Button */}
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <motion.button
                className="w-full bg-teal-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 5px 15px rgba(0, 150, 136, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                Profile
              </motion.button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
