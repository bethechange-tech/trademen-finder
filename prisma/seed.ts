import { categoriesData as data } from '@/data/categories';
import { PrismaClient, $Enums } from '@prisma/client'

const prisma = new PrismaClient()

async function initializeData() {
    console.log("Checking for existing users...");

    const adminUser = await prisma.user.upsert({
        where: { email: process.env.DEFAULT_ADMIN_USERNAME! }, // Check if the user exists by email
        update: {}, // No fields to update if the user already exists
        create: {
            email: process.env.DEFAULT_ADMIN_USERNAME!,
            password: process.env.DEFAULT_ADMIN_PASSWORD!,
            isAdmin: true,
            userProfile: {
                create: {
                    firstName: "Admin",
                    lastName: "User",
                    fullName: "Admin User",
                    email: process.env.DEFAULT_ADMIN_USERNAME!,
                    phone: "1234567890", // Placeholder value
                    address: "Default Address", // Placeholder value
                    state: "Default State", // Placeholder value
                    postalCode: "00000", // Placeholder value
                    city: "Default City", // Placeholder value
                    country: "Default Country", // Placeholder value
                    jobTitle: "Administrator",
                    experience: "N/A", // Placeholder value
                    education: "N/A", // Placeholder value
                    skills: "Leadership",
                    bio: "Admin user for the system.",
                    profilePicture: "https://via.placeholder.com/100", // Placeholder value
                },
            },
        },
    });

    console.log("Admin user upserted:", adminUser);

    // console.log("Admin user created:", adminUser);

    const categoriesData = await Promise.all(
        data.map(async (cat) => {
            return prisma.category.upsert({
                where: { name: cat.title }, // Match category by unique name
                update: {
                    description: cat.description,
                    imageUrl: cat.imageUrl,
                },
                create: {
                    name: cat.title,
                    description: cat.description,
                    imageUrl: cat.imageUrl,
                },
            });
        })
    );

    console.log("Categories upserted:", categoriesData);


    if (categoriesData.length === 0) {
        console.log("No categories found. Add categories first.");
        return;
    }
    // Generate sample jobs
    const sampleJobs = Array.from({ length: 30 }).map((_, i) => {
        const randomCategoryIndex = Math.floor(Math.random() * categoriesData.length);
        const selectedCategory = categoriesData[randomCategoryIndex]!;

        return {
            title: `Job Title ${i + 1}`,
            years: `${i + 1}`,
            description: `Description for Job ${i + 1}`,
            city: "London",
            image: "https://via.placeholder.com/100",
            categoryId: selectedCategory.id, // Use categoryId instead of category object
            price: Math.floor(Math.random() * 1000) + 500, // Random price between 500 and 1500
            userId: adminUser.id, // Assigning the job to the admin user
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week later
            status: $Enums.JobStatus.OPEN
        };
    });

    console.log("Creating 30 sample jobs...");

    for (const job of sampleJobs) {
        await prisma.job.upsert({
            where: {
                title: job.title // Use a unique identifier (e.g., title) for upsert condition
            },
            update: {
                description: job.description,
                categoryId: job.categoryId,
                price: job.price,
                city: job.city,
                years: job.years,
                image: job.image,
                startDate: new Date(job.startDate),
                endDate: job.endDate,
                userId: job.userId,
                status: $Enums.JobStatus.OPEN
            },
            create: {
                title: job.title,
                description: job.description,
                categoryId: job.categoryId,
                price: job.price,
                city: job.city,
                years: job.years,
                image: job.image,
                startDate: job.startDate,
                endDate: job.endDate,
                userId: job.userId,
                status: $Enums.JobStatus.OPEN
            },
        });
    }


    console.log("30 sample jobs created.", await prisma.job.findMany());

}

// Call this function to initialize data
initializeData().catch((error) => {
    console.error("Error during initialization:", error);
});
