import React from "react";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import { CustomTypeHead, Option } from "@/components/CustomTypeHead";
import { CustomSelect } from "@/components/CustomSelect";
import { faPoundSign, faBriefcase, faMapMarkerAlt, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Filters } from "@/types";

type FilterModalProps = {
    filters: Filters;
    startDate: Date | null;
    isFilterModalOpen: boolean
    endDate: Date | null;
    stateOptions: Option[];
    priceRangeOptions: Option[];
    employmentTypeOptions: Option[];

    onFilterChange: (field: string, value: any) => void
    onDateRangeChange: (dates: [Date | null, Date | null]) => void;
    onApplyFilters: () => void;
    onClearFilters: () => void;
    onClose: () => void;
};

const FilterModal: React.FC<FilterModalProps> = ({
    filters,
    startDate,
    isFilterModalOpen,
    endDate,
    stateOptions,
    priceRangeOptions,
    employmentTypeOptions,
    onFilterChange,
    onDateRangeChange,
    onApplyFilters,
    onClearFilters,
    onClose
}) => {
    if (!isFilterModalOpen) return null


    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 lg:hidden"
        >
            <div className="bg-white rounded-lg w-full h-full p-6 overflow-y-auto relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 focus:outline-none text-2xl"
                >
                    &times;
                </button>
                <div className="grid grid-cols-1 gap-4 mt-12">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="🔍 Search for jobs by keyword or title"
                            value={filters.keyword}
                            onChange={(e) =>
                                onFilterChange("keyword", e.target.value)
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
                    <CustomTypeHead
                        options={stateOptions}
                        value={filters.location}
                        onChange={(value) =>
                            onFilterChange("location", value)
                        }
                        placeholder="📍 Select a city"
                        icon={faMapMarkerAlt}
                    />
                    <CustomSelect
                        options={priceRangeOptions}
                        value={filters.salary}
                        onChange={(value) =>
                            onFilterChange("salary", value)
                        }
                        placeholder="💰 Salary"
                        icon={faPoundSign}
                    />
                    <CustomSelect
                        options={employmentTypeOptions}
                        value={filters.employmentType}
                        onChange={(value) =>
                            onFilterChange("employmentType", value)
                        }
                        placeholder="💼 Employment Type"
                        icon={faBriefcase}
                    />
                    <div className="relative">
                        <DatePicker
                            selected={startDate as Date}
                            onChange={onDateRangeChange}
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

                    <div className="flex space-x-4 mt-6">
                        <button
                            onClick={onApplyFilters}
                            className="w-full px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-300"
                        >
                            Apply Filters
                        </button>
                        <button
                            onClick={onClearFilters}
                            className="w-full px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition ease-in-out duration-300"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default FilterModal;
