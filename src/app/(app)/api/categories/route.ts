import prisma from "@/db/prisma-client";
import { HandlerFunctionWrapper } from "@/lib/handler-wrapper";

export const GET = HandlerFunctionWrapper(async () => {
    console.log("Request received for retrieving categories");

    const categories = await prisma.category.findMany({});

    console.log("categories retrieved successfully:", categories);

    return new Response(
        JSON.stringify(categories),
        { status: 200, headers: { "Content-Type": "application/json" } }
    );

}, { useAuth: false });