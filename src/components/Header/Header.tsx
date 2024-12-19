'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaBars, FaTimes, FaHome, FaToolbox, FaInfoCircle, FaPhoneAlt, FaClipboardList } from 'react-icons/fa';
import logo from '@/images/png/logo-no-background.png'; // Adjust the path as necessary
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { userStore } from '@/store/user';
import { ExtendedUser } from '@/types';

// Navigation links data
const navLinks = [
    { href: '/', label: 'Home', icon: FaHome },
    { href: '/services', label: 'Services', icon: FaToolbox },
    { href: '/about', label: 'About', icon: FaInfoCircle },
    { href: '/contact', label: 'Contact', icon: FaPhoneAlt },
];

const Header: React.FC<{ currentUser: ExtendedUser | null }> = ({ currentUser }) => {
    const setCurrentUser = userStore((state) => state.setCurrentUser);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const currentRoute = usePathname();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    useEffect(() => {
        setCurrentUser(currentUser);
    }, [currentUser]);

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
                {/* Logo */}
                <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        repeatType: 'loop',
                        ease: 'easeInOut',
                    }}
                    className="flex items-center space-x-2"
                >
                    <Link href="/" className="text-3xl font-extrabold text-purple-600 relative flex items-center space-x-2">
                        <Image src={logo} alt="Stashpot Logo" width={90} height={90} className="object-contain" />
                        <span className="absolute -bottom-2 left-0 right-0 h-1 bg-purple-600 rounded-lg blur-md opacity-75"></span>
                    </Link>
                </motion.div>

                {/* Navigation for Desktop */}
                <nav className="hidden md:flex space-x-8 text-lg font-semibold text-gray-700">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center ${currentRoute === link.href ? 'text-indigo-500' : 'hover:text-blue-600'} transition duration-300`}
                        >
                            <link.icon className="mr-2" /> {link.label}
                        </Link>
                    ))}

                    {currentUser && (
                        <Link href="/applications" className={`flex items-center ${currentRoute === '/applications' ? 'text-indigo-500' : 'hover:text-blue-600'} transition duration-300`}>
                            <FaClipboardList className="mr-2" /> Applications
                        </Link>
                    )}
                </nav>

                {/* Desktop Login/Signup or Dashboard */}
                <div className="hidden md:flex items-center space-x-6">
                    {currentUser ? (
                        <Link
                            href="/dashboard"
                            className={`bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-5 py-2 rounded-full hover:from-purple-600 hover:to-indigo-600 transition duration-300 shadow ${currentRoute === '/dashboard' ? 'border border-indigo-500' : ''}`}
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className={`bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-5 py-2 rounded-full hover:from-purple-600 hover:to-indigo-600 transition duration-300 shadow ${currentRoute === '/signup' ? 'border border-indigo-500' : ''}`}
                            >
                                Login
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button onClick={toggleMenu} aria-label="Toggle menu" className="md:hidden text-gray-600 hover:text-blue-600 focus:outline-none">
                    <FaBars size={24} />
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
                    {/* Close Button */}
                    <button onClick={closeMenu} aria-label="Close menu" className="absolute top-6 right-6 text-white text-3xl hover:text-blue-500 focus:outline-none">
                        <FaTimes />
                    </button>

                    {/* Centered Navigation Links */}
                    <div className="text-center">
                        <nav className="flex flex-col space-y-6 text-white text-2xl font-bold">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`hover:text-blue-500 transition duration-300 ${currentRoute === link.href ? 'text-indigo-500' : ''}`}
                                    onClick={closeMenu}
                                >
                                    <link.icon className="inline mr-2" /> {link.label}
                                </Link>
                            ))}

                            {currentUser && (
                                <Link
                                    href="/applications"
                                    className={`hover:text-blue-500 transition duration-300 ${currentRoute === '/applications' ? 'text-indigo-500' : ''}`}
                                    onClick={closeMenu}
                                >
                                    <FaClipboardList className="inline mr-2" /> Applications
                                </Link>
                            )}

                            {currentUser ? (
                                <Link
                                    href="/dashboard"
                                    className={`bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-2 rounded-full hover:from-purple-600 hover:to-indigo-600 transition duration-300 shadow ${currentRoute === '/dashboard' ? 'border border-indigo-500' : ''}`}
                                    onClick={closeMenu}
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className={`bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-2 rounded-full hover:from-purple-600 hover:to-indigo-600 transition duration-300 shadow ${currentRoute === '/signup' ? 'border border-indigo-500' : ''}`}
                                        onClick={closeMenu}
                                    >
                                        Login
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
