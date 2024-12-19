import prisma from "@/db/prisma-client";
import { HandlerFunctionWrapper } from "@/lib/handler-wrapper";

export const GET = HandlerFunctionWrapper(async (_req, _res, session) => {
    console.log("Request received to get jobs");

    if (!session?.authProviderId) {
        return new Response('User authentication is required', { status: 401 });
    }

    try {
        console.log("Fetching jobs for user:", session.authProviderId);

        const jobs = await prisma.job.findMany({
            where: {
                user: {
                    authProviderId: session?.authProviderId
                }
            },
            include: {
                applicants: true, // Include applicants if necessary
                shortList: true,  // Include shortlisted users if necessary
                applications: true, // Include applications if necessary
            },
        });

        console.log("Jobs retrieved successfully:", jobs.length);

        return Response.json({ jobs });
    } catch (error) {
        console.error("Error in GET handler:", error);
        return new Response('An error occurred while retrieving jobs', { status: 500 });
    }
}, { useAuth: true });

