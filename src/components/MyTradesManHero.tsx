"use client";

import React from 'react';
import { motion } from 'framer-motion';

const MyTradesmenHero: React.FC = () => {
    return (
        <section className="bg-gradient-to-r from-blue-100 via-white to-blue-100 p-8 rounded-lg shadow-lg mb-8 transition-all duration-300 hover:shadow-2xl hover:scale-105">
            <div className="text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="mb-4"
                >
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-blue-900 drop-shadow-lg">
                        Welcome to MyTradesmen
                    </h1>
                    <p className="mt-4 text-sm sm:text-base md:text-lg text-gray-800 leading-relaxed max-w-2xl mx-auto">
                        Connecting you with skilled tradesmen for all your home and business needs.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default MyTradesmenHero;
