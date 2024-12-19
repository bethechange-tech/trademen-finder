import React from 'react'
import Client from './Client'
import { getJob } from '@/utils/actions';

const page: React.FC<{
    params: Promise<{ id: string }>;
}> = async ({ params }) => {

    const { id } = await params;

    const job =
        await getJob(id);

    return (
        <Client job={job} />
    )
}

export default page