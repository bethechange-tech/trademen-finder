"use client";
import 'react-datepicker/dist/react-datepicker.css';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import queryString from "query-string";
import DatePicker from "react-datepicker";
import { State } from "country-state-city";
import { CustomTypeHead, Option } from "@/components/CustomTypeHead";
import { CustomSelect } from "@/components/CustomSelect";
import { faPoundSign, faBriefcase, faMapMarkerAlt, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FilterModal from '@/components/FilterModal';
import { Filters } from '@/types';
import { categories } from '@/percs';
import JobCard from '@/components/JobCard';
import { ExtendedJobs } from '@/app/_utilities/actions';

const stateOptions: Option[] = State.getStatesOfCountry('GB')?.map((state: { name: string; }) => ({
    value: state.name,
    label: state.name,
})) || [];

const priceRangeOptions: Option[] = [
    { label: '£50 - £100', value: '50-100' },
    { label: '£100 - £200', value: '100-200' },
    { label: '£200 - £300', value: '200-300' },
    { label: '£300 - £400', value: '300-400' },
    { label: '£400 - £500', value: '400-500' },
    { label: '£500 - £600', value: '500-600' },
    { label: '£600 - £700', value: '600-700' },
    { label: '£700 - £800', value: '700-800' },
    { label: '£800 - £900', value: '800-900' },
    { label: '£900 - £1,000', value: '900-1000' },
];

const employmentTypeOptions: Option[] = categories.map((category) => ({ value: category.name.toLowerCase(), label: category.name }))

const JobSearch: React.FC<{
    jobs: ExtendedJobs[]
}> = ({ jobs: initialJobs }) => {
    const [jobs, setJobs] = useState<ExtendedJobs[]>([]);
    const [filters, setFilters] = useState<Filters>({
        keyword: "",
        location: null,
        salary: null,
        catergory: null,
        employmentType: null,
        startDate: null,
        endDate: null,
    });
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const router = useRouter();


    useEffect(() => {
        setJobs(initialJobs)
    }, [initialJobs])

    const handleFilterChange = (field: any, value: any) => {
        setFilters((prevFilters: any) => ({
            ...prevFilters,
            [field]: value,
        }));
    };

    const handleDateRangeChange = (dates: [Date | null, Date | null]) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };

    const handleApplyFilters = () => {
        const params = new URLSearchParams();
        if (filters.keyword) params.append('keyword', filters.keyword);
        if (filters.location) params.append('location', filters.location.value);
        if (endDate) params.append('endDate', endDate.toISOString());
        if (startDate) params.append('startDate', startDate.toISOString());

        if (filters.salary) {
            const [minPrice, maxPrice] = filters.salary.value.split('-');
            if (minPrice) params.append('minPrice', minPrice);
            if (maxPrice) params.append('maxPrice', maxPrice);
        };

        if (filters.catergory) params.append('catergory', String(filters.catergory.value));
        if (filters.startDate) params.append('startDate', filters.startDate.toISOString());
        if (filters.endDate) params.append('endDate', filters.endDate.toISOString());

        const query = queryString.stringify(Object.fromEntries(params));
        router.push(`?${query}`);
    };

    const handleClearFilters = () => {
        setFilters({
            keyword: "",
            location: null,
            salary: null,
            catergory: null,
            employmentType: null,
            startDate: null,
            endDate: null,
        });
        router.push(`?`);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
            {/* Search and Filters */}
            <div className="w-full bg-white p-6 border-b shadow-lg lg:hidden">
                <button
                    onClick={() => setIsFilterModalOpen(true)}
                    className="w-full px-6 py-2 mb-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-300"
                >
                    Show Filters
                </button>
            </div>

            <div className="w-full bg-white p-6 border-b shadow-lg hidden lg:block">
                <div className="mb-8">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="🔍 Search for jobs by keyword or title"
                            value={filters.keyword}
                            onChange={(e) =>
                                handleFilterChange("keyword", e.target.value)
                            }
                            className="w-full p-4 pl-12 border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition ease-in-out duration-300"
                        />
                        <span className="absolute left-4 top-4 text-gray-400">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M9 3a7 7 0 106.446 10.032l4.226 4.226a1 1 0 01-1.414 1.414l-4.226-4.226A7 7 0 009 3zM4 9a5 5 0 1110 0 5 5 0 01-10 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </span>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 mt-6">
                        <CustomTypeHead
                            options={stateOptions}
                            value={filters.location}
                            onChange={(value) =>
                                handleFilterChange("location", value)
                            }
                            placeholder="📍 Select a city"
                            icon={faMapMarkerAlt}
                        />
                        <CustomSelect
                            options={priceRangeOptions}
                            value={filters.salary}
                            onChange={(value) =>
                                handleFilterChange("salary", value)
                            }
                            placeholder="💰 Salary"
                            icon={faPoundSign}
                        />
                        <CustomSelect
                            options={employmentTypeOptions}
                            value={filters.catergory}
                            onChange={(value) =>
                                handleFilterChange(
                                    "catergory",
                                    value
                                )
                            }
                            placeholder="💼 Employment Type"
                            icon={faBriefcase}
                        />
                        <div className="relative">
                            <DatePicker
                                selected={startDate as Date}
                                onChange={handleDateRangeChange}
                                startDate={startDate as Date}
                                endDate={endDate as Date}
                                minDate={new Date('2020-01-01')}
                                selectsRange
                                placeholderText="📅 Date Range"
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition ease-in-out duration-300"
                            />
                            <span className="absolute right-3 top-3 text-gray-400">
                                <FontAwesomeIcon icon={faCalendarAlt} />
                            </span>
                        </div>

                        <button
                            onClick={handleApplyFilters}
                            className="w-full px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-300"
                        >
                            Apply Filters
                        </button>
                        <button
                            onClick={handleClearFilters}
                            className="w-full px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition ease-in-out duration-300"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Job Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                ))}
            </div>

            {/* Filter Modal (Visible on Mobile Only) */}
            <FilterModal
                filters={filters}
                startDate={startDate}
                endDate={endDate}
                stateOptions={stateOptions}
                priceRangeOptions={priceRangeOptions}
                employmentTypeOptions={employmentTypeOptions}
                onFilterChange={handleFilterChange}
                isFilterModalOpen={isFilterModalOpen}
                onDateRangeChange={handleDateRangeChange}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
                onClose={() => setIsFilterModalOpen(false)}
            />


            {/* Adding the UserList component at the bottom */}
            {/* <UserList users={users} /> */}
        </div>
    );
};

export default JobSearch;
