import { HandlerFunctionWrapper } from "../../../../lib/handler-wrapper";
import { NextRequest } from "next/server";
import prisma from "@/db/prisma-client";

export const POST = HandlerFunctionWrapper(async (req, _res, session) => {
  console.log("Request received for application creation.");

  const { jobId, status, applicationDate } = await req.json();

  if (!jobId || !session?.authProviderId) {
    return new Response('Job ID and user authentication are required', { status: 400 });
  }

  try {
    console.log("Creating a new application...");
    const user = await prisma.user.findFirst({
      where: {
        authProviderId: session.authProviderId
      }
    });

    const applicationEntry = await prisma.application.create({
      data: {
        jobId,
        applicantId: user!.id,
        status,
        applicationDate: new Date(applicationDate),
      },
    });

    console.log("Application created:", applicationEntry);

    return Response.json({
      application: applicationEntry,
    });
  } catch (error: any) {
    console.error('Error encountered:', error);
    if (error.code === 'P2002') {
      // Handle unique constraint violation
      console.error('Unique constraint failed on:', error.meta.target);
      return new Response(
        JSON.stringify({
          message: `An application already exists for this job.`,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    throw error;
  }
}, { useAuth: true });


export const PUT = HandlerFunctionWrapper(async (req: NextRequest) => {
  console.log("Request received for application update.");

  const formData = await req.formData();
  console.log("FormData received:", formData);

  const id = formData.get('id')?.toString() || '';
  const status = formData.get('status')?.toString() || '';
  console.log("Parsed application body:", { id, status });

  if (!id) {
    return new Response('Application ID is required', { status: 400 });
  }

  if (!status) {
    return new Response('Status is required', { status: 400 });
  }

  try {
    console.log("Updating application status...");
    const updatedApplication = await prisma.application.update({
      where: { id: parseInt(id, 10) },
      data: {
        status,
        applicationDate: new Date(), // Assuming applicationDate is used as an updated timestamp
      },
    });

    console.log("Application updated:", updatedApplication);

    return Response.json({
      application: updatedApplication,
    });
  } catch (error) {
    console.error('Error encountered:', error);
    return new Response('An error occurred while updating the application', { status: 500 });
  }
}, { useAuth: true });

export const GET = HandlerFunctionWrapper(async (_req: NextRequest, _res, session) => {
  console.log("Request received for retrieving applications");

  try {
    console.log("Fetching applications...");
    const user = await prisma.user.findUnique({
      where: {
        authProviderId: session?.authProviderId
      }
    });

    const applications = await prisma.application.findMany({
      where: { applicantId: user?.id },
      take: 10, // Equivalent to `limit: 10`
      include: {
        job: {
          include: {
            shortList: true,
            category: true
          }
        }, // Include related job details
        applicant: true, // Include related applicant details
      },
    });

    console.log("Applications retrieved successfully:", applications);

    return new Response(
      JSON.stringify(applications),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in GET handler:", error);
    return new Response(
      JSON.stringify({ error: "Failed to retrieve applications" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}, { useAuth: true });

export const DELETE = HandlerFunctionWrapper(async (req: NextRequest) => {
  console.log("Request received for application deletion.");

  const url = new URL(req.url);
  const applicationId = url.searchParams.get("id");

  if (!applicationId) {
    console.error("Application ID is required for deletion.");
    return new Response(JSON.stringify({ error: "Application ID is required" }), { status: 400 });
  }

  try {
    console.log("Deleting application with ID:", applicationId);

    const deletedApplication = await prisma.application.delete({
      where: { id: parseInt(applicationId, 10) },
    });

    console.log("Application deleted successfully:", deletedApplication);

    return new Response(
      JSON.stringify({
        message: "Application deleted successfully",
        application: deletedApplication,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error encountered during application deletion:", error);
    return new Response(JSON.stringify({ error: "Failed to delete application" }), { status: 500 });
  }
}, { useAuth: true });
