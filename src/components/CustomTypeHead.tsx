"use client";

import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, AnimatePresence } from "framer-motion";

export interface Option {
    label: string;
    value: string;
}

export interface CustomTypeHeadProps {
    options: Option[];
    value: Option['value'] | null;
    onChange: (option: Option) => void;
    placeholder: string;

    icon: any;
}

export const CustomTypeHead: React.FC<CustomTypeHeadProps> = ({
    options,
    value,
    onChange,
    placeholder,
    icon,
}) => {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value || "");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleToggle = () => setOpen(!open);
    const handleOptionClick = (option: Option) => {
        onChange(option);
        setOpen(false);
        setInputValue(option.label);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
    );

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <div className="flex items-center">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onClick={handleToggle}
                    placeholder={placeholder}
                    className="w-full p-3 border border-gray-400 rounded-lg text-gray-700 font-medium shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
                />
                {icon && (
                    <FontAwesomeIcon
                        icon={icon}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
                )}
            </div>
            <AnimatePresence>
                {open && (
                    <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-0 right-0 mt-2 bg-white shadow-xl rounded-lg py-2 z-50 max-h-60 overflow-y-auto border border-gray-400"
                        role="listbox"
                    >
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <li
                                    key={option.value}
                                    onClick={() => handleOptionClick(option)}
                                    className={`px-4 py-2 hover:bg-indigo-100 cursor-pointer transition-colors duration-200 ${value === option.value ? "bg-indigo-50 font-semibold" : ""}`}
                                    role="option"
                                    aria-selected={value === option.value}
                                >
                                    {option.label}
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-gray-500 cursor-not-allowed">
                                No results found
                            </li>
                        )}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};
