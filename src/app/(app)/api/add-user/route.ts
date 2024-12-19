import prisma from "@/db/prisma-client";
import { ExperienceDetail } from '@prisma/client';
import AppError from "@/lib/appError";
import { ControllerUtils } from "@/lib/controller-utils";
import { HandlerFunctionWrapper } from "@/lib/handler-wrapper";
import { streamToBuffer } from "@/lib/streamToBuffer";
import { uploadFiles } from "@/services/adapters";
import { hankoTokenKey } from "@/helpers/hanko";

export const POST = HandlerFunctionWrapper(async (req) => {
    const hankoToken =
        req.headers?.get(hankoTokenKey) ||
        req.cookies?.get(hankoTokenKey) ||
        req.headers?.get('hanko') ||
        req.cookies?.get('hanko');

    if (!hankoToken) {
        throw new AppError('Incorrect email or password', 401);
    }

    const formData = await req.formData();
    console.log("FormData received:", formData);

    // Handle image upload
    const files: Buffer[] = [];
    const file = formData.get("image") as File | null;
    if (file) {
        const fileStream = file.stream();
        const fileBuffer = await streamToBuffer(fileStream);
        files.push(fileBuffer);
    }

    // Upload to your external service if applicable
    const urls = files.length > 0 ? await uploadFiles({ files }) : [];
    const profilePicture = urls[0] || null;

    // Parse the experience details from formData
    const experienceDetails: ExperienceDetail[] = JSON.parse(
        formData.get("experienceDetails")?.toString() || "[]"
    );

    // Build the userProfile data object
    const profileBody = {
        firstName: formData.get("firstName")?.toString() || "",
        lastName: formData.get("lastName")?.toString() || "",
        fullName:
            `${formData.get("firstName")?.toString()} ${formData.get("lastName")?.toString()}`.trim(),
        email: formData.get("email")?.toString() || "",
        phone: formData.get("phone")?.toString() || "",
        city: formData.get("city")?.toString() || "",
        jobTitle: formData.get("jobTitle")?.toString() || "",
        experience: formData.get("experience")?.toString() || "",
        education: formData.get("education")?.toString() || "",
        skills: formData.get("skills")?.toString() || "",
        address: formData.get("address")?.toString() || "",
        bio: formData.get("bio")?.toString() || "",
        state: formData.get("state")?.toString() || "",
        postalCode: formData.get("postalCode")?.toString() || "",
        country: formData.get("country")?.toString() || "",
        providerId: formData.get("providerId")?.toString() || "",
    };

    const user = await prisma.user.upsert({
        where: { email: profileBody.email },
        create: {
            authProviderId: profileBody.providerId,
            email: profileBody.email,
        },
        update: {
            authProviderId: profileBody.providerId,
            email: profileBody.email,
        }
    });

    // Upsert the profile by userId
    // If it doesn't exist, create it. If it does, update it.
    const upsertedProfile = await prisma.userProfile.upsert({
        where: {
            userId: user.id,
        },
        create: {
            ...profileBody,
            profilePicture: profilePicture ? String(profilePicture) : '',
            user: {
                connect: { id: user.id },
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
        update: {
            ...profileBody,
            // If a new image was uploaded, use it; otherwise, don't overwrite existing
            profilePicture: profilePicture ? String(profilePicture) : undefined,
            // Replace all existing experienceDetails with the new array
            experienceDetails: {
                deleteMany: {}, // removes all old details
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
        include: {
            experienceDetails: true,
        },
    });

    const controllerUtils = new ControllerUtils()

    return controllerUtils.createSendToken({
        req,
        user: { ...user, ...upsertedProfile },
        token: hankoToken.toString(),
        cookieName: hankoTokenKey,
    })
})