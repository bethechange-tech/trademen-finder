import React from 'react'
import Header from './Header'
import { getAuthUser } from '@/utils/actions';


const index = async () => {
    const currentUser = await getAuthUser();

    return (
        <Header currentUser={currentUser} />
    )
}

export default index