import React from 'react'
import Client from './client'
import { getAuthUser } from '@/utils/actions'
import { redirect } from 'next/navigation'

const page = async () => {
    const user = await getAuthUser()

    if (user) return redirect('/')

    return (
        <Client />
    )
}

export default page
