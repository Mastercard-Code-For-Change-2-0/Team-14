import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const testimonialsData = [
    { quote: "This organization changed my life. I now have access to clean water and a brighter future for my children.", author: "Maria S.", title: "Beneficiary" },
    { quote: "Volunteering with KindHeart was the most rewarding experience. Seeing the direct impact of our work is incredible.", author: "John D.", title: "Volunteer" },
    { quote: "As a corporate partner, we are proud to support an NGO that is so transparent and effective in its mission.", author: "Jane L.", title: "CEO, Tech Corp" }
];

const Testimonials = () => {
    const [index, setIndex] = useState(0);
    const ref = useRef(null);

    const nextTestimonial = () => {
        setIndex((prev) => (prev + 1) % testimonialsData.length);
    };

    const prevTestimonial = () => {
        setIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
    };
    
    useEffect(() => {
        const interval = setInterval(nextTestimonial, 5000); // Auto-play every 5 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <section id="testimonials" className="py-20 bg-gray-50">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold text-gray-800 mb-12">Voices of Our Community</h2>
                <div className="relative max-w-3xl mx-auto h-64">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={index}
                            className="absolute inset-0 flex flex-col items-center justify-center"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5 }}
                        >
                            <p className="text-xl italic text-gray-600 mb-6">"{testimonialsData[index].quote}"</p>
                            <p className="font-bold text-gray-800">{testimonialsData[index].author}</p>
                            <p className="text-teal-500">{testimonialsData[index].title}</p>
                        </motion.div>
                    </AnimatePresence>
                    <button onClick={prevTestimonial} className="absolute left-[-50px] top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
                        <ChevronLeft />
                    </button>
                    <button onClick={nextTestimonial} className="absolute right-[-50px] top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
                        <ChevronRight />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
