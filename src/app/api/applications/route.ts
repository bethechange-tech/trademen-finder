/**
 * @swagger
 * /api/applications:
 *   get:
 *     tags:
 *       - Applications
 *     summary: Get all applications
 *     description: Returns a list of all applications
 *     responses:
 *       200:
 *         description: A JSON array of applications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   jobId:
 *                     type: string
 *                   applicantName:
 *                     type: string
 *                   applicantEmail:
 *                     type: string
 *                   status:
 *                     type: string
 *                     enum: [PENDING, ACCEPTED, REJECTED]
 *                   message:
 *                     type: string
 *                   appliedAt:
 *                     type: string
 *                     format: date-time
 */
export async function GET() {
    // Mock logic for fetching all applications
    const applications = [
        {
            id: "application-id-1",
            jobId: "job-id-1",
            applicantName: "John Doe",
            applicantEmail: "johndoe@example.com",
            status: "PENDING",
            message: "Looking forward to this opportunity.",
            appliedAt: new Date().toISOString(),
        },
        {
            id: "application-id-2",
            jobId: "job-id-2",
            applicantName: "Jane Smith",
            applicantEmail: "janesmith@example.com",
            status: "ACCEPTED",
            message: "I am excited to start.",
            appliedAt: new Date().toISOString(),
        },
    ];

    return new Response(JSON.stringify(applications), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

/**
 * @swagger
 * /api/applications:
 *   post:
 *     tags:
 *       - Applications
 *     summary: Create a new application
 *     description: Creates a new application for a job
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobId:
 *                 type: string
 *               applicantName:
 *                 type: string
 *               applicantEmail:
 *                 type: string
 *               message:
 *                 type: string
 *             required:
 *               - jobId
 *               - applicantName
 *               - applicantEmail
 *     responses:
 *       201:
 *         description: Application created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 jobId:
 *                   type: string
 *                 applicantName:
 *                   type: string
 *                 applicantEmail:
 *                   type: string
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 appliedAt:
 *                   type: string
 *                   format: date-time
 */
export async function POST(request: Request) {
    const body = await request.json();
    // Mock logic for creating a new application
    const newApplication = {
        id: "application-id-3",
        jobId: body.jobId,
        applicantName: body.applicantName,
        applicantEmail: body.applicantEmail,
        status: "PENDING",
        message: body.message || null,
        appliedAt: new Date().toISOString(),
    };

    return new Response(JSON.stringify(newApplication), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
    });
}
