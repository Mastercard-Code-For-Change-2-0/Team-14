import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Heart, Users, Handshake } from 'lucide-react';

const GetInvolved = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <section id="get-involved" className="py-20 bg-teal-500 text-white">
            <div className="container mx-auto px-6 text-center">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: -20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl font-bold">You Can Help!</h2>
                    <p className="text-lg mt-4 max-w-2xl mx-auto">
                        Every contribution, big or small, creates a ripple of positive change. Find out how you can be a part of our story.
                    </p>
                </motion.div>
                <motion.div 
                    className="mt-12 grid md:grid-cols-3 gap-8"
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={{ visible: { transition: { staggerChildren: 0.2 }}}}
                >
                    <motion.div className="bg-white text-gray-800 p-8 rounded-lg shadow-xl" variants={itemVariants}>
                        <Heart className="mx-auto text-teal-500 h-12 w-12 mb-4" />
                        <h3 className="text-2xl font-bold mb-2">Donate</h3>
                        <p className="mb-4">Your financial support helps us continue our life-changing work.</p>
                        <motion.button className="bg-gray-800 text-white px-6 py-2 rounded-full" whileHover={{ scale: 1.05, backgroundColor: '#000' }}>Give Today</motion.button>
                    </motion.div>
                    <motion.div className="bg-white text-gray-800 p-8 rounded-lg shadow-xl" variants={itemVariants}>
                        <Users className="mx-auto text-teal-500 h-12 w-12 mb-4" />
                        <h3 className="text-2xl font-bold mb-2">Volunteer</h3>
                        <p className="mb-4">Lend your time and skills to make a direct impact on the ground.</p>
                        <motion.button className="bg-gray-800 text-white px-6 py-2 rounded-full" whileHover={{ scale: 1.05, backgroundColor: '#000' }}>Join Us</motion.button>
                    </motion.div>
                    <motion.div className="bg-white text-gray-800 p-8 rounded-lg shadow-xl" variants={itemVariants}>
                        <Handshake className="mx-auto text-teal-500 h-12 w-12 mb-4" />
                        <h3 className="text-2xl font-bold mb-2">Partner</h3>
                        <p className="mb-4">Collaborate with us to create synergistic and sustainable change.</p>
                        <motion.button className="bg-gray-800 text-white px-6 py-2 rounded-full" whileHover={{ scale: 1.05, backgroundColor: '#000' }}>Become a Partner</motion.button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default GetInvolved;
