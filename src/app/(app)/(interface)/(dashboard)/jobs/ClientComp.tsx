import React from 'react'
import JobCard from '@/components/JobCard';
import { ExtendedJob } from '@/types'

const ClientComp: React.FC<{ jobs: ExtendedJob[] | null }> = ({ jobs }) => {
    return (
        <div className="container mx-auto py-10 px-6">
            <div className="mb-8">
                <h2 className="font-bold text-3xl text-gray-800">My Jobs</h2>
                <p className="text-gray-500 text-sm">{jobs?.length} jobs found</p>
            </div>
            {/* Jobs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {jobs?.map(job => <JobCard key={job.id} job={job} />)}
            </div>
        </div>

    )
}

export default ClientComp