

import LoadingCards from '@/components/LoadingCards';
import { Suspense } from 'react';
import ClientContainer from './ClientContainer';
import EmptyList from './EmptyList';
import { getJobs } from '@/utils/actions/jobs';

const Home = async ({ searchParams }: {
    searchParams: Promise<{
        category: string,
        endDate: string,
        location: string,
        maxPrice: string,
        minPrice: string,
        startDate: string
        keyword: string
    }>
}) => {
    const jobs = await getJobs(await searchParams);

    if (jobs?.length === 0) {
        return (
            <EmptyList
                heading='No results.'
                message='Try changing or removing some of your filters.'
                btnText='Clear Filters'
            />
        );
    }

    return (
        <Suspense fallback={<LoadingCards />}>
            <ClientContainer jobs={jobs} />
        </Suspense>
    );
}

export default Home;
