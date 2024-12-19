"use client"
import { useEffect, useState } from "react";
import Filters from "@/components/Filters";
import JobCard from "@/components/JobCard";
import { useRouter } from "next/navigation";

const jobsData = [
    {
        id: "1",
        title: "Fix Leaky Faucet",
        description: "Plumber needed to fix a faucet in the kitchen.",
        budget: 150,
        location: "London",
        type: "Plumbing",
        status: "Open",
        postedAt: new Date().toISOString(),
    },
    {
        id: "2",
        title: "Electrical Wiring Fix",
        description: "Electrician needed to rewire a room.",
        budget: 300,
        location: "Manchester",
        type: "Electrical",
        status: "Open",
        postedAt: new Date().toISOString(),
    },
];

type Job = {
    id: string;
    title: string;
    description: string;
    budget: number;
    location: string;
    type: string;
    status: string;
    postedAt: string;
};

const HomePage = () => {
    const router = useRouter();

    const [jobs, setJobs] = useState<Job[]>(jobsData);
    const [isFilterVisible, setIsFilterVisible] = useState(false); // Controls the visibility of the filter overlay
    const [filters, setFilters] = useState<string[]>([]);
    const [sort, setSort] = useState<string>("newest");
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    const [newJob, setNewJob] = useState<Job>({
        id: "",
        title: "",
        description: "",
        budget: 0,
        location: "",
        type: "",
        status: "Open",
        postedAt: new Date().toISOString(),
    });

    // Fetch jobs on initial render and when filters/sort change
    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams({
            sort,
            filters: filters.join(","),
        });

        router.push(`/jobs?${params.toString()}`);
        setLoading(false);
    }, [filters, sort]);

    const handleCreateJob = () => {
        setJobs((prevJobs) => [
            ...prevJobs,
            { ...newJob, id: (prevJobs.length + 1).toString() },
        ]);
        setIsModalOpen(false);
        setNewJob({
            id: "",
            title: "",
            description: "",
            budget: 0,
            location: "",
            type: "",
            status: "Open",
            postedAt: new Date().toISOString(),
        });
    };

    return (
        <>
            {/* Create Job Button */}
            <div className="flex justify-center mt-6">
                <button
                    className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow hover:bg-blue-600 transition"
                    onClick={() => setIsModalOpen(true)}
                >
                    Create Job
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4 sm:p-8">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg sm:max-w-xl lg:max-w-2xl">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center border-b pb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Create a New Job</h2>
                            <button
                                className="text-gray-500 hover:text-gray-700 transition"
                                onClick={() => setIsModalOpen(false)}
                                aria-label="Close Modal"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="mt-6 space-y-6">
                            {/* Title Field */}
                            <div>
                                <label
                                    htmlFor="title"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Job Title
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    placeholder="e.g., Fix Leaky Faucet"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={newJob.title}
                                    onChange={(e) =>
                                        setNewJob((prev) => ({ ...prev, title: e.target.value }))
                                    }
                                />
                            </div>

                            {/* Description Field */}
                            <div>
                                <label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    placeholder="Provide details about the job..."
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={newJob.description}
                                    onChange={(e) =>
                                        setNewJob((prev) => ({ ...prev, description: e.target.value }))
                                    }
                                ></textarea>
                            </div>

                            {/* Budget Field */}
                            <div className="sm:flex sm:space-x-4">
                                <div className="sm:w-1/2">
                                    <label
                                        htmlFor="budget"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Budget (£)
                                    </label>
                                    <input
                                        id="budget"
                                        type="number"
                                        placeholder="e.g., 150"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={newJob.budget}
                                        onChange={(e) =>
                                            setNewJob((prev) => ({ ...prev, budget: +e.target.value }))
                                        }
                                    />
                                </div>

                                {/* Location Field */}
                                <div className="sm:w-1/2 mt-4 sm:mt-0">
                                    <label
                                        htmlFor="location"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Location
                                    </label>
                                    <input
                                        id="location"
                                        type="text"
                                        placeholder="e.g., London"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={newJob.location}
                                        onChange={(e) =>
                                            setNewJob((prev) => ({ ...prev, location: e.target.value }))
                                        }
                                    />
                                </div>
                            </div>

                            {/* Job Type Field */}
                            <div>
                                <label
                                    htmlFor="type"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Job Type
                                </label>
                                <div className="relative">
                                    <select
                                        id="type"
                                        className="block w-full border border-gray-300 rounded-lg bg-white px-4 py-2 pr-10 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-200 appearance-none"
                                        value={newJob.type}
                                        onChange={(e) =>
                                            setNewJob((prev) => ({ ...prev, type: e.target.value }))
                                        }
                                    >
                                        <option value="" disabled>
                                            Select a job type
                                        </option>
                                        <option value="Plumbing">Plumbing</option>
                                        <option value="Electrical">Electrical</option>
                                        <option value="Carpentry">Carpentry</option>
                                        <option value="Painting">Painting</option>
                                        <option value="Other">Other</option>
                                    </select>

                                    {/* Dropdown Icon */}
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg
                                            className="w-5 h-5 text-gray-400"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 01.02-1.06z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="mt-8 flex justify-end space-x-4">
                            <button
                                className="bg-gray-200 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-300 transition duration-200"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-200"
                                onClick={handleCreateJob}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {!isFilterVisible && <div className="flex justify-center mt-6 lg:hidden">
                <button
                    className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow hover:bg-blue-600 transition"
                    onClick={() => setIsFilterVisible(true)}
                    aria-label="Show Filters"
                >
                    Show Filters
                </button>
            </div>}

            <div className="container mx-auto px-4 py-8 flex flex-wrap lg:flex-nowrap space-y-6 lg:space-y-0 lg:space-x-8">
                {/* Filters */}
                <Filters
                    filters={filters}
                    setFilters={setFilters}
                    isFilterVisible={isFilterVisible}
                    setIsFilterVisible={setIsFilterVisible}
                />

                {/* Job Listings */}
                <main className="flex-1">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white p-4 shadow rounded-lg mt-3">
                        {/* Jobs Found Text */}
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
                            {loading ? (
                                <span className="text-gray-500 animate-pulse">Loading...</span>
                            ) : (
                                <span>{`${jobs.length} Jobs Found`}</span>
                            )}
                        </h2>

                        {/* Sort Dropdown */}
                        <div className="relative">
                            <select
                                className="appearance-none border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                            >
                                <option value="newest">Sort by: Newest Post</option>
                                <option value="oldest">Sort by: Oldest Post</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg
                                    className="w-5 h-5 text-gray-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 01.02-1.06z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Job Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                </main>
            </div>
        </>
    );
};

export default HomePage;
