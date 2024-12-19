import Link from 'next/link';
import React from 'react';

const Hero: React.FC = () => {
    return (
        <section className="relative text-white py-24 md:py-32">
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
            >
                <source src="/footage.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="relative bg-opacity-50">
                <div className="container mx-auto text-center px-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg">
                        Find the Right Tradesmen
                    </h1>
                    <p className="mt-4 text-xl md:text-2xl font-light">
                        Connecting you with trusted professionals for your home projects.
                    </p>
                    <Link
                        href="/services"
                        className="mt-8 inline-block bg-blue-700 text-white font-semibold py-2 md:py-3 px-4 md:px-6 rounded-lg shadow-lg hover:bg-blue-800 transition-colors duration-300"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Hero;
