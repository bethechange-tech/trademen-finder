'use client';

import { useState, useEffect } from "react";
import { userStore } from "@/store/user";
import ApplicationCard from "./ApplicationCard";
import { ExtendedApplication } from "@/types";
import Image from "next/image";

export default function Client({ applications }: { applications: ExtendedApplication[] | null }) {
    const currentUser = userStore((state) => state.user)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulating a data fetch or some delay to demonstrate the loading state
        setTimeout(() => {
            setLoading(false); // Set loading to false once data is fetched
        }, 2000); // Simulate a 2-second loading period
    }, []);

    return (
        <div className="max-w-7xl mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white p-6 sm:p-8 rounded-lg shadow-xl mb-6 sm:mb-10 flex flex-col sm:flex-row items-center justify-between">
                <div className="text-center sm:text-left">
                    <h2 className="text-3xl sm:text-4xl font-extrabold">Welcome, {currentUser?.userProfile.firstName}!</h2>
                    <p className="text-md sm:text-lg mt-2">Here are your current job applications.</p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <Image
                        src={currentUser?.userProfile.profilePicture || 'null'}
                        alt="User Avatar"
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-md mx-auto"
                        width={100}
                        height={100}
                    />
                </div>
            </div>

            {/* Job Applications Section */}
            <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Job Applications</h3>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center py-6">
                        <div className="w-8 h-8 border-4 border-t-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        {/* Applications List */}
                        {applications?.length ? (
                            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                                {(applications)?.map((application) => (
                                    <ApplicationCard key={application.id} application={application} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-6">
                                <p>No applications found. Start applying today!</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
