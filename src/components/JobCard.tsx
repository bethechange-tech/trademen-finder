import Link from "next/link";
import React from "react";

type JobProps = {
    job: {
        id: string;
        title: string;
        description: string;
        budget: number;
        location: string;
        type: string;
        status: string;
        postedAt: string;
    };
};

const JobCard: React.FC<JobProps> = ({ job }) => {
    return (
        <div className="bg-white p-6 shadow rounded-lg hover:shadow-lg transition">
            <h3 className="text-lg font-semibold">{job.title}</h3>
            <p className="text-gray-500">{job.location}</p>
            <p className="text-sm text-gray-400">Type: {job.type}</p>
            <p className="text-sm text-gray-400">Status: {job.status}</p>
            <p className="text-sm text-gray-400">Budget: ${job.budget}</p>
            <p className="text-sm text-gray-400 mt-2">{new Date(job.postedAt).toLocaleDateString()}</p>
            <Link href={`/jobs/${job.id}`}>
                <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                    Apply
                </button>
            </Link>
        </div>
    );
};

export default JobCard;
