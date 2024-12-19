import React from 'react'
import ClientComp from './ClientComp';
import { getCategories } from '@/utils/actions/category';

const page = async () => {
    const categories = await getCategories()
    return (
        <ClientComp categories={categories} />
    )
}

export default page