import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-6 text-center">
        <div className="text-3xl font-bold mb-4">
          <span className="text-teal-500">Kind</span>Heart
        </div>
        <p className="max-w-md mx-auto mb-6">
          Join us in our mission to create a world where everyone has the opportunity to thrive.
        </p>
        <div className="flex justify-center space-x-6 mb-8">
          <motion.a href="#" whileHover={{ scale: 1.2, color: '#1DA1F2' }}><Twitter /></motion.a>
          <motion.a href="#" whileHover={{ scale: 1.2, color: '#1877F2' }}><Facebook /></motion.a>
          <motion.a href="#" whileHover={{ scale: 1.2, color: '#E4405F' }}><Instagram /></motion.a>
        </div>
        <div className="border-t border-gray-700 pt-6 text-gray-400">
          <p>&copy; {new Date().getFullYear()} KindHeart. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
