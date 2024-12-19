"use client";

import { categoriesData } from '@/data/categories';
import Link from 'next/link';
import React, { useRef } from 'react';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

const Categories: React.FC = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: -window.innerWidth / 2, // Adjust the scroll distance based on screen size
                behavior: 'smooth',
            });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: window.innerWidth / 2, // Adjust the scroll distance based on screen size
                behavior: 'smooth',
            });
        }
    };

    return (
        <section className="py-16 bg-gradient-to-r from-blue-50 to-gray-100">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-800">Explore Categories</h2>
                    <Link href={'/services'}>
                        <button className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition duration-300">
                            View All
                        </button>
                    </Link>
                </div>

                <div className="relative">
                    <div ref={scrollContainerRef} className="flex overflow-x-auto space-x-4 scrollbar-hide snap-x snap-mandatory">
                        {categoriesData.map((category) => (
                            <CategoryCard
                                key={category.id}
                                title={category.title}
                                description={category.description}
                                imageUrl={category.imageUrl}
                            />
                        ))}
                    </div>

                    {/* Scroll Buttons */}
                    <div className="absolute inset-y-0 left-0 flex items-center">
                        <button
                            onClick={scrollLeft}
                            className="bg-white text-gray-800 p-3 rounded-full shadow-lg hover:bg-gray-100 transition duration-300 transform hover:scale-110"
                        >
                            <AiOutlineLeft size={24} />
                        </button>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center">
                        <button
                            onClick={scrollRight}
                            className="bg-white text-gray-800 p-3 rounded-full shadow-lg hover:bg-gray-100 transition duration-300 transform hover:scale-110"
                        >
                            <AiOutlineRight size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

const CategoryCard: React.FC<{ title: string; description: string; imageUrl: string }> = ({ title, description, imageUrl }) => {
    return (
        <Link href={`/services?catergory=${title}`} className="relative flex-none w-60 sm:w-72 h-80 sm:h-96 bg-cover bg-center rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer snap-center" style={{ backgroundImage: `url(${imageUrl})` }}>
            <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg"></div>
            <div className="absolute bottom-6 left-6 text-white z-10">
                <h3 className="text-xl sm:text-2xl font-bold mb-2">{title}</h3>
                <p className="text-sm opacity-90">{description}</p>
            </div>
            <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black via-transparent to-transparent opacity-0 hover:opacity-50 transition-opacity duration-300"></div>
        </Link>
    );
};

export default Categories;
