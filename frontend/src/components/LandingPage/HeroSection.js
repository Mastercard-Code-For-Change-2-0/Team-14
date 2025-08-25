import React, { useState, useEffect } from "react";

// ✅ Import images from src/assets
import bg1 from "../../assets/bg1.jpg";
import bg2 from "../../assets/bg2.jpg";
import bg3 from "../../assets/bg3.jpg";
import bg4 from "../../assets/bg4.jpg";
import bg5 from "../../assets/bg5.jpg";

export default function HeroSection() {
  const backgroundImages = [bg1, bg2, bg3, bg4, bg5];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % backgroundImages.length
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  const taglineAnimation = `
    @keyframes fadeInSlide {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeInSlide {
      animation: fadeInSlide 1.5s ease-in-out;
    }
  `;

  return (
    <>
      <style>{taglineAnimation}</style>
      <section
        id="home"
        className="relative h-screen flex items-center justify-center text-white overflow-hidden"
      >
        {/* Rotating background images with fade */}
        {backgroundImages.map((url, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${url})` }}
          />
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 z-10"></div>

        {/* Content */}
        <div className="relative text-center z-20 animate-fadeInSlide p-4">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg">
            Together, We Can Make a Difference
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 drop-shadow-md">
            Join our mission to bring hope and change to communities in need.
            Your support empowers us to create a better world, one act of
            kindness at a time.
          </p>
          <button className="bg-teal-500 text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:scale-105 active:scale-95 hover:bg-teal-600 transition-all duration-300">
            Join Our Mission
          </button>
        </div>
      </section>
    </>
  );
}
