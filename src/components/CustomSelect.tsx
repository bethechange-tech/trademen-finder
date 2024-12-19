"use client";

import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, AnimatePresence } from "framer-motion";

export interface Option {
    label: string;
    value: string;
}

export interface CustomSelectProps {
    options: Option[];
    value: Option | null;
    onChange: (option: Option) => void;
    placeholder: string;

    icon: any;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
    options,
    value,
    onChange,
    placeholder,
    icon,
}) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleToggle = () => setOpen(!open);
    const handleOptionClick = (option: Option) => {
        onChange(option);
        setOpen(false);
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

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                onClick={handleToggle}
                className="flex items-center justify-between w-full p-3 border border-gray-400 rounded-lg text-gray-700 font-medium shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
                aria-haspopup="listbox"
                aria-expanded={open ? "true" : "false"}
            >
                <span className="truncate">{value ? value.label : placeholder}</span>
                {icon && (
                    <FontAwesomeIcon icon={icon} className="text-gray-500 ml-2" />
                )}
            </button>
            <AnimatePresence>
                {open && (
                    <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-0 right-0 mt-2 bg-white shadow-xl rounded-lg py-2 z-50 max-h-60 overflow-y-auto border border-gray-400"
                        role="listbox"
                    >
                        {options.map((option) => (
                            <li
                                key={option.value}
                                onClick={() => handleOptionClick(option)}
                                className={`px-4 py-2 hover:bg-indigo-100 cursor-pointer transition-colors duration-200 ${value?.value === option.value ? "bg-indigo-50 font-semibold" : ""}`}
                                role="option"
                                aria-selected={value?.value === option.value}
                            >
                                <span className="truncate">{option.label}</span>
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};
