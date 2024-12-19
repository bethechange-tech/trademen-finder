import { Job, User, UserProfile, Category, Application, ExperienceDetail } from "@prisma/client";

export type Filters = {
    employmentType: Option | null;
    keyword: string;
    location: Option | null;
    salary: Option | null;
    catergory: Option | null;
    startDate: Date | null;
    endDate: Date | null;
};

export type ExtendedUserProfile = UserProfile & { experienceDetails: ExperienceDetail[] }
export type ExtendedUser = User & { userProfile: ExtendedUserProfile }
export type ExtendedApplication = Application & { applicant: ExtendedUser; job: ExtendedJob }
export type ExtendedJob = Job & { applications: ExtendedApplication[], shortList: ExtendedUser, category: Category }