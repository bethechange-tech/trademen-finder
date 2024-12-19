import React from "react";
import { Job, Category } from '@prisma/client'
import { FaCity, FaBriefcase, FaDollarSign, FaCalendarAlt } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

type JobProps = {
    job: Job & {
        category: Category
    };
};

const JobCard: React.FC<JobProps> = ({ job }) => {
    // Function to format the start date
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Determine badge color based on job status
    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case "open":
                return "bg-green-100 text-green-800";
            case "closed":
                return "bg-red-100 text-red-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <Link href={`/services/${job.id}`}>
            <div className="block">
                <div className="bg-white p-6 shadow-md rounded-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                    {/* Job Image */}
                    <div className="flex justify-center mb-4">
                        <Image
                            src={job.image || "/default-job.png"} // Provide a default image path
                            alt={job.title}
                            width={80}
                            height={80}
                            className="rounded-full object-cover"
                        />
                    </div>

                    {/* Job Title */}
                    <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">
                        {job.title}
                    </h3>

                    {/* Badges */}
                    <div className="flex justify-center space-x-2 mb-4">
                        {/* Job Type Badge */}
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                            {job.years} Years
                        </span>
                        {/* Job Status Badge */}
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status! || 'open')}`}>
                            {job.status}
                        </span>
                    </div>

                    {/* Job Details */}
                    <div className="space-y-2">
                        {/* City */}
                        <div className="flex items-center text-gray-600">
                            <FaCity className="mr-2 text-lg" />
                            <span>{job.city}</span>
                        </div>
                        {/* Category */}
                        <div className="flex items-center text-gray-600">
                            <FaBriefcase className="mr-2 text-lg" />
                            <span>{(job.category).name}</span>
                        </div>
                        {/* Budget */}
                        <div className="flex items-center text-gray-600">
                            <FaDollarSign className="mr-2 text-lg" />
                            <span>Budget: £{job.price}</span>
                        </div>
                        {/* Start Date */}
                        <div className="flex items-center text-gray-600">
                            <FaCalendarAlt className="mr-2 text-lg" />
                            <span>Start Date: {formatDate(job?.startDate?.toString()!)}</span>
                        </div>
                    </div>

                    {/* Apply Button */}
                    <div className="mt-6 flex justify-center">
                        <button
                            className="flex items-center px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200"
                            aria-label={`Apply for ${job.title}`}
                        >
                            <span>Apply</span>
                            <FiChevronRight className="ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default JobCard;
