import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Job, Users } from "@/payload-types";
import { userStore } from "@/store/user";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/navigation";

type JobDetailsModalProps = {
    job: Job | null;
    onClose: () => void;
};

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ job: initialJob, onClose }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const currentUser = userStore((state) => state.user) as Users | null;

    // Ensure `job` has a fallback value
    const job = useMemo(() => initialJob || ({} as Job), [initialJob]);

    const hasAlreadyApplied = useMemo(() => {
        if (!job?.applicants || !currentUser) return false;
        return (job.applicants as Users[]).some((applicant) => applicant?.id === currentUser.id);
    }, [job, currentUser]);

    const handleApply = async () => {
        if (!currentUser) {
            setErrorMessage("You are not logged in. Please log in to apply.");
            return;
        }

        setLoading(true);
        setSuccess(false);
        setErrorMessage(null);

        try {
            const formData = new FormData();
            formData.append("job", job.id.toString());

            const response = await axios.post("/api/application", formData);

            if (response.status === 200) {
                setSuccess(true);
            } else {
                setErrorMessage("Failed to apply for the job. Please try again.");
            }
        } catch (error) {
            console.error("Error applying for job:", error);
            setErrorMessage("Error applying for the job. Please try again.");
        } finally {
            setLoading(false);
            router.refresh();
        }
    };

    if (!initialJob) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm lg:hidden"
        >
            <div className="bg-white rounded-xl w-4/5 max-w-lg mx-auto p-6 relative shadow-lg">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 focus:outline-none text-2xl transition duration-200"
                    aria-label="Close"
                >
                    &times;
                </button>

                <div className="mt-8 overflow-y-auto h-full pr-4">
                    {/* Image Section */}
                    <div className="flex justify-center mb-8">
                        <Image
                            src={job?.image || "https://via.placeholder.com/100"}
                            alt={job?.title || "Job Image"}
                            width={100}
                            height={100}
                            className="rounded-full object-cover shadow-lg border-4 border-gray-300"
                        />
                    </div>

                    {/* Job Title */}
                    <h2 className="text-2xl font-semibold text-center text-gray-800 truncate" title={job?.title || "Job Title"}>
                        {job?.title || "Job Title"}
                    </h2>

                    {/* Job Info */}
                    <div className="text-center mt-4 mb-6">
                        <h3 className="text-xl font-medium text-gray-700">
                            {(job?.user as Users)?.firstName || "Job Poster"}
                        </h3>
                        <p className="text-sm text-gray-500">
                            <span>{job?.city || "Unknown City"}</span> |{" "}
                            <span>{job?.category || "Unknown Category"}</span> |{" "}
                            <span className="font-semibold">Price: £{job?.price || 0}</span>
                        </p>
                    </div>

                    {/* Application Section */}
                    <div className="flex justify-center space-x-4 mb-6">
                        {hasAlreadyApplied ? (
                            <p className="flex items-center px-6 py-2 bg-yellow-100 text-yellow-800 font-medium rounded-lg shadow-md">
                                <FaExclamationCircle className="mr-2" />
                                You have already applied for this job and are awaiting a response.
                            </p>
                        ) : (
                            <button
                                onClick={handleApply}
                                className="flex items-center justify-center px-6 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white font-medium rounded-lg hover:from-green-500 hover:to-green-600 transition duration-200 shadow-md"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <svg
                                            className="animate-spin h-5 w-5 mr-2 text-white"
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
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                            ></path>
                                        </svg>
                                        Applying...
                                    </>
                                ) : (
                                    "Apply"
                                )}
                            </button>
                        )}
                    </div>

                    {/* Success/Error Messages */}
                    {errorMessage && (
                        <div className="flex items-center justify-center mb-6">
                            <p className="text-red-500 text-center">
                                <FaExclamationCircle className="inline-block mr-1" />
                                {errorMessage}
                            </p>
                        </div>
                    )}

                    {success && (
                        <div className="flex items-center justify-center mb-6">
                            <p className="text-green-500 text-center">
                                <FaCheckCircle className="inline-block mr-1" />
                                Successfully applied for the job!
                            </p>
                        </div>
                    )}

                    {/* Job Description */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Job Description</h3>
                        <p className="text-gray-700 leading-relaxed">{job?.description || "No description available."}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default JobDetailsModal;
