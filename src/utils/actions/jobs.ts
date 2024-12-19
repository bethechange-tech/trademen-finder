import tradesMenRequest from '@/lib/requesters';
import { ExtendedJob } from '@/types';

export const getJob = async (id: string) => {
    try {
        const response = await tradesMenRequest.get<ExtendedJob>(`/api/jobs/${id}`)
        return response.data
    } catch (error) {
        return null
    }
}


export const getJobs = async (params: {
    category: string;
    endDate: string;
    location: string;
    maxPrice: string;
    minPrice: string;
    startDate: string;
}): Promise<ExtendedJob[]> => {
    try {
        // Ensure all params are strings
        const sanitizedParams = Object.fromEntries(
            Object.entries(params).map(([key, value]) => [key, String(value)])
        );

        // Construct the query string using URLSearchParams
        const queryParams = new URLSearchParams(sanitizedParams).toString();

        const response = await tradesMenRequest.get<{ docs: ExtendedJob[] }>(
            `/api/jobs?${queryParams}`,
        );

        return response.data.docs;
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return [] as ExtendedJob[];
    }
};


export const getMyJobs = async (): Promise<ExtendedJob[] | null> => {
    try {
        const response = await tradesMenRequest.get<{ jobs: ExtendedJob[] }>(
            `/api/my-jobs`,
        );

        return response.data.jobs;
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return null;
    }
};


export const createJob = async (data: globalThis.FormData) => {
    const response = await tradesMenRequest.post("/api/jobs", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    console.log("Job created successfully:", response.data);
}