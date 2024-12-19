import axios from "axios";
import { Job, Category } from '@prisma/client'
import type { Application, UserProfile } from '@/payload-types'

export type ExtendedJobs = Job & {
    category: Category
}

export const getJobs = async (params: {
    catergory: string;
    endDate: string;
    location: string;
    maxPrice: string;
    minPrice: string;
    startDate: string;
}): Promise<ExtendedJobs[]> => {
    try {
        const token = ''

        // Constructing the query string using URLSearchParams
        const queryParams = new URLSearchParams(params).toString();

        const response = await axios.get<{ docs: ExtendedJobs[] }>(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/jobs?${queryParams}`,
            {
                headers: {
                    Authorization: `JWT ${token}`,
                },
            }
        );

        return response.data.docs;
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return [] as unknown as ExtendedJobs[];
    }
};

export const getMyJobs = async (): Promise<Job[]> => {
    try {
        const token = ''
        const response = await axios.get<{ docs: Job[] }>(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/my-jobs`,
            {
                headers: {
                    Authorization: `JWT ${token}`,
                },
            }
        );

        return response.data.docs;
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return [];
    }
};



export const getJob = async (id: string): Promise<Job> => {
    try {
        const token = ''

        // Constructing the query string using URLSearchParams
        const response = await axios.get<Job>(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/jobs/${id}`,
            {
                headers: {
                    Authorization: `JWT ${token}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return {} as Job;
    }
};



export const getUserJobProfile = async (): Promise<UserProfile | null> => {
    try {
        const token = ''
        const response = await axios.get<{ profiles: UserProfile }>(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user-job-profile`,
            {
                headers: {
                    Authorization: `JWT ${token}`,
                },
            }
        );

        return response.data.profiles;
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return null;
    }
};

export const getUserApplications = async (): Promise<Application | null> => {
    try {
        const token = ''
        const response = await axios.get<{ applications: Application }>(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/application`,
            {
                headers: {
                    Authorization: `JWT ${token}`,
                },
            }
        );

        return response.data.applications;
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return null;
    }
};