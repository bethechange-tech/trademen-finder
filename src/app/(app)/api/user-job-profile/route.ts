import prisma from "@/db/prisma-client";
import { HandlerFunctionWrapper } from "@/lib/handler-wrapper";
import { streamToBuffer } from "@/lib/streamToBuffer";
import { uploadFiles } from "@/services/adapters";
import { ExperienceDetail } from "@prisma/client";
import { NextRequest } from "next/server";

export const POST = HandlerFunctionWrapper(async (req, _res, session) => {
    console.log("Request received for user profile upsert.");

    const formData = await req.formData();
    console.log("FormData received:", formData);

    const files: Buffer[] = [];
    const file = formData.get('image') as File;

    if (file) {
        const fileStream = file?.stream();
        const fileBuffer = await streamToBuffer(fileStream);
        files.push(fileBuffer);
    }

    const urls = files.length > 0 ? await uploadFiles({ files }) : [];
    const profilePicture = urls[0] || null;

    const experienceDetails: ExperienceDetail[] = JSON.parse(formData.get('experienceDetails')?.toString() || '[]');

    const profileBody = {
        firstName: formData.get('firstName')?.toString() || '',
        lastName: formData.get('lastName')?.toString() || '',
        fullName: `${formData.get('firstName')?.toString()} ${formData.get('lastName')?.toString()}` || '',
        email: formData.get('email')?.toString() || '',
        phone: formData.get('phone')?.toString() || '',
        city: formData.get('city')?.toString() || '',
        jobTitle: formData.get('jobTitle')?.toString() || '',
        experience: formData.get('experience')?.toString() || '',
        education: formData.get('education')?.toString() || '',
        skills: formData.get('skills')?.toString() || '',
        bio: formData.get('bio')?.toString() || '',
        state: formData.get('state')?.toString() || '',
        address: formData.get('address')?.toString() || '',
        postalCode: formData.get('postalCode')?.toString() || '',
        country: formData.get('country')?.toString() || '',
    };

    console.log("Parsed profile body:", profileBody);

    try {
        console.log("Checking for existing user profile...");
        const existingProfile = await prisma.userProfile.findFirst({
            where: {
                user: {
                    authProviderId: session?.authProviderId,
                },
            },
            include: {
                experienceDetails: true,
            },
        });


        let profileEntry;

        if (existingProfile) {
            console.log("Updating existing user profile...");
            profileEntry = await prisma.userProfile.update({
                where: {
                    id: existingProfile.id,
                },
                data: {
                    ...profileBody,
                    profilePicture: profilePicture || existingProfile.profilePicture,
                    experienceDetails: {
                        deleteMany: {}, // Remove all existing details
                        create: experienceDetails.map((detail) => ({
                            companyName: detail.companyName,
                            role: detail.role,
                            duration: detail.duration,
                            location: detail.location,
                            initial: detail.initial,
                            color: detail.color,
                        })),
                    },
                },
            });
            console.log("User profile updated:", profileEntry);
        } else {
            console.log("Creating a new user profile...");
            profileEntry = await prisma.userProfile.create({
                data: {
                    ...profileBody,
                    profilePicture: String(profilePicture),
                    user: {
                        create: { email: profileBody.email, authProviderId: session?.authProviderId },
                    },
                    experienceDetails: {
                        create: experienceDetails.map((detail) => ({
                            companyName: detail.companyName,
                            role: detail.role,
                            duration: detail.duration,
                            location: detail.location,
                            initial: detail.initial,
                            color: detail.color,
                        })),
                    },
                },
            });
            console.log("User profile created:", profileEntry);
        }

        return Response.json({
            profile: profileEntry,
        });
    } catch (error) {
        console.error("Error encountered:", error);
        return new Response("An error occurred while upserting the user profile", { status: 500 });
    }
}, { useAuth: true });

export const PUT = HandlerFunctionWrapper(async (req: NextRequest) => {
    console.log("Request received for user profile update.");

    const formData = await req.formData();
    console.log("FormData received:", formData);

    const files: Buffer[] = [];
    const file = formData.get('image') as File;

    if (file) {
        const fileStream = file.stream();
        const fileBuffer = await streamToBuffer(fileStream);
        files.push(fileBuffer);
    }

    const urls = files.length > 0 ? await uploadFiles({ files }) : [];
    const profilePicture = urls[0] || '';

    const experienceDetails: ExperienceDetail[] = JSON.parse(formData.get('experienceDetails')?.toString() || '[]');

    const profileBody = {
        id: parseInt(formData.get('id')?.toString() || '', 10),
        firstName: formData.get('firstName')?.toString() || '',
        lastName: formData.get('lastName')?.toString() || '',
        email: formData.get('email')?.toString() || '',
        phone: formData.get('phone')?.toString() || '',
        city: formData.get('city')?.toString() || '',
        jobTitle: formData.get('jobTitle')?.toString() || '',
        experience: formData.get('experience')?.toString() || '',
        education: formData.get('education')?.toString() || '',
        skills: formData.get('skills')?.toString() || '',
        bio: formData.get('bio')?.toString() || '',
        profilePicture,
    };

    console.log("Parsed profile body:", profileBody);

    try {
        console.log("Updating user profile...");
        const updatedProfile = await prisma.userProfile.update({
            where: {
                id: profileBody.id,
            },
            data: {
                ...profileBody,
                experienceDetails: {
                    deleteMany: {}, // Delete all existing related experienceDetails
                    create: experienceDetails.map((detail) => ({
                        companyName: detail.companyName,
                        role: detail.role,
                        duration: detail.duration,
                        location: detail.location,
                        initial: detail.initial,
                        color: detail.color,
                    })),
                },
            },
        });

        console.log("User profile updated:", updatedProfile);

        return Response.json({
            profile: updatedProfile,
        });
    } catch (error) {
        console.error('Error encountered:', error);
        return new Response('An error occurred while updating the user profile', { status: 500 });
    }
}, { useAuth: true });


export const GET = HandlerFunctionWrapper(async (_req, _res, session) => {
    console.log("Request received for fetching user profiles");

    if (!session?.authProviderId) {
        return new Response('User authentication is required', { status: 401 });
    }

    try {
        console.log("Fetching user profile for user ID:", session?.authProviderId);

        const profile = await prisma.userProfile.findFirst({
            where: {
                user: {
                    authProviderId: session?.authProviderId,
                },
            },
            include: {
                experienceDetails: true,
            },
        });


        if (!profile) {
            return new Response('User profile not found', { status: 404 });
        }

        console.log("User profile fetched successfully:", profile);

        return Response.json({
            profile,
        });
    } catch (error) {
        console.error("Error in GET handler:", error);
        return new Response('An error occurred while fetching user profiles', { status: 500 });
    }
}, { useAuth: true });
