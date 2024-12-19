import prisma from '@/db/prisma-client'
import { NextRequest, NextResponse } from 'next/server'
import { HandlerFunctionWrapper } from '@/lib/handler-wrapper'

export const GET = HandlerFunctionWrapper(async function (
    req: NextRequest,
    _res: NextResponse,
    session
) {
    const user = await prisma.user.findUnique({
        where: { authProviderId: session?.authProviderId },
        include: {
            userProfile: {
                include: { experienceDetails: true }
            }
        }
    });

    return Response.json(user, { status: 200 })
}, { useAuth: true })