import React from 'react';
import { FaTools, FaSearchLocation, FaWater, FaToilet, FaShower, FaBolt } from 'react-icons/fa';

const Services: React.FC = () => {
    return (
        <section className="py-16 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="container mx-auto text-center px-6">
                <h2 className="text-4xl font-extrabold text-gray-900 mb-8 drop-shadow-lg">Our Services & Solutions</h2>
                <p className="text-lg text-gray-700 mb-12 max-w-3xl mx-auto">
                    We offer a comprehensive range of plumbing services designed to meet all your needs. From emergency repairs to regular maintenance, our team of certified professionals is ready to provide exceptional service.
                </p>
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <ServiceCard
                        icon={<FaSearchLocation size={32} />}
                        title="Leak Detection"
                        description="Quickly locate and repair leaks to prevent further damage, saving you time and money."
                        learnMoreLink="#"
                    />
                    <ServiceCard
                        icon={<FaTools size={32} />}
                        title="Pipe Repair"
                        description="Efficient pipe repair services to fix any plumbing issues you may have, ensuring your system is always in top condition."
                        learnMoreLink="#"
                    />
                    <ServiceCard
                        icon={<FaWater size={32} />}
                        title="Drain Cleaning"
                        description="Keep your drains clean and free-flowing with our professional drain cleaning services, preventing clogs and backups."
                        learnMoreLink="#"
                    />
                    <ServiceCard
                        icon={<FaToilet size={32} />}
                        title="Toilet Installation"
                        description="Expert installation of new toilets, ensuring proper fit and function for your home or business."
                        learnMoreLink="#"
                    />
                    <ServiceCard
                        icon={<FaShower size={32} />}
                        title="Shower Repair"
                        description="Comprehensive shower repair services to fix leaks, clogs, and other issues, restoring your shower to peak performance."
                        learnMoreLink="#"
                    />
                    <ServiceCard
                        icon={<FaBolt size={32} />}
                        title="Emergency Services"
                        description="24/7 emergency plumbing services to address urgent issues quickly and efficiently, minimizing downtime and damage."
                        learnMoreLink="#"
                    />
                </div>
            </div>
        </section>
    );
};

const ServiceCard: React.FC<{ icon: any; title: string; description: string; learnMoreLink: string }> = ({ icon, title, description, learnMoreLink }) => {
    return (
        <div className="relative bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden transform hover:-translate-y-2 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-600 to-blue-800 opacity-0 hover:opacity-75 transition-opacity duration-300 rounded-xl"></div>
            <div className="relative z-10">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full mx-auto mb-6 shadow-lg">
                    {icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
                <p className="text-gray-700 mb-6">{description}</p>
                <a href={learnMoreLink} className="text-blue-600 font-bold hover:text-blue-800 transition-colors duration-300">
                    Learn More <i className="fas fa-arrow-right ml-2"></i>
                </a>
            </div>
        </div>
    );
};

export default Services;
