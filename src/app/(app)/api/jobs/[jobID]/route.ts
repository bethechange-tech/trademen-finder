import prisma from "@/db/prisma-client";
import { HandlerFunctionWrapper } from "@/lib/handler-wrapper";


export const GET = HandlerFunctionWrapper(async (req, context: any) => {
    console.log("Request received to get a job");
    try {
        console.log("Fetching job details...");
        const job = await prisma.job.findUnique({
            where: { id: parseInt(context.params.jobID, 10) },
            include: {
                applications: {
                    include: {
                        applicant: {
                            include: {
                                userProfile: true
                            }
                        }
                    }
                }, // Include applicants if needed
                category: true,
            },
        });

        if (!job) {
            return new Response('Job not found', { status: 404 });
        }

        return Response.json(job);
    } catch (error) {
        console.error("Error in GET handler:", error);
        return new Response('An error occurred while fetching the job', { status: 500 });
    }
}, { useAuth: false });
