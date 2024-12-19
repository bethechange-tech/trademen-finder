'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import queryString from 'query-string';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage = 1, totalPages }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);


    const handlePageChange = (page: number) => {
        if (page === currentPage || page < 1 || page > totalPages) return;

        setLoading(true);
        const query = queryString.parse(location.search);
        query.page = page.toString();
        router.push(`?${queryString.stringify(query)}`);
        setLoading(false);
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;
        const startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
        const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

        if (startPage > 1) {
            pageNumbers.push(
                <li key={1}>
                    <Link
                        href={`?page=1`}
                        className="flex items-center justify-center px-2 sm:px-4 h-8 sm:h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        aria-label="Go to page 1"
                    >
                        1
                    </Link>
                </li>
            );
            if (startPage > 2) {
                pageNumbers.push(
                    <li key="ellipsis-start" className="flex items-center justify-center px-2 sm:px-4 h-8 sm:h-10 leading-tight text-gray-500 bg-white border border-gray-300">
                        ...
                    </li>
                );
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <li key={i}>
                    <Link
                        href={`?page=${i}`}
                        className={`flex items-center justify-center px-2 sm:px-4 h-8 sm:h-10 leading-tight ${i === currentPage
                            ? 'text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                            }`}
                        aria-current={i === currentPage ? 'page' : undefined}
                        aria-label={`Go to page ${i}`}
                    >
                        {i}
                    </Link>
                </li>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pageNumbers.push(
                    <li key="ellipsis-end" className="flex items-center justify-center px-2 sm:px-4 h-8 sm:h-10 leading-tight text-gray-500 bg-white border border-gray-300">
                        ...
                    </li>
                );
            }
            pageNumbers.push(
                <li key={totalPages}>
                    <Link
                        href={`?page=${totalPages}`}
                        className="flex items-center justify-center px-2 sm:px-4 h-8 sm:h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        aria-label={`Go to page ${totalPages}`}
                    >
                        {totalPages}
                    </Link>
                </li>
            );
        }

        return pageNumbers;
    };

    if (totalPages <= 1) {
        return null;
    }

    return (
        <nav aria-label="Page navigation example" className="flex flex-col sm:flex-row justify-center items-center mt-10 p-2 sm:p-4 bg-white rounded-lg shadow-lg space-y-4 sm:space-y-0 sm:space-x-4">
            <ul className="inline-flex flex-wrap justify-center -space-x-px text-xs sm:text-base h-8 sm:h-10 w-full sm:w-auto">
                <li>
                    <Link
                        href={`?page=${currentPage - 1}`}
                        className={`flex items-center justify-center px-2 sm:px-4 h-8 sm:h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === 1 || loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        aria-label="Go to previous page"
                    >
                        Previous
                    </Link>
                </li>
                {renderPageNumbers()}
                <li>
                    <Link
                        href={`?page=${currentPage + 1}`}
                        className={`flex items-center justify-center px-2 sm:px-4 h-8 sm:h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === totalPages || loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        aria-label="Go to next page"
                    >
                        Next
                    </Link>
                </li>
            </ul>
            {loading && (
                <div className="text-center mt-2">
                    <svg
                        className="animate-spin h-6 w-6 text-blue-500 inline-block"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zM2 12a10 10 0 0110-10V0a12 12 0 00-12 12h2z"
                        ></path>
                    </svg>
                    <span className="ml-2 text-blue-500">Loading...</span>
                </div>
            )}
        </nav>
    );
};

export default Pagination;
