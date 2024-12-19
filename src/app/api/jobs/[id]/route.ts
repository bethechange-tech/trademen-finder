import prisma from "@/db/prisma-client";
import { deleteJobSchema, getJobByIdSchema, updateJobSchema } from "@/validation/jobs";

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     tags:
 *       - Jobs
 *     summary: Get a job by ID
 *     description: Retrieves a specific job by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A job object
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
 *                   enum: [OPEN, IN_PROGRESS, COMPLETED, CANCELLED]
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Job not found
 */
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    // Validate the job ID using Zod
    const validatedParams = getJobByIdSchema.parse({ params: context.params });

    // Fetch the job from the database
    const job = await prisma.job.findUnique({
        where: { id: validatedParams.id },
    });

    return new Response(JSON.stringify(job), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

/**
 * @swagger
 * /api/jobs/{id}:
 *   put:
 *     tags:
 *       - Jobs
 *     summary: Update a job
 *     description: Updates a job by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *     responses:
 *       200:
 *         description: Job updated successfully
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
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Job not found
 */
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    const body = await request.json();
    const validatedData = updateJobSchema.parse({ id: context.params, body });

    // Proceed with database logic...
    const updatedJob = await prisma.job.update({
        where: { id: validatedData.id },
        data: validatedData.body,
    });

    return new Response(JSON.stringify(updatedJob), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

/**
 * @swagger
 * /api/jobs/{id}:
 *   delete:
 *     tags:
 *       - Jobs
 *     summary: Delete a job
 *     description: Deletes a job by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Job deleted successfully
 *       404:
 *         description: Job not found
 */
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    // Validate the job ID using Zod
    const validatedParams = deleteJobSchema.parse({ params: context.params });

    // Attempt to delete the job from the database
    const deletedJob = await prisma.job.delete({
        where: { id: validatedParams.id },
    });

    return new Response(JSON.stringify({ message: "Job deleted successfully", job: deletedJob }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
