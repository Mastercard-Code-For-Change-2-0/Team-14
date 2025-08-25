import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactForm = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    const formVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <section id="contact" className="py-20">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-800">Get In Touch</h2>
                    <p className="text-lg text-gray-600 mt-4">We'd love to hear from you. Send us a message or find us at our locations.</p>
                </div>
                <motion.div 
                    className="flex flex-col md:flex-row gap-12"
                    ref={ref}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={{ visible: { transition: { staggerChildren: 0.3 }}}}
                >
                    <motion.div className="md:w-1/2 bg-gray-50 p-8 rounded-lg" variants={formVariants}>
                        <form>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name</label>
                                <input type="text" id="name" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
                                <input type="email" id="email" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="message" className="block text-gray-700 font-bold mb-2">Message</label>
                                <textarea id="message" rows="5" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"></textarea>
                            </div>
                            <motion.button 
                                type="submit" 
                                className="w-full bg-teal-500 text-white font-bold py-3 px-4 rounded-lg"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Send Message
                            </motion.button>
                        </form>
                    </motion.div>
                    <motion.div className="md:w-1/2" variants={formVariants}>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Contact Information</h3>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <MapPin className="text-teal-500 mr-4" />
                                <span className="text-gray-600">123 Charity Lane, Hope City, 12345</span>
                            </div>
                            <div className="flex items-center">
                                <Phone className="text-teal-500 mr-4" />
                                <span className="text-gray-600">(123) 456-7890</span>
                            </div>
                            <div className="flex items-center">
                                <Mail className="text-teal-500 mr-4" />
                                <span className="text-gray-600">contact@kindheart.org</span>
                            </div>
                        </div>
                        <div className="mt-8">
                            <h4 className="font-bold mb-2">Office Hours</h4>
                            <p className="text-gray-600">Monday - Friday: 9am - 5pm</p>
                            <p className="text-gray-600">Saturday - Sunday: Closed</p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default ContactForm;
