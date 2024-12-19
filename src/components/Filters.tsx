import React, { SetStateAction, useState } from "react";

type FiltersProps = {
    filters: string[];
    setFilters: React.Dispatch<React.SetStateAction<string[]>>;
    isFilterVisible: boolean;
    setIsFilterVisible: (value: SetStateAction<boolean>) => void;
};

const jobTypes = ["Plumbing", "Electrical", "Carpentry", "Painting"];
const jobStatuses = ["Open", "In Progress", "Completed"];

const Filters: React.FC<FiltersProps> = ({
    filters,
    setFilters,
    isFilterVisible,
    setIsFilterVisible
}) => {
    const [isJobTypeCollapsed, setIsJobTypeCollapsed] = useState(false);
    const [isJobStatusCollapsed, setIsJobStatusCollapsed] = useState(false);

    const toggleFilter = (filter: string) => {
        setFilters((prev) =>
            prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
        );
    };

    const clearFilters = () => {
        setFilters([]);
    };

    return (
        <>

            {/* Filter Overlay for Mobile */}
            {isFilterVisible && (
                <div className="fixed inset-0 z-20 bg-white shadow-lg lg:hidden overflow-y-auto transition-transform duration-300">
                    {/* Close Button */}
                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-xl font-bold text-gray-800">Filters</h2>
                        <button
                            className="text-red-500 font-semibold text-lg hover:underline"
                            onClick={() => setIsFilterVisible(false)}
                            aria-label="Close Filters"
                        >
                            Close
                        </button>
                    </div>

                    {/* Filters Content */}
                    <div className="p-6">
                        {/* Job Type Filter */}
                        <div className="mb-8">
                            <div
                                className="flex justify-between items-center cursor-pointer"
                                onClick={() => setIsJobTypeCollapsed((prev) => !prev)}
                            >
                                <h3 className="text-lg font-semibold text-gray-700">Job Type</h3>
                                <span
                                    className={`text-gray-500 transition-transform ${isJobTypeCollapsed ? "rotate-180" : "rotate-0"
                                        }`}
                                >
                                    ▼
                                </span>
                            </div>
                            {!isJobTypeCollapsed && (
                                <div className="space-y-3 mt-4">
                                    {jobTypes.map((type) => (
                                        <label
                                            key={type}
                                            className="flex items-center cursor-pointer group"
                                            aria-label={`Filter by ${type}`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="mr-3 h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500 rounded transition-all duration-200"
                                                checked={filters.includes(type)}
                                                onChange={() => toggleFilter(type)}
                                            />
                                            <span className="text-gray-600 group-hover:text-blue-600 transition-all duration-200">
                                                {type}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Job Status Filter */}
                        <div className="mb-6">
                            <div
                                className="flex justify-between items-center cursor-pointer"
                                onClick={() => setIsJobStatusCollapsed((prev) => !prev)}
                            >
                                <h3 className="text-lg font-semibold text-gray-700">Job Status</h3>
                                <span
                                    className={`text-gray-500 transition-transform ${isJobStatusCollapsed ? "rotate-180" : "rotate-0"
                                        }`}
                                >
                                    ▼
                                </span>
                            </div>
                            {!isJobStatusCollapsed && (
                                <div className="space-y-3 mt-4">
                                    {jobStatuses.map((status) => (
                                        <label
                                            key={status}
                                            className="flex items-center cursor-pointer group"
                                            aria-label={`Filter by ${status}`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="mr-3 h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500 rounded transition-all duration-200"
                                                checked={filters.includes(status)}
                                                onChange={() => toggleFilter(status)}
                                            />
                                            <span className="text-gray-600 group-hover:text-blue-600 transition-all duration-200">
                                                {status}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Reset Button */}
                        {filters.length > 0 && (
                            <div className="mt-6">
                                <button
                                    className="w-full bg-red-500 text-white font-semibold py-2 px-4 rounded shadow hover:bg-red-600 transition-all duration-200 focus:ring-2 focus:ring-red-400 focus:outline-none"
                                    onClick={clearFilters}
                                    aria-label="Reset all filters"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Filters Always Visible on Desktop */}
            <div className="hidden lg:block bg-white p-6 shadow-md rounded-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Filters</h2>

                {/* Job Type Filter */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-700">Job Type</h3>
                    <div className="space-y-3 mt-4">
                        {jobTypes.map((type) => (
                            <label
                                key={type}
                                className="flex items-center cursor-pointer group"
                                aria-label={`Filter by ${type}`}
                            >
                                <input
                                    type="checkbox"
                                    className="mr-3 h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500 rounded transition-all duration-200"
                                    checked={filters.includes(type)}
                                    onChange={() => toggleFilter(type)}
                                />
                                <span className="text-gray-600 group-hover:text-blue-600 transition-all duration-200">
                                    {type}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Job Status Filter */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700">Job Status</h3>
                    <div className="space-y-3 mt-4">
                        {jobStatuses.map((status) => (
                            <label
                                key={status}
                                className="flex items-center cursor-pointer group"
                                aria-label={`Filter by ${status}`}
                            >
                                <input
                                    type="checkbox"
                                    className="mr-3 h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500 rounded transition-all duration-200"
                                    checked={filters.includes(status)}
                                    onChange={() => toggleFilter(status)}
                                />
                                <span className="text-gray-600 group-hover:text-blue-600 transition-all duration-200">
                                    {status}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </>

    );
};

export default Filters;
