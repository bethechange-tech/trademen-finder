import tradesMenRequest from '@/lib/requesters';
import { ExtendedApplication, ExtendedJob } from '@/types';

export const createApplication = async ({
    jobId, status
}: {
    jobId?: number, status: string
}) => {
    const response = await tradesMenRequest.post<ExtendedApplication>('/api/application', {
        jobId,
        status,
        applicationDate: new Date()
    });

    return response.data
}

export const getApplications = async () => {
    try {
        const response = await tradesMenRequest.get<ExtendedApplication[]>('/api/application');
        return response.data

    } catch (error) {
        return null
    }
}

export const payForApplication = async (job: ExtendedJob) => {
    const { data: { id: sessionId } } = await tradesMenRequest.post(
        `/api/checkout_sessions`,
        { orderTotal: 5, jobId: job?.id, jobName: job?.title },
        { withCredentials: true }
    )

    return {
        sessionId
    }
}