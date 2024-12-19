"use client";
import { userStore } from "@/store/user";
import { ExtendedApplication, ExtendedJob } from "@/types";
import { $Enums } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Applicants from "./applicants";
import { formatDate } from "@/helpers/date";
import { createApplication } from "@/utils/actions/applications";

// OPTIONAL (for demonstration):
// A simple toast component. You could replace this with react-hot-toast or a similar library.
const Toast = ({ message, onClose }: { message: string; onClose: () => void }) => {
    return (
        <div className="fixed bottom-6 right-6 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg animate-fade-in-down">
            <div className="flex items-center space-x-3">
                <span>{message}</span>
                <button
                    onClick={onClose}
                    className="text-xs text-gray-200 hover:text-white"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

const Page: React.FC<{ job: ExtendedJob | null }> = ({ job }) => {
    const router = useRouter();
    const currentUser = userStore((state) => state.user);

    const isLoggedIn = !!currentUser; // or check your auth logic

    // Job details, including an ownerId that indicates who created the job
    const [jobDetails, setJobDetails] = useState<Partial<ExtendedJob> | null>();
    const [applications, setApplicants] = useState<Partial<ExtendedApplication>[]>();

    // Current user can only edit if logged in AND is the job owner
    const canEdit = isLoggedIn && currentUser.id === jobDetails?.userId;

    // Current user can only apply if logged in AND is NOT the job owner
    const canApply = isLoggedIn && currentUser.id !== jobDetails?.userId;

    useEffect(() => {
        const { applications, ...jobDetails } = job || {}
        setJobDetails(jobDetails)
        setApplicants(applications)
    }, [])


    const [isEditing, setIsEditing] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);


    // Simple toast logic
    const [toastMessage, setToastMessage] = useState("");

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage("");
        }, 3000);
    };

    const handleEdit = () => {
        if (!canEdit) return; // Guard: Don’t let non-owners edit
        setIsEditing(!isEditing);
    };

    const handleSave = () => {
        if (!canEdit) return;
        console.log("Job details saved:", jobDetails);
        setIsEditing(false);
        showToast("Changes saved!");
    };
    // Example: handle shortlisting an applicant
    const handleShortlist = (applicantId?: number) => {
        if (!canEdit) return;
        setApplicants((prev) =>
            prev?.map((applicant) =>
                applicant?.id === applicantId
                    ? { ...applicant, status: "Shortlisted" }
                    : applicant
            )
        );
        showToast(`Applicant #${applicantId} has been shortlisted!`);
    };

    const handleDelete = () => {
        if (!canEdit) return;
        console.log("Job deleted:", jobDetails.id);
        setShowDeletePopup(false);
        showToast("Job deleted!");
    };

    const handleApply = async () => {
        if (!canApply) return;
        console.log(`User ${currentUser.id} applied for job ${jobDetails?.id}`);

        try {
            await createApplication({
                jobId: jobDetails!.id,
                status: 'Pending'
            })

            router.refresh()
            showToast("You have applied for the job!");
        } catch (error: any) {
            showToast(error?.response?.data?.message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 p-6 flex flex-col items-center">
            {/* Back Button */}
            <div className="w-full max-w-5xl flex items-center mb-4">
                <button
                    onClick={() => router.back()}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition font-medium flex items-center space-x-2 shadow-sm hover:shadow-md"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Back</span>
                </button>
            </div>

            {/* Job Card */}
            <div className="bg-white w-full max-w-5xl rounded-xl shadow-lg p-8 space-y-10 transition-shadow hover:shadow-xl">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="space-y-2">
                        {!isEditing ? (
                            <>
                                <h1 className="text-4xl font-bold text-gray-800">{jobDetails?.title}</h1>
                                <p className="text-sm text-blue-600 font-medium">Job ID: #{jobDetails?.id}</p>
                                <p className="text-gray-700 leading-relaxed">{jobDetails?.description}</p>
                            </>
                        ) : canEdit ? (
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
                                    autoFocus
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-xl font-bold text-gray-800 mb-2 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                                />
                                <textarea
                                    value={jobDetails.description}
                                    onChange={(e) =>
                                        setJobDetails((prev) => ({
                                            ...prev,
                                            description: e.target.value,
                                        }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                                    rows={4}
                                />
                            </>
                        ) : null}
                    </div>
                    <div className="flex flex-col items-end space-y-3 mt-6 sm:mt-0">
                        <span
                            className={`px-4 py-2 rounded-full text-sm font-semibold ${jobDetails?.status && jobDetails.status === $Enums.JobStatus.OPEN
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                                }`}
                        >
                            {jobDetails?.status}
                        </span>

                        {/* For owners: Show Edit and Delete buttons. */}
                        {canEdit && (
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleEdit}
                                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition shadow-sm hover:shadow-md"
                                >
                                    {isEditing ? "Cancel" : "Edit"}
                                </button>
                                <button
                                    onClick={() => setShowDeletePopup(true)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition shadow-sm hover:shadow-md"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Job Details Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Location */}
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
                        {!isEditing ? (
                            <p className="text-gray-700">
                                <span className="font-semibold">Location:</span> {jobDetails?.city}
                            </p>
                        ) : canEdit ? (
                            <input
                                type="text"
                                value={jobDetails?.city}
                                onChange={(e) =>
                                    setJobDetails((prev) => ({ ...prev, location: e.target.value }))
                                }
                                className="w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                            />
                        ) : null}
                    </div>

                    {/* Budget */}
                    <div className="flex items-center space-x-4">
                        <svg
                            className="w-6 h-6 text-blue-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M10 15a1 1 0 001-1V7h2a1 1 0 000-2h-3a1 1 0 00-1 1v8a1 1 0 001 1z" />
                        </svg>
                        {!isEditing ? (
                            <p className="text-gray-700">
                                <span className="font-semibold">Budget:</span> £{jobDetails?.price}
                            </p>
                        ) : canEdit ? (
                            <input
                                type="number"
                                value={jobDetails?.price}
                                onChange={(e) =>
                                    setJobDetails((prev) => ({ ...prev, budget: Number(e.target.value) }))
                                }
                                className="w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                            />
                        ) : null}
                    </div>

                    {/* Type */}
                    <div className="flex items-center space-x-4">
                        <svg
                            className="w-6 h-6 text-blue-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M4 3a1 1 0 00-1 1v1h14V4a1 1 0 00-1-1H4zm15 4H1v9a2 2 0 002 2h14a2 2 0 002-2V7z" />
                        </svg>
                        {!isEditing ? (
                            <p className="text-gray-700">
                                <span className="font-semibold">Type:</span> {jobDetails?.category?.name}
                            </p>
                        ) : canEdit ? (
                            <input
                                type="text"
                                value={jobDetails?.category?.name}
                                onChange={(e) =>
                                    setJobDetails((prev) => ({ ...prev, type: e.target.value }))
                                }
                                className="w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                            />
                        ) : null}
                    </div>

                    {/* Posted */}
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
                        {!isEditing ? (
                            <p className="text-gray-700">
                                <span className="font-semibold">Posted:</span> {jobDetails ? formatDate(jobDetails.startDate?.toString()) : ''}
                            </p>
                        ) : canEdit ? (
                            <input
                                type="text"
                                value={jobDetails?.startDate?.toString()}
                                onChange={(e) =>
                                    setJobDetails((prev) => ({ ...prev, posted: e.target.value }))
                                }
                                className="w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                            />
                        ) : null}
                    </div>
                </div>

                <Applicants
                    applications={applications}
                    handleShortlist={handleShortlist}
                    owner={canEdit}
                />

                {/* 
          If you want the "Apply" button to appear above or below the applicants
          section, place it wherever fits best for your UX. 
        */}
                {canApply && (
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={handleApply}
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition shadow-sm hover:shadow-md"
                        >
                            Apply for this Job
                        </button>
                    </div>
                )}

                {/* Save Button (only visible when editing and the user can edit) */}
                {isEditing && canEdit && (
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={handleSave}
                            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition shadow-sm hover:shadow-md"
                        >
                            Save Changes
                        </button>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Popup (only if canEdit) */}
            {showDeletePopup && canEdit && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 px-4">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center relative opacity-100 transition-opacity">
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
            )}

            {/* Optional Toast Message */}
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage("")} />}
        </div>
    );
};

export default Page;
