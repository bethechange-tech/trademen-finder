import { z } from "zod";

export const createJobSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    budget: z.number().positive("Budget must be a positive number"),
    location: z.string().min(1, "Location is required"),
    status: z.enum(["OPEN", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
});

export const updateJobSchema = z.object({
    id: z.string().uuid("Invalid job ID format"), // Path parameter
    body: z.object({
        title: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        budget: z.number().positive().optional(),
        location: z.string().min(1).optional(),
        status: z.enum(["OPEN", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
    }),
});


export const getAllJobsSchema = z.object({
    // Add optional filters if applicable, e.g., pagination, status filter, etc.
    status: z.enum(["OPEN", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
    location: z.string().optional(),
    minBudget: z.number().positive().optional(),
    maxBudget: z.number().positive().optional(),
});

export const getJobByIdSchema = z.object({
    id: z.string().uuid("Invalid job ID format"),
});

export const deleteJobSchema = z.object({
    id: z.string().uuid("Invalid job ID format"),
});
