// src/app/(app)/(interface)/(unprotected)/services/JobDetails.tsx

import React, { useMemo, useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { Job, Users } from '@/payload-types';
import { userStore } from '@/store/user';
import { useRouter } from 'next/navigation';
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, MapPinIcon } from '@heroicons/react/24/solid';

interface JobDetailsProps {
    selectedJob: Job | null;
    onClose: () => void;
}

const JobDetails: React.FC<JobDetailsProps> = ({ selectedJob: initialSelectedJob, onClose }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Ensure `selectedJob` has a fallback value to avoid rendering issues
    const selectedJob = useMemo(() => initialSelectedJob || ({} as Job), [initialSelectedJob]);

    const currentUser = userStore((state) => state.user) as Users | null;

    // Safely check if the current user has already applied for the selected job
    const hasAlreadyApplied = useMemo(() => {
        if (!selectedJob?.applicants || !currentUser) return false;
        return (selectedJob.applicants as Users[]).some((applicant) => applicant?.id === currentUser.id);
    }, [selectedJob, currentUser]);

    const handleApply = async () => {
        if (!currentUser) {
            setErrorMessage('You are not logged in. Please log in to apply.');
            return;
        }

        if (hasAlreadyApplied) {
            setErrorMessage('You have already applied for this job and are awaiting a response.');
            return;
        }

        setLoading(true);
        setSuccess(false);
        setErrorMessage(null);

        try {
            const formData = new FormData();
            formData.append('job', selectedJob.id.toString());

            const response = await axios.post('/api/application', formData);

            if (response.status === 200) {
                setSuccess(true);
            } else {
                setErrorMessage('Failed to apply for the job. Please try again.');
            }
        } catch (error) {
            console.error('Error applying for job:', error);
            setErrorMessage('Error applying for the job. Please try again.');
        } finally {
            setLoading(false);
            // Optionally, redirect after a delay
            setTimeout(() => {
                router.push('/services');
            }, 2000);
        }
    };

    // Close modal on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    // Trap focus within modal
    useEffect(() => {
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const modal = modalRef.current;
        const firstFocusableElement = modal?.querySelectorAll(focusableElements)[0] as HTMLElement;
        const focusableContent = modal?.querySelectorAll(focusableElements);
        const lastFocusableElement = focusableContent ? focusableContent[focusableContent.length - 1] as HTMLElement : null;

        const handleTab = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) { // Shift + Tab
                if (document.activeElement === firstFocusableElement) {
                    e.preventDefault();
                    lastFocusableElement?.focus();
                }
            } else { // Tab
                if (document.activeElement === lastFocusableElement) {
                    e.preventDefault();
                    firstFocusableElement?.focus();
                }
            }
        };

        document.addEventListener('keydown', handleTab);
        firstFocusableElement?.focus();

        return () => {
            document.removeEventListener('keydown', handleTab);
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
                ref={modalRef}
                className="bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4 sm:mx-6 lg:mx-8 p-6 relative overflow-y-auto max-h-screen"
                role="dialog"
                aria-modal="true"
                aria-labelledby="job-details-title"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    aria-label="Close Job Details"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>

                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center md:items-start mb-6">
                    {/* Image Section */}
                    <div className="relative w-32 h-32 md:w-48 md:h-48 flex-shrink-0 mb-4 md:mb-0">
                        <Image
                            src={selectedJob?.image || 'https://via.placeholder.com/150'}
                            alt={selectedJob?.title || 'Job Image'}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg shadow-md"
                            placeholder="blur"
                            blurDataURL="https://via.placeholder.com/10"
                        />
                    </div>

                    {/* Job Info */}
                    <div className="md:ml-6 text-center md:text-left">
                        <h2 id="job-details-title" className="text-2xl font-semibold text-gray-800 truncate">
                            {selectedJob?.title || 'Job Title'}
                        </h2>
                        <p className="text-gray-600 text-sm font-medium mt-1 flex items-center justify-center md:justify-start">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-1" />
                            {(selectedJob?.user as Users)?.firstName || 'Job Poster'}
                        </p>
                        <p className="text-gray-600 text-sm mt-1 flex items-center justify-center md:justify-start">
                            <MapPinIcon className="h-5 w-5 text-gray-500 mr-1" />
                            {selectedJob?.city || 'City'}, {selectedJob?.country || 'Country'}
                        </p>
                        <p className="text-indigo-600 text-lg font-bold mt-2 flex items-center justify-center md:justify-start">
                            £{selectedJob?.price || '0'}
                        </p>
                    </div>
                </div>

                {/* Application Section */}
                <div className="flex flex-col items-center space-y-4 mb-6">
                    {hasAlreadyApplied ? (
                        <div className="flex items-center bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-lg shadow-md w-full">
                            <ExclamationTriangleIcon className="h-6 w-6 mr-3" />
                            <span className="font-medium">
                                You have already applied for this job and are awaiting a response.
                            </span>
                        </div>
                    ) : (
                        <button
                            onClick={handleApply}
                            className={`flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-400 to-green-500 text-white font-semibold rounded-full hover:from-green-500 hover:to-green-600 transition-colors duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 ${loading ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <svg
                                        className="animate-spin h-5 w-5 mr-3 text-white"
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
                                'Apply'
                            )}
                        </button>
                    )}
                </div>

                {/* Success/Error Messages */}
                {errorMessage && (
                    <div className="flex items-center bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md mb-4">
                        <ExclamationTriangleIcon className="h-6 w-6 mr-3" />
                        <span className="font-medium">{errorMessage}</span>
                    </div>
                )}
                {success && (
                    <div className="flex items-center bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-md mb-4">
                        <CheckCircleIcon className="h-6 w-6 mr-3" />
                        <span className="font-medium">Successfully applied for the job!</span>
                    </div>
                )}

                {/* Job Description */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Job Description</h3>
                    <p className="text-gray-700 leading-relaxed">
                        {selectedJob?.description || 'No description available.'}
                    </p>
                </div>
            </div>
        </div>
    );

}; // ✅ Close the component function here

export default JobDetails; // ✅ Export is outside the component function
