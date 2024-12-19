import React from 'react'
import Client from './Client'
import { getApplications } from '@/utils/actions/applications'

const page = async () => {
    const applications = await getApplications();

    return (
        <Client applications={applications} />
    )
}

export default page