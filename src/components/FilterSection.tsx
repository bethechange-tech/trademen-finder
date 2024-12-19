'use client';

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CustomTypeHead, Option } from './CustomTypeHead';
import { CustomSelect } from './CustomSelect';
import { faSort, faPoundSign, faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { categories } from '@/app/data/storageCategories';
import { State } from 'country-state-city';
import queryString from 'query-string';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const stateOptions = State.getStatesOfCountry('GB')?.map((state: { isoCode: string; name: string; }) => ({ value: state.isoCode, label: state.name }));

const priceRangeOptions = [
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


const FilterSection: React.FC<{ applyFilters: (filters: Record<string, any>) => void }> = () => {
    const [selectedCity, setSelectedCity] = useState<Option | null>(null);
    const [priceRange, setPriceRange] = useState<Option | null>(null);
    const [searchTerm, setSearchTerm] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [within, setWithin] = useState<Option | null>(null);
    const [postcode, setPostcode] = useState<string>('');
    const [country, setCountry] = useState<Option | null>({ label: 'United Kingdom', value: 'uk' });

    const [secondModalOpen, setSecondModalOpen] = useState(false);

    const [expandedSections, setExpandedSections] = useState({
        price: false,
        city: false,
        category: false,
        shipping: false,
        date: false,
        location: false,
    });

    const router = useRouter();

    const handleToggle = (section: keyof typeof expandedSections) => {
        setExpandedSections((prevState) => ({
            ...prevState,
            [section]: !prevState[section],
        }));
    };

    const handleSubmit = () => {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate.toISOString());
        if (endDate) params.append('endDate', endDate.toISOString());
        if (searchTerm) params.append('searchTerm', searchTerm);
        if (selectedCategory) params.append('storageType', selectedCategory);
        if (within) params.append('within', within.value);
        if (postcode) params.append('postcode', postcode);
        if (country) params.append('country', country.value);

        const [minPrice, maxPrice] = priceRange?.value.split('-') || [];

        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);

        const existingQuery = queryString.parse(location.search);
        const updatedQuery = { ...existingQuery, ...Object.fromEntries(params), page: 1 };

        router.push(`?${queryString.stringify(updatedQuery)}`);
    };

    const handleMobileSubmit = () => {
        handleSubmit();
        setSecondModalOpen(false);
    };

    const handleDateRangeChange = (dates: [Date | null, Date | null]) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };

    const handleClearFilters = () => {
        setSelectedCity(null);
        setPriceRange(null);
        setSearchTerm(null);
        setSelectedCategory(null);
        setStartDate(null);
        setEndDate(null);
        setWithin(null);
        setPostcode('');
        setCountry({ label: 'United Kingdom', value: 'uk' });

        // Reset query parameters in the URL
        router.push(`?`);
    };

    const handleMobileClearFilters = () => {
        handleClearFilters();
    };

    const renderSectionHeader = (title: string, sectionKey: keyof typeof expandedSections) => (
        <div
            className={`accordion-toggle text-lg font-semibold mb-4 cursor-pointer flex justify-between items-center transition-colors duration-300 ${expandedSections[sectionKey] ? 'text-blue-900' : 'text-blue-800'
                }`}
            onClick={() => handleToggle(sectionKey)}
        >
            <span>{title}</span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transition-transform ${expandedSections[sectionKey] ? 'rotate-180' : ''}`}
                viewBox="0 0 20 20" fill="currentColor">
                <path
                    fillRule="evenodd"
                    d="M5 10a5 5 0 0110 0 5 5 0 01-10 0zM2 10a8 8 0 1116 0 8 8 0 01-16 0z"
                    clipRule="evenodd"
                />
            </svg>
        </div>
    );

    return (
        <>
            <aside className={`col-span-1 bg-white p-6 rounded-lg shadow-lg transition-all duration-300 ${secondModalOpen ? 'block' : 'hidden'} md:block`}>
                <h3 className="text-2xl font-extrabold mb-6 text-blue-900">Filters</h3>

                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm || ''}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-gray-50 p-3 w-full rounded-full text-sm border border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md" />
                </div>

                <div className="mb-8">
                    {renderSectionHeader('Date Range', 'date')}
                    <div className={`filter-section transition-all ${expandedSections.date ? 'max-h-96' : 'max-h-0 overflow-hidden'}`}>
                        <DatePicker
                            selected={startDate}
                            onChange={handleDateRangeChange}
                            startDate={startDate as Date}
                            endDate={endDate as Date}
                            selectsRange
                            minDate={new Date('2020-01-01')}
                            placeholderText="Select date range"
                            className="p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full transition duration-200 shadow-sm hover:shadow-md text-lg font-semibold text-blue-900"
                            popperClassName="z-50"
                            aria-label="Select date range" />
                    </div>
                </div>

                <div className="mb-8">
                    {renderSectionHeader('Price Range', 'price')}
                    <div className={`filter-section transition-all ${expandedSections.price ? 'max-h-96' : 'max-h-0 overflow-hidden'}`}>
                        <div className="flex flex-col justify-center">
                            <CustomSelect
                                options={priceRangeOptions}
                                value={priceRange}
                                onChange={setPriceRange}
                                placeholder="Price Range"
                                icon={faPoundSign} />
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    {renderSectionHeader('Location', 'location')}
                    <div className={`filter-section transition-all ${expandedSections.location ? 'max-h-96' : 'max-h-0 overflow-hidden'}`}>
                        <div className="mb-4">
                            <CustomSelect
                                options={[
                                    { label: '10 miles', value: '10' },
                                    { label: '20 miles', value: '20' },
                                    { label: '30 miles', value: '30' },
                                    { label: '40 miles', value: '40' },
                                    { label: '50 miles', value: '50' },
                                ]}
                                value={within}
                                onChange={setWithin}
                                placeholder="Within"
                                icon={faSort} />
                        </div>
                        <input
                            type="text"
                            name="postcode"
                            placeholder="Post / zip code"
                            className="p-4 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 shadow-sm hover:shadow-md text-blue-900"
                            value={postcode}
                            onChange={(e) => setPostcode(e.target.value)} />
                        <div className="mt-4">
                            <CustomSelect
                                options={[{ label: 'United Kingdom', value: 'uk' }]}
                                value={country}
                                onChange={setCountry}
                                placeholder="Country"
                                icon={faSort} />
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    {renderSectionHeader('City', 'city')}
                    <div className={`filter-section transition-all ${expandedSections.city ? 'max-h-96' : 'max-h-0 overflow-hidden'}`}>
                        <CustomTypeHead
                            options={stateOptions}
                            value={selectedCity as unknown as string}
                            onChange={setSelectedCity}
                            placeholder="Select a city"
                            icon={null} />
                    </div>
                </div>

                <div className="mb-8">
                    {renderSectionHeader('Category', 'category')}
                    <div className={`filter-section transition-all ${expandedSections.category ? 'max-h-96' : 'max-h-0 overflow-hidden'}`}>
                        <ul className="max-h-40 overflow-y-auto pr-2">
                            {categories.map((category) => (
                                <li key={category.id} className="flex items-center mb-2">
                                    <input
                                        type="radio"
                                        name="category"
                                        value={category.label}
                                        onChange={() => setSelectedCategory(category.label)}
                                        checked={selectedCategory === category.label}
                                        className="mr-2 transition-all focus:ring-2 focus:ring-blue-500" />
                                    <label htmlFor={category.label} className="text-sm text-blue-900 smooth-transition">
                                        {category.label}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mb-8">
                    {renderSectionHeader('Shipping Options', 'shipping')}
                    <div className={`filter-section transition-all ${expandedSections.shipping ? 'max-h-96' : 'max-h-0 overflow-hidden'}`}>
                        <ul>
                            <li className="flex items-center mb-2">
                                <input type="checkbox" id="regular" className="mr-2 focus:ring-2 focus:ring-blue-500 transition-all" />
                                <label htmlFor="regular" className="text-sm text-blue-900 smooth-transition">Regular</label>
                            </li>
                            <li className="flex items-center mb-2">
                                <input type="checkbox" id="economical" className="mr-2 focus:ring-2 focus:ring-blue-500 transition-all" />
                                <label htmlFor="economical" className="text-sm text-blue-900 smooth-transition">Economical</label>
                            </li>
                            <li className="flex items-center mb-2">
                                <input type="checkbox" id="same-day" className="mr-2 focus:ring-2 focus:ring-blue-500 transition-all" />
                                <label htmlFor="same-day" className="text-sm text-blue-900 smooth-transition">Same Day</label>
                            </li>
                            <li className="flex items-center mb-2">
                                <input type="checkbox" id="express" className="mr-2 focus:ring-2 focus:ring-blue-500 transition-all" />
                                <label htmlFor="express" className="text-sm text-blue-900 smooth-transition">Express</label>
                            </li>
                            <li className="flex items-center mb-2">
                                <input type="checkbox" id="cargo" className="mr-2 focus:ring-2 focus:ring-blue-500 transition-all" />
                                <label htmlFor="cargo" className="text-sm text-blue-900 smooth-transition">Cargo</label>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="flex justify-between space-x-4">
                    <button
                        onClick={handleClearFilters}
                        className="w-full bg-gray-300 text-gray-800 py-3 px-4 rounded-full text-base font-medium hover:bg-gray-400 focus:ring-4 focus:ring-gray-200 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                        Clear Filters
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-full text-base font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-400 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                        Apply Filters
                    </button>
                </div>
            </aside>

            {/* Mobile Filters Button */}
            <div className="fixed bottom-5 right-4 z-20 block md:hidden">
                <button
                    className="p-4 bg-blue-500 text-white rounded-full shadow-lg focus:outline-none hover:bg-blue-600 hover:shadow-xl transition duration-200 transform hover:scale-110"
                    onClick={() => setSecondModalOpen(true)}
                    aria-label="Open Filters"
                >
                    <FontAwesomeIcon icon={faSlidersH} />
                </button>
            </div>

            {/* Mobile Filters Modal */}
            {secondModalOpen && (
                <div className="fixed inset-0 z-50 bg-white flex flex-col">
                    <div className="flex justify-between items-center p-4 bg-blue-600 text-white">
                        <h3 className="text-xl font-semibold">Filters</h3>
                        <button
                            onClick={() => setSecondModalOpen(false)}
                            className="text-white focus:outline-none"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="overflow-y-auto flex-grow p-4">
                        {/* Replicate the filter form structure here as per the original sidebar */}
                        <div className="space-y-6">
                            <div className="mb-8">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm || ''}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-gray-50 p-3 w-full rounded-full text-sm border border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md" />
                            </div>

                            <div className="mb-8">
                                {renderSectionHeader('Date Range', 'date')}
                                <div className={`filter-section transition-all ${expandedSections.date ? 'max-h-96' : 'max-h-0 overflow-hidden'}`}>
                                    <DatePicker
                                        selected={startDate}
                                        onChange={handleDateRangeChange}
                                        startDate={startDate as Date}
                                        endDate={endDate as Date}
                                        selectsRange
                                        minDate={new Date('2020-01-01')}
                                        placeholderText="Select date range"
                                        className="p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full transition duration-200 shadow-sm hover:shadow-md text-lg font-semibold text-blue-900"
                                        popperClassName="z-50"
                                        aria-label="Select date range" />
                                </div>
                            </div>

                            <div className="mb-8">
                                {renderSectionHeader('Price Range', 'price')}
                                <div className={`filter-section transition-all ${expandedSections.price ? 'max-h-96' : 'max-h-0 overflow-hidden'}`}>
                                    <div className="flex flex-col justify-center">
                                        <CustomSelect
                                            options={priceRangeOptions}
                                            value={priceRange}
                                            onChange={setPriceRange}
                                            placeholder="Price Range"
                                            icon={faPoundSign} />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                {renderSectionHeader('Location', 'location')}
                                <div className={`filter-section transition-all ${expandedSections.location ? 'max-h-96' : 'max-h-0 overflow-hidden'}`}>
                                    <div className="mb-4">
                                        <CustomSelect
                                            options={[
                                                { label: '10 miles', value: '10' },
                                                { label: '20 miles', value: '20' },
                                                { label: '30 miles', value: '30' },
                                                { label: '40 miles', value: '40' },
                                                { label: '50 miles', value: '50' },
                                            ]}
                                            value={within}
                                            onChange={setWithin}
                                            placeholder="Within"
                                            icon={faSort} />
                                    </div>
                                    <input
                                        type="text"
                                        name="postcode"
                                        placeholder="Post / zip code"
                                        className="p-4 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 shadow-sm hover:shadow-md text-blue-900"
                                        value={postcode}
                                        onChange={(e) => setPostcode(e.target.value)} />
                                    <div className="mt-4">
                                        <CustomSelect
                                            options={[{ label: 'United Kingdom', value: 'uk' }]}
                                            value={country}
                                            onChange={setCountry}
                                            placeholder="Country"
                                            icon={faSort} />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                {renderSectionHeader('City', 'city')}
                                <div className={`filter-section transition-all ${expandedSections.city ? 'max-h-96' : 'max-h-0 overflow-hidden'}`}>
                                    <CustomTypeHead
                                        options={stateOptions}
                                        value={selectedCity as unknown as string}
                                        onChange={setSelectedCity}
                                        placeholder="Select a city"
                                        icon={null} />
                                </div>
                            </div>

                            <div className="mb-8">
                                {renderSectionHeader('Category', 'category')}
                                <div className={`filter-section transition-all ${expandedSections.category ? 'max-h-96' : 'max-h-0 overflow-hidden'}`}>
                                    <ul className="max-h-40 overflow-y-auto pr-2">
                                        {categories.map((category) => (
                                            <li key={category.id} className="flex items-center mb-2">
                                                <input
                                                    type="radio"
                                                    name="category"
                                                    value={category.label}
                                                    onChange={() => setSelectedCategory(category.label)}
                                                    checked={selectedCategory === category.label}
                                                    className="mr-2 transition-all focus:ring-2 focus:ring-blue-500" />
                                                <label htmlFor={category.label} className="text-sm text-blue-900 smooth-transition">
                                                    {category.label}
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="mb-8">
                                {renderSectionHeader('Shipping Options', 'shipping')}
                                <div className={`filter-section transition-all ${expandedSections.shipping ? 'max-h-96' : 'max-h-0 overflow-hidden'}`}>
                                    <ul>
                                        <li className="flex items-center mb-2">
                                            <input type="checkbox" id="regular" className="mr-2 focus:ring-2 focus:ring-blue-500 transition-all" />
                                            <label htmlFor="regular" className="text-sm text-blue-900 smooth-transition">Regular</label>
                                        </li>
                                        <li className="flex items-center mb-2">
                                            <input type="checkbox" id="economical" className="mr-2 focus:ring-2 focus:ring-blue-500 transition-all" />
                                            <label htmlFor="economical" className="text-sm text-blue-900 smooth-transition">Economical</label>
                                        </li>
                                        <li className="flex items-center mb-2">
                                            <input type="checkbox" id="same-day" className="mr-2 focus:ring-2 focus:ring-blue-500 transition-all" />
                                            <label htmlFor="same-day" className="text-sm text-blue-900 smooth-transition">Same Day</label>
                                        </li>
                                        <li className="flex items-center mb-2">
                                            <input type="checkbox" id="express" className="mr-2 focus:ring-2 focus:ring-blue-500 transition-all" />
                                            <label htmlFor="express" className="text-sm text-blue-900 smooth-transition">Express</label>
                                        </li>
                                        <li className="flex items-center mb-2">
                                            <input type="checkbox" id="cargo" className="mr-2 focus:ring-2 focus:ring-blue-500 transition-all" />
                                            <label htmlFor="cargo" className="text-sm text-blue-900 smooth-transition">Cargo</label>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="flex justify-between space-x-4">
                            <button
                                onClick={handleMobileClearFilters}
                                className="w-full bg-gray-300 text-gray-800 py-3 px-4 rounded-full text-base font-medium hover:bg-gray-400 focus:ring-4 focus:ring-gray-200 transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                Clear Filters
                            </button>

                            <button
                                onClick={handleMobileSubmit}
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-full text-base font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-400 transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FilterSection;
