import prisma from "@/db/prisma-client";
import { createJobSchema, getAllJobsSchema } from "@/validation/jobs";

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     tags:
 *       - Jobs
 *     summary: Get all jobs
 *     description: Returns a list of all jobs
 *     responses:
 *       200:
 *         description: A JSON array of jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   budget:
 *                     type: number
 *                   location:
 *                     type: string
 *                   status:
 *                     type: string
 *                     enum: [OPEN, IN_PROGRESS, COMPLETED, CANCELLED]
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 */
export async function GET(request: Request) {
    // Parse and validate query parameters
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());

    const validatedQueryParams = getAllJobsSchema.parse({
        ...queryParams,
        minBudget: queryParams.minBudget ? parseFloat(queryParams.minBudget) : undefined,
        maxBudget: queryParams.maxBudget ? parseFloat(queryParams.maxBudget) : undefined,
    });

    // Build Prisma query filters
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: Record<string, any> = {};

    if (validatedQueryParams.status) filters.status = validatedQueryParams.status;
    if (validatedQueryParams.location) filters.location = validatedQueryParams.location;
    if (validatedQueryParams.minBudget || validatedQueryParams.maxBudget) {
        filters.budget = {};
        if (validatedQueryParams.minBudget) filters.budget.gte = validatedQueryParams.minBudget;
        if (validatedQueryParams.maxBudget) filters.budget.lte = validatedQueryParams.maxBudget;
    }

    // Fetch jobs from the database
    const jobs = await prisma.job.findMany({
        where: filters,
    });

    return new Response(JSON.stringify(jobs), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     tags:
 *       - Jobs
 *     summary: Create a new job
 *     description: Creates a new job
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               budget:
 *                 type: number
 *               location:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [OPEN, IN_PROGRESS, COMPLETED, CANCELLED]
 *             required:
 *               - title
 *               - description
 *               - budget
 *               - location
 *     responses:
 *       201:
 *         description: Job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 budget:
 *                   type: number
 *                 location:
 *                   type: string
 *                 status:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 */
export async function POST(request: Request) {
    const body = await request.json();

    // Validate the input using Zod
    const validatedData = createJobSchema.parse(body);

    // Proceed with database logic...
    const newJob = await prisma.job.create({ data: validatedData });

    return new Response(JSON.stringify(newJob), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
    });
}
