import React from 'react'
import ClientComp from './ClientComp'
import { getMyJobs } from '@/utils/actions/jobs';

const page = async () => {
    const jobs = await getMyJobs();

    return (
        <ClientComp jobs={jobs} />
    )
}

export default page