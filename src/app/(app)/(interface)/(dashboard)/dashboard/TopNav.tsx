import React from 'react';

const TopNav = () => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 p-4 bg-white shadow rounded-lg">
            {/* Search Bar */}
            <div className="flex items-center space-x-2 md:space-x-4 mb-4 md:mb-0">
                <input
                    type="text"
                    placeholder="Search..."
                    className="px-4 py-2 w-full md:w-auto rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                />
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-150 ease-in-out">
                    Search
                </button>
            </div>

            {/* Additional Controls */}
            <div className="flex items-center space-x-2 md:space-x-4">
                <span className="text-sm text-gray-600">Monday 6th March</span>
                <button className="relative p-2 rounded-lg hover:bg-gray-100 transition duration-150 ease-in-out">
                    <svg
                        className="h-6 w-6 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 12h14M12 5l7 7-7 7"
                        />
                    </svg>
                </button>
                <button className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition duration-150 ease-in-out">
                    Card
                </button>
            </div>
        </div>
    );
};

export default TopNav;
