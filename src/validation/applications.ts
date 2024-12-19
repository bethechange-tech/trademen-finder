import { z } from "zod";

export const createApplicationSchema = z.object({
    jobId: z.string().uuid("Invalid job ID format"),
    applicantName: z.string().min(1, "Applicant name is required"),
    applicantEmail: z.string().email("Invalid email address"),
    message: z.string().optional(),
});

export const getAllApplicationsSchema = z.object({
    status: z.enum(["PENDING", "ACCEPTED", "REJECTED"]).optional(),
    jobId: z.string().uuid("Invalid job ID format").optional(),
    applicantEmail: z.string().email("Invalid email address").optional(),
});

export const getApplicationByIdSchema = z.object({
    id: z.string().uuid("Invalid application ID format"),
});

export const updateApplicationSchema = z.object({
    id: z.string().uuid("Invalid application ID format"), // Path parameter
    body: z.object({
        status: z.enum(["PENDING", "ACCEPTED", "REJECTED"]).optional(),
        message: z.string().optional(),
    }),
});

export const deleteApplicationSchema = z.object({
    id: z.string().uuid("Invalid application ID format"),
});
