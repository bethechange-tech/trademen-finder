import prisma from "@/db/prisma-client";
import { hankoTokenKey } from "@/helpers/hanko";
import AppError from "@/lib/appError";
import { ControllerUtils } from "@/lib/controller-utils";
import { HandlerFunctionWrapper } from "@/lib/handler-wrapper";


export const POST = HandlerFunctionWrapper(async (req) => {
    const hankoToken = await req.headers?.get(hankoTokenKey) || await req.cookies?.get(hankoTokenKey) || await req.headers?.get('hanko') || await req.cookies?.get('hanko');

    if (!hankoToken) {
        throw new AppError('Incorrect email or password', 401);
    }

    const {
        email,
    } = await req.json();

    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    const userProfile = await prisma.userProfile.findUnique({
        where: {
            userId: user?.id
        }
    })

    const controllerUtils = new ControllerUtils()

    return controllerUtils.createSendToken({
        req,
        user: { ...user!, ...userProfile! },
        token: hankoToken.toString(),
        cookieName: hankoTokenKey,
    })
})