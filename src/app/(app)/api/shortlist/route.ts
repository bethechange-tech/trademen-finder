import prisma from '@/db/prisma-client';
import { HandlerFunctionWrapper } from '@/lib/handler-wrapper';
import { PromisePool } from '@supercharge/promise-pool'; // For managing concurrency

export const POST = HandlerFunctionWrapper(async (req) => {
    console.log("Request received for job creation.");

    const bodyData = await req.json() as { jobId: number; shortlistedApplicantsIds: number[] };
    console.log("Parsed body data:", bodyData);

    if (!bodyData.jobId || !bodyData.shortlistedApplicantsIds) {
        return new Response('Job ID and shortlisted applicants are required', { status: 400 });
    }

    try {
        console.log("Updating job with shortlisted applicants...");
        const jobEntry = await prisma.job.update({
            where: { id: bodyData.jobId },
            data: {
                shortList: {
                    connect: bodyData.shortlistedApplicantsIds.map((id) => ({ id })),
                },
            },
        });

        console.log("Job updated:", jobEntry);

        console.log("Updating users' shortlisted jobs...");
        const { results, errors } = await PromisePool
            .withConcurrency(2) // Adjust concurrency based on your system's capacity
            .for(bodyData.shortlistedApplicantsIds)
            .process(async (applicantId) => {
                return prisma.user.update({
                    where: { id: applicantId },
                    data: {
                        shortLists: {
                            connect: { id: bodyData.jobId },
                        },
                    },
                });
            });

        if (errors.length > 0) {
            console.error("Errors encountered while updating users:", errors);
        }

        console.log("Users updated with shortlisted jobs.");

        return Response.json({
            job: jobEntry,
            updatedUsers: results,
        });
    } catch (error) {
        console.error('Error encountered:', error);
        return new Response('An error occurred while updating job and users', { status: 500 });
    }
}, { useAuth: false });
