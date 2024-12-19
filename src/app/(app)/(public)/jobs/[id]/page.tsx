"use client"
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Page = () => {
    const router = useRouter(); // Next.js router hook

    const [isEditing, setIsEditing] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [jobDetails, setJobDetails] = useState({
        id: 1,
        title: "Fix Leaky Faucet",
        description:
            "A plumber is needed to fix a leaky faucet in the kitchen. The job requires quick and efficient service to address water leakage issues.",
        location: "London, UK",
        budget: 150,
        type: "Plumbing",
        posted: "December 10, 2024",
        status: "Open",
    });

    const [applicants] = useState([
        {
            id: 1,
            name: "John Doe",
            appliedDate: "December 15, 2024",
            status: "Pending",
        },
        {
            id: 2,
            name: "Jane Smith",
            appliedDate: "December 16, 2024",
            status: "Shortlisted",
        },
        {
            id: 3,
            name: "Sam Wilson",
            appliedDate: "December 17, 2024",
            status: "Rejected",
        },
    ]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        console.log("Job details saved:", jobDetails);
        setIsEditing(!isEditing);
    };

    const handleDelete = () => {
        console.log("Job deleted:", jobDetails.id);
        setShowDeletePopup(false);
        // Add logic to delete job
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 p-6 flex flex-col items-center">
            <div className="w-full max-w-5xl flex items-center mb-4">
                <button
                    onClick={() => router.back()} // Navigates to the previous page
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition font-medium flex items-center space-x-2"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    <span>Back</span>
                </button>
            </div>


            {/* Job Card */}
            <div className="bg-white w-full max-w-5xl rounded-xl shadow-lg p-8 space-y-10">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="space-y-2">
                        {!isEditing ? (
                            <>
                                <h1 className="text-4xl font-bold text-gray-800">{jobDetails.title}</h1>
                                <p className="text-sm text-blue-600 font-medium">Job ID: #{jobDetails.id}</p>
                                <p className="text-gray-700 leading-relaxed">{jobDetails.description}</p>
                            </>
                        ) : (
                            <>
                                <input
                                    type="text"
                                    value={jobDetails.title}
                                    onChange={(e) =>
                                        setJobDetails((prev) => ({
                                            ...prev,
                                            title: e.target.value,
                                        }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-xl font-bold text-gray-800 mb-2"
                                />
                                <textarea
                                    value={jobDetails.description}
                                    onChange={(e) =>
                                        setJobDetails((prev) => ({
                                            ...prev,
                                            description: e.target.value,
                                        }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                    rows={4}
                                />
                            </>
                        )}
                    </div>
                    <div className="flex flex-col items-end space-y-3 mt-6 sm:mt-0">
                        <span
                            className={`px-4 py-2 rounded-full text-sm font-semibold ${jobDetails.status === "Open"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                                }`}
                        >
                            {jobDetails.status}
                        </span>
                        <div className="flex space-x-2">
                            <button
                                onClick={handleEdit}
                                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => setShowDeletePopup(true)}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>

                {/* Job Details Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-4">
                        <svg
                            className="w-6 h-6 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 7.25 7 13 7 13s7-5.75 7-13c0-3.87-3.13-7-7-7z" />
                        </svg>
                        <p className="text-gray-700">
                            <span className="font-semibold">Location:</span> {jobDetails.location}
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <svg
                            className="w-6 h-6 text-blue-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M10 15a1 1 0 001-1V7h2a1 1 0 000-2h-3a1 1 0 00-1 1v8a1 1 0 001 1z" />
                        </svg>
                        <p className="text-gray-700">
                            <span className="font-semibold">Budget:</span> £{jobDetails.budget}
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <svg
                            className="w-6 h-6 text-blue-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M4 3a1 1 0 00-1 1v1h14V4a1 1 0 00-1-1H4zm15 4H1v9a2 2 0 002 2h14a2 2 0 002-2V7z" />
                        </svg>
                        <p className="text-gray-700">
                            <span className="font-semibold">Type:</span> {jobDetails.type}
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <svg
                            className="w-6 h-6 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path d="M8 7V3m8 4V3m-6 12h4m-4-4h4M4 21h16a2 2 0 002-2V7H2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-700">
                            <span className="font-semibold">Posted:</span> {jobDetails.posted}
                        </p>
                    </div>
                </div>

                {/* Applicants Section */}
                <div className="bg-white w-full max-w-5xl rounded-xl shadow-lg p-6 sm:p-8 mt-10">
                    <h2 className="text-2xl font-extrabold text-gray-800 mb-6">Applicants</h2>
                    {applicants.length > 0 ? (
                        <div className="space-y-4">
                            {applicants.map((applicant) => (
                                <div
                                    key={applicant.id}
                                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0 border-b pb-4 hover:bg-gray-50 transition duration-200 rounded-lg px-4"
                                >
                                    {/* Applicant Details */}
                                    <div className="flex flex-col sm:items-start space-y-1">
                                        <h3 className="text-lg font-bold text-gray-900">{applicant.name}</h3>
                                        <p className="text-sm text-gray-600">
                                            Applied on:{" "}
                                            <span className="font-medium text-gray-800">{applicant.appliedDate}</span>
                                        </p>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="flex justify-center sm:justify-end">
                                        <span
                                            className={`px-4 py-1 rounded-full text-sm font-semibold tracking-wide ${applicant.status === "Pending"
                                                ? "bg-yellow-200 text-yellow-800"
                                                : applicant.status === "Shortlisted"
                                                    ? "bg-green-200 text-green-800"
                                                    : "bg-red-200 text-red-800"
                                                }`}
                                        >
                                            {applicant.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-16 w-16 text-gray-300 mb-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 14l9-5-9-5-9 5 9 5z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 14l6.16-3.422a12.083 12.083 0 01-12.32 0L12 14z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 14v8"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 14L3 9l9-5 9 5-9 5z"
                                />
                            </svg>
                            <p className="text-gray-500 text-lg font-medium">No applicants yet</p>
                            <p className="text-gray-400 text-sm mt-2">
                                Check back later to see who applies for this job.
                            </p>
                        </div>
                    )}
                </div>

                {/* Save Button */}
                {isEditing && (
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={handleSave}
                            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
                        >
                            Save Changes
                        </button>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Popup */}
            {
                showDeletePopup && (
                    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 px-4">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Are you sure?</h2>
                            <p className="text-gray-600 mb-6">
                                Do you really want to delete this job? This action cannot be undone.
                            </p>
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                                <button
                                    onClick={() => setShowDeletePopup(false)}
                                    className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition w-full sm:w-auto"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition w-full sm:w-auto"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default Page;
