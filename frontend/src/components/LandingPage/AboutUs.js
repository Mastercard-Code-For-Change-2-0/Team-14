import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import AnimatedStat from './AnimatedStat';

const AboutUs = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.3, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <section id="about-us" className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
                <motion.div 
                    ref={ref}
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: -20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl font-bold text-gray-800">Our Mission & Vision</h2>
                    <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
                        We are dedicated to creating lasting solutions to poverty, hunger, and social injustice through compassionate action and sustainable programs.
                    </p>
                </motion.div>
                <motion.div 
                    className="flex flex-col md:flex-row items-center gap-12"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                    <motion.div className="md:w-1/2" variants={itemVariants}>
                        <img src="https://placehold.co/600x400/81c784/ffffff?text=Our+Team" alt="Our Team" className="rounded-lg shadow-2xl w-full h-auto" />
                    </motion.div>
                    <motion.div className="md:w-1/2" variants={itemVariants}>
                        <h3 className="text-3xl font-semibold text-gray-700 mb-4">Who We Are</h3>
                        <p className="text-gray-600 leading-relaxed">
                            KindHeart is a global family of humanitarians, partners, and supporters, united by a common goal: to uplift the most vulnerable. Since our founding in 2010, we have worked tirelessly on the ground, delivering aid and fostering self-reliance. Our approach is holistic, addressing not just immediate needs but also the root causes of hardship.
                        </p>
                    </motion.div>
                </motion.div>
                <motion.div 
                    className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <AnimatedStat end={12000} suffix="+" label="Lives Touched" />
                    <AnimatedStat end={50} suffix="+" label="Projects Completed" />
                    <AnimatedStat end={15} suffix="+" label="Countries Served" />
                </motion.div>
            </div>
        </section>
    );
};

export default AboutUs;
