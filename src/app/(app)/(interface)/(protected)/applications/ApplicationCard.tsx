'use client';

import getStripe from "@/lib/get-stripe";
import { ExtendedApplication } from "@/types";
import { payForApplication } from "@/utils/actions/applications";
import delay from "delay";
import { useState, useEffect, useRef } from "react";

export default function JobCard({ application }: { application: ExtendedApplication | null }) {
    const [menuVisible, setMenuVisible] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { job, status } = application || {};

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    // Close the menu when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuVisible(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const redirectToCheckout = async () => {
        try {
            // Show loading and modal
            setIsLoading(true);
            setIsModalOpen(true);

            if (application?.isPaid) {
                // Simulate processing time and auto-close modal after 3 seconds
                setTimeout(() => {
                    setIsLoading(false); // Stop loading
                    setIsModalOpen(false); // Close modal
                }, 3000); // 3 seconds
                return
            }

            if (!job) return;

            const { sessionId } = await payForApplication(job)

            const stripe = await getStripe();

            // Simulate processing time and auto-close modal after 3 seconds
            setTimeout(() => {
                setIsLoading(false); // Stop loading
                setIsModalOpen(false); // Close modal
            }, 3000); // 3 seconds
            await stripe?.redirectToCheckout({ sessionId })
        } catch (error: any) {
            await delay(1000)
        }
    }


    return (
        <div onClick={redirectToCheckout} className="relative border-2 border-gray-300 bg-white p-4 sm:p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-500 ease-in-out transform hover:-translate-y-1 cursor-pointer h-64 sm:h-72 max-w-full sm:max-w-md md:max-w-lg lg:max-w-full w-full">

            {/* Three-dot menu toggle */}
            <div className="absolute top-4 right-4">
                <button
                    onClick={() => setMenuVisible(!menuVisible)}
                    className="relative bg-gray-100 p-2 rounded-full shadow-md hover:bg-gray-200 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label="Options Menu"
                >
                    <svg
                        className="w-6 h-6 text-gray-500 hover:text-indigo-600 transition-all"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6h.01M12 12h.01M12 18h.01"
                        ></path>
                    </svg>
                </button>

                {menuVisible && (
                    <div
                        ref={menuRef}
                        className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg py-2 z-10 transition-opacity duration-300 ease-in-out"
                    >
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Apply
                        </a>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Save
                        </a>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Share
                        </a>
                    </div>
                )}
            </div>

            {/* Job Information */}
            <div className="flex flex-col justify-between h-full">
                <div className="space-y-2 sm:space-y-3">
                    {/* Job Title with text truncation and word breaking */}
                    <h4 className="text-xl sm:text-2xl font-bold text-indigo-700 leading-tight hover:text-purple-600 transition-colors duration-300 break-words text-ellipsis overflow-hidden">
                        {job?.title}
                    </h4>

                    {/* Job Description */}
                    <p className="text-sm sm:text-base font-medium text-gray-700 leading-relaxed text-ellipsis overflow-hidden">
                        {job?.description ? (
                            job.description.length > 100 ? (
                                <>
                                    {job.description.slice(0, 100)}...
                                    <span className="text-indigo-500 hover:text-indigo-600 cursor-pointer">
                                        Read more
                                    </span>
                                </>
                            ) : (
                                job.description
                            )
                        ) : (
                            "No description available"
                        )}
                    </p>


                    {/* Salary & Tags */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm font-medium">
                        <span className="text-gray-800 bg-gray-100 px-3 py-1 rounded-md shadow-sm">
                            £{job?.price}
                        </span>
                        <span className="bg-green-200 text-green-800 px-3 py-1 rounded-md shadow-sm">
                            {job?.category.name}
                        </span>
                        <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-md shadow-sm">
                            {job?.city}
                        </span>
                        {/* Paid Badge */}
                        {application?.isPaid && (
                            <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-md shadow-sm">
                                Paid
                            </span>
                        )}
                    </div>

                    {/* Years of Experience */}
                    <p className="text-xs sm:text-sm text-gray-500">
                        {job?.years} years of experience required
                    </p>
                </div>

                {/* Status & Date */}
                <div className="flex justify-between items-center mt-2 sm:mt-4">
                    <span
                        className={`text-xs sm:text-sm font-semibold px-3 py-1 rounded-full ${status === "Open"
                            ? "text-green-600 bg-green-100"
                            : status === "Closed"
                                ? "text-red-600 bg-red-100"
                                : "text-yellow-600 bg-yellow-100"
                            }`}
                    >
                        {status}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-400">
                        {new Date(job?.startDate || '').toLocaleDateString()}
                    </span>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96 flex flex-col items-center">
                        {isLoading ? (
                            <div className="flex flex-col items-center">
                                {/* Loading Spinner */}
                                <svg
                                    className="animate-spin h-8 w-8 text-indigo-600 mb-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"
                                    ></path>
                                </svg>
                                <p className="text-gray-600">Processing Payment...</p>
                            </div>
                        ) : application?.isPaid ? (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-md">
                                <h2 className="text-lg font-semibold text-green-800 mb-2">
                                    Payment Successful
                                </h2>
                                <p className="text-sm text-green-700">
                                    Thank you! Your payment has been processed successfully.
                                </p>
                            </div>
                        ) : (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-md">
                                <h2 className="text-lg font-semibold text-red-800 mb-2">
                                    Payment Pending
                                </h2>
                                <p className="text-sm text-red-700">
                                    Your payment is yet to be processed. Please complete the payment to proceed.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
