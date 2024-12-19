import React from 'react';
import Image from 'next/image';
import { FaCheckCircle } from 'react-icons/fa';

const About: React.FC = () => {
    return (
        <section
            className="bg-gradient-to-r from-white via-gray-50 to-gray-100 py-16"
            aria-labelledby="about-heading"
        >
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-6">
                <div className="relative group">
                    <Image
                        src="/plumber.jpeg" // Replace with your image path
                        alt="Plumber working"
                        width={500}
                        height={500}
                        className="rounded-lg shadow-xl transform transition-transform duration-300 group-hover:animate-shake"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-600 opacity-30 rounded-lg"></div>
                </div>
                <div className="flex flex-col justify-center">
                    <h2 id="about-heading" className="text-4xl font-extrabold text-gray-900 mb-6 leading-tight animate-fadeIn">
                        About Our Company
                    </h2>
                    <p className="text-lg text-gray-700 mb-8 leading-relaxed animate-fadeIn">
                        With years of experience in the plumbing industry, we are dedicated to
                        providing top-notch services with a focus on customer satisfaction. Our
                        team of certified professionals is equipped with the latest tools and
                        techniques to solve your plumbing issues quickly and efficiently.
                    </p>
                    <div className="space-y-4 mb-8">
                        <FeatureItem text="Certified and experienced professionals" />
                        <FeatureItem text="24/7 emergency services available" />
                        <FeatureItem text="Affordable pricing with no hidden fees" />
                    </div>
                    <a
                        href="#"
                        className="mt-8 inline-block bg-blue-600 text-white font-semibold text-lg py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 animate-fadeIn"
                        aria-label="Learn more about our company"
                    >
                        Learn More
                    </a>
                </div>
            </div>
        </section>
    );
};

const FeatureItem: React.FC<{ text: string }> = ({ text }) => {
    return (
        <div className="flex items-start animate-fadeIn">
            <FaCheckCircle className="text-blue-600 text-2xl mr-4" />
            <p className="text-lg text-gray-800 font-medium">{text}</p>
        </div>
    );
};

export default About;
