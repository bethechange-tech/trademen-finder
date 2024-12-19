import { HandlerFunctionWrapper } from "@/lib/handler-wrapper";
import { streamToBuffer } from "@/lib/streamToBuffer";
import { NextRequest } from "next/server";
import { uploadFiles } from '@/services/adapters';
import prisma from "@/db/prisma-client";

export const PUT = HandlerFunctionWrapper(async (req: NextRequest) => {
  console.log("Request received for job update.");

  const formData = await req.formData();

  // Extract and map formData to job details
  const jobBody = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    categoryId: parseInt(formData.get('categoryId') as string, 10), // Use categoryId instead of category
    price: parseFloat(formData.get('price') as string),
    city: formData.get('city') as string,
    years: formData.get('years') as string,
    image: formData.get('image') as string, // Assuming image URL is passed
    updatedAt: new Date(),
  };

  console.log("Parsed job body:", jobBody);

  try {
    const jobId = req.url?.split('/')?.pop();
    if (!jobId) {
      throw new Error("Job ID is required in the URL");
    }

    console.log("Updating job...");
    const updatedJobEntry = await prisma.job.update({
      where: { id: parseInt(jobId, 10) },
      data: jobBody,
    });

    console.log("Job updated:", updatedJobEntry);

    return Response.json({
      job: updatedJobEntry,
    });
  } catch (error) {
    console.error('Error encountered:', error);
    return new Response('Failed to update job', { status: 500 });
  }
}, { useAuth: true });

export const POST = HandlerFunctionWrapper(async (req, _res, session) => {
  console.log("Request received for job creation.");

  const formData = await req.formData();

  // Standardize filesUploaded to always be an array
  let filesUploaded: File[] = formData.getAll("images") as File[]; // Retrieves all files for "images" key

  // If no files were uploaded, getAll will return an empty array
  if (!filesUploaded.length) {
    const singleFile = formData.get("images");
    if (singleFile instanceof File) {
      filesUploaded = [singleFile];
    }
  }

  // Process the files
  const files = await Promise.all(
    filesUploaded.map(async (file: File) => {
      const fileStream = file.stream();
      return streamToBuffer(fileStream);
    })
  );

  try {

    // Uploading file and getting the URL
    const urls = files.length > 0 ? await uploadFiles({ files }) : [];
    console.log("File uploaded. URLs:", urls);

    console.log('----99----');
    console.log(JSON.stringify(session));
    console.log('====99====');

    const user = await prisma.user.findUnique({
      where: {
        authProviderId: session?.authProviderId
      }
    })

    // Map formData to job details
    const jobBody: {
      title: string;
      description: string;
      categoryId: number;
      userId: number;
      price: number;
      city: string;
      years: string;
      image: string;
      startDate: Date;
      endDate: Date;
    } = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      categoryId: parseInt(formData.get("categoryId") as string, 10),
      price: parseFloat(formData.get("price") as string),
      city: formData.get("city") as string,
      years: formData.get("years") as string,
      image: urls[0] || "",
      startDate: new Date(formData.get("startDate") as string), // Added startDate
      endDate: new Date(formData.get("endDate") as string), // Added endDate
      userId: user!.id
    };

    console.log("Creating a new job...");
    const jobEntry = await prisma.job.create({
      data: jobBody,
    });

    console.log("Job created:", jobEntry);

    return Response.json({
      job: jobEntry,
    });
  } catch (error) {
    console.log('----88----');
    console.log(error);
    console.log('====88====');
    throw error
  }
}, { useAuth: true });



export const GET = HandlerFunctionWrapper(async (req) => {
  console.log("Request received to get jobs");

  const { searchParams } = req.nextUrl;


  const filterConditions: any = {};

  // Filters
  const filters = [
    { param: "keyword", field: "title", operator: "contains" },
    { param: "location", field: "city", operator: "equals" },
    { param: "category", field: "category", operator: "contains" },
  ];

  filters.forEach(({ param, field, operator }) => {
    const paramValue = searchParams.get(param);
    if (paramValue) {
      filterConditions[field] = { [operator]: paramValue };
    }
  });

  const minPrice = parseFloat(searchParams.get("minPrice") || "0");
  const maxPrice = parseFloat(searchParams.get("maxPrice") || "0");
  if (minPrice && maxPrice) {
    filterConditions.price = {
      gte: minPrice,
      lte: maxPrice,
    };
  }

  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  if (startDate && endDate) {
    filterConditions.createdAt = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;

  try {
    const jobs = await prisma.job.findMany({
      where: filterConditions,
      take: limit,
      skip,
      include: {
        category: true,
        user: {
          include: {
            userProfile: true
          }
        }
      }
    });

    const totalJobs = await prisma.job.count({
      where: filterConditions,
    });

    console.log("Jobs retrieved successfully:", jobs.length);

    return Response.json({
      docs: jobs,
      totalDocs: totalJobs,
      page,
      limit,
      totalPages: Math.ceil(totalJobs / limit),
    });
  } catch (error) {
    console.error("Error in GET handler:", error);
    throw error;
  }
}, { useAuth: false });



