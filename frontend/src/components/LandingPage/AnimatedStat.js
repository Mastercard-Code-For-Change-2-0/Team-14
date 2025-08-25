import React, { useRef, useState, useEffect } from "react";
import { useInView, motion, useMotionValue, useTransform, animate } from "framer-motion";

// Helper component for animated statistics
const AnimatedStat = ({ end, suffix, label }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  // --- Counter logic inside this file ---
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (isInView) {
      const unsubscribe = rounded.on("change", (latest) => {
        setDisplay(latest);
      });

      const controls = animate(count, end, { duration: 3 });

      return () => {
        unsubscribe();
        controls.stop();
      };
    }
  }, [isInView, end]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl md:text-6xl font-bold text-teal-500">
        {display}
        {suffix}
      </p>
      <p className="text-sm md:text-lg text-gray-600 mt-2">{label}</p>
    </div>
  );
};

export default AnimatedStat;
