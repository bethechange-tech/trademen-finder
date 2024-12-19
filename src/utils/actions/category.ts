import tradesMenRequest from "@/lib/requesters";
import { Category } from "@prisma/client";

export const getCategories = async () => {
    try {
        const response = await tradesMenRequest.get<Category[]>(
            `/api/categories`,
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return null;
    }
};