import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Heart, Users, Handshake } from 'lucide-react';

const OurWork = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    const projects = [
        { title: 'Clean Water Initiative', description: 'Providing access to clean and safe drinking water for rural communities.', image: 'https://placehold.co/600x400/4dd0e1/ffffff?text=Water+Project', icon: <Heart size={32}/> },
        { title: 'Education for All', description: 'Building schools and providing educational resources for underprivileged children.', image: 'https://placehold.co/600x400/ba68c8/ffffff?text=Education', icon: <Users size={32}/> },
        { title: 'Community Health', description: 'Operating mobile clinics to offer essential healthcare services in remote areas.', image: 'https://placehold.co/600x400/ff8a65/ffffff?text=Healthcare', icon: <Handshake size={32}/> },
    ];

    const containerVariants = {
        hidden: { },
        visible: { transition: { staggerChildren: 0.2 } }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.9 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } }
    };

    return (
        <section id="our-work" className="py-20">
            <div className="container mx-auto px-6">
                <motion.div 
                    className="text-center mb-16"
                    ref={ref}
                    initial={{ opacity: 0, y: -20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl font-bold text-gray-800">Our Impactful Work</h2>
                    <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
                        Discover the projects that are changing lives and building brighter futures.
                    </p>
                </motion.div>
                <motion.div 
                    className="grid md:grid-cols-3 gap-10"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            className="bg-white rounded-lg shadow-lg overflow-hidden group"
                            variants={cardVariants}
                            whileHover={{ y: -10, boxShadow: "0px 20px 30px rgba(0,0,0,0.1)" }}
                        >
                            <div className="relative">
                                <img src={project.image} alt={project.title} className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                            </div>
                            <div className="p-6">
                                <div className="text-teal-500 mb-2">{project.icon}</div>
                                <h3 className="text-2xl font-semibold text-gray-800 mb-2">{project.title}</h3>
                                <p className="text-gray-600">{project.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default OurWork;
