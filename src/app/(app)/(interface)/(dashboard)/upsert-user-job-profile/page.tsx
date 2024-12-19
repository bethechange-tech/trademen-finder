import { getUserJobProfile } from '@/app/_utilities/actions';
import React from 'react'
import CreateProfilePage from './CreateProfilePage'

const page = async () => {
    const profile = await getUserJobProfile();

    return (
        <CreateProfilePage profile={profile} />
    )
}

export default page