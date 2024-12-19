import { formatDate } from '@/helpers/date';
import { ExtendedApplication } from '@/types'
import React from 'react'

const Applicants: React.FC<{
    applications?: Partial<ExtendedApplication>[],
    handleShortlist: (applicantId?: number) => void;
    owner: boolean
}> = ({ applications, handleShortlist, owner }) => {

    return (
        <div className="bg-white w-full max-w-5xl rounded-xl shadow-md p-6 sm:p-8 mt-10 transition-shadow hover:shadow-lg">
            <h2 className="text-2xl font-extrabold text-gray-800 mb-6">Applicants</h2>

            {/* Check if the user is the owner */}
            {owner ? (
                // Show applications if owner is true
                applications && applications?.length > 0 ? (
                    <div className="space-y-4">
                        {applications?.map((applicant) => (
                            <div
                                key={applicant.id}
                                className="flex flex-col sm:flex-row sm:justify-between sm:items-center 
                                    space-y-3 sm:space-y-0 border-b border-gray-200 pb-4 rounded-lg px-4 
                                    hover:bg-gray-50 transition duration-200 ease-in-out"
                            >
                                {/* Applicant Info */}
                                <div className="flex flex-col sm:items-start space-y-1">
                                    <h3 className="text-lg font-bold text-gray-900">{applicant?.applicant?.userProfile.fullName}</h3>
                                    <p className="text-sm text-gray-600">
                                        Applied on:{" "}
                                        <span className="font-medium text-gray-800">
                                            {applicant ? formatDate(applicant?.applicationDate?.toString()) : ''}
                                        </span>
                                    </p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    {/* Status Badge */}
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

                                    {/* Shortlist Button: only visible if job owner is logged in */}
                                    {owner && applicant.status !== "Shortlisted" && (
                                        <button
                                            onClick={() => handleShortlist(applicant?.id)}
                                            className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 transition text-sm"
                                        >
                                            Shortlist
                                        </button>
                                    )}
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
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 14l6.16-3.422a12.083 12.083 0 01-12.32 0L12 14z"
                            />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v8" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14L3 9l9-5 9 5-9 5z" />
                        </svg>
                        <p className="text-gray-500 text-lg font-medium">No applications yet</p>
                        <p className="text-gray-400 text-sm mt-2">
                            Check back later to see who applies for this job.
                        </p>
                    </div>
                )
            ) : (
                // If not the owner, show a different message
                <div className="flex flex-col items-center justify-center py-16">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 text-gray-300 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 14l6.16-3.422a12.083 12.083 0 01-12.32 0L12 14z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v8" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14L3 9l9-5 9 5-9 5z" />
                    </svg>
                    <p className="text-gray-500 text-lg font-medium">You do not have permission to view the applicants.</p>
                    <p className="text-gray-400 text-sm mt-2">
                        Please contact the job owner for more details.
                    </p>
                </div>
            )}
        </div>
    )
}

export default Applicants
