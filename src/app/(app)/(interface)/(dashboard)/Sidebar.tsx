"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation'
import {
    HomeIcon,
    UserIcon,
    ClipboardDocumentListIcon,
    Bars3Icon,
    BriefcaseIcon, // Hamburger icon for mobile
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { userStore } from "@/store/user";
import { ExtendedUser } from "@/types";
import logo from '@/images/png/logo-no-background.png'; // Adjust the path as necessary
import Image from "next/image";

const navItems = [
    { name: "Dashboard", icon: HomeIcon, href: "/dashboard" },
    { name: "Profile", icon: UserIcon, href: "/user-job-profile" },
    { name: "Create Job", icon: BriefcaseIcon, href: "/create-job" },
    { name: "User Job Profile", icon: ClipboardDocumentListIcon, href: "/upsert-user-job-profile" },
    { name: "My Jobs", icon: ClipboardDocumentListIcon, href: "/jobs" },
    { name: "Requests", icon: ClipboardDocumentListIcon, href: "/request" },
];

const Sidebar: React.FC<{ currentUser: ExtendedUser | null }> = ({ currentUser }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const currentRoute = usePathname();
    const { setCurrentUser } = userStore((state) => state)

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    useEffect(() => {
        setCurrentUser(currentUser);
    }, [currentUser, setCurrentUser]);


    return (
        <>
            {/* Sidebar for larger screens */}
            <aside className="hidden lg:flex w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex-col justify-between shadow-lg h-screen">
                <div className="p-6">
                    <div className="flex items-center justify-center h-16 mb-10">
                        <Image src={logo} alt="Logo" className="h-10 w-auto" width={100} height={100} />
                    </div>
                    <nav>
                        {navItems.map((item) => (
                            <Link key={item.name} href={item.href}>
                                <div
                                    className={`flex items-center p-3 mb-2 rounded-lg transition ${currentRoute === item.href
                                        ? "bg-indigo-600 text-white"
                                        : "text-gray-400 hover:bg-indigo-600 hover:text-white"
                                        }`}
                                >
                                    <item.icon className="h-6 w-6 mr-3" />
                                    <span className="text-base font-medium">{item.name}</span>
                                </div>
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="p-6 bg-gray-800">
                    <div className="flex items-center">
                        <Image
                            src={currentUser?.userProfile.profilePicture || 'null'}
                            alt="User Image"
                            className="h-10 w-10 rounded-full border-2 border-indigo-500 shadow-lg mr-4"
                            width={100} height={100}
                        />
                        <div>
                            <p className="text-sm font-semibold">{currentUser?.userProfile.firstName} {currentUser?.userProfile.lastName}</p>
                            <p className="text-xs text-gray-400">{currentUser?.email}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar Button */}
            <div className="lg:hidden fixed bottom-4 right-4 z-50">
                <button
                    onClick={toggleModal}
                    className="p-3 bg-indigo-600 text-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label="Open Sidebar"
                >
                    <Bars3Icon className="h-6 w-6" />
                </button>
            </div>

            {/* Sidebar Modal for Mobile */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center lg:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-gray-900 text-white w-full h-full rounded-none shadow-lg"
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-center h-16 mb-10">
                                    <Image src={logo} alt="Logo" className="h-10 w-auto" width={100} height={100} />
                                </div>
                                <nav>
                                    {navItems.map((item) => (
                                        <Link key={item.name} href={item.href}>
                                            <div
                                                className={`flex items-center p-3 mb-2 rounded-lg transition ${currentRoute === item.href
                                                    ? "bg-indigo-600 text-white"
                                                    : "text-gray-400 hover:bg-indigo-600 hover:text-white"
                                                    }`}
                                            >
                                                <item.icon className="h-6 w-6 mr-3" />
                                                <span className="text-base font-medium">{item.name}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </nav>
                            </div>
                            <div className="p-6 bg-gray-800">
                                <div className="flex items-center">
                                    <Image
                                        src={currentUser?.userProfile.profilePicture || 'null'}
                                        alt="User Image"
                                        className="h-10 w-10 rounded-full border-2 border-indigo-500 shadow-lg mr-4"
                                        width={100} height={100}
                                    />
                                    <div>
                                        <p className="text-sm font-semibold">{currentUser?.userProfile.firstName} {currentUser?.userProfile.lastName}</p>
                                        <p className="text-xs text-gray-400">{currentUser?.email}</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={toggleModal}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition focus:outline-none"
                                aria-label="Close Sidebar"
                            >
                                &times;
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
