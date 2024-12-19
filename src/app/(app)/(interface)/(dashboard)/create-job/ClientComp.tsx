"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { CustomTypeHead, Option } from "@/components/CustomTypeHead";
import { State } from "country-state-city";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { userStore } from "@/store/user";
import CreateProfilePrompt from "../CreateProfilePrompt";
import { createJob } from "@/utils/actions/jobs";
import { Category } from "@prisma/client";

// Types for your form data
interface FormData {
    title: string;
    jobType: string;
    years: number;
    price: string;
    city: string;
    category: number | null;
    description: string;
}

// Step definitions for clarity (optional)
enum Steps {
    BASIC_INFO = 1,
    DURATION_PRICE,
    LOCATION_CATEGORY,
    DESCRIPTION_IMAGES,
}

const ClientComp: React.FC<{ categories: Category[] | null }> = ({
    categories
}) => {
    const currentUser = userStore((state) => state.user);

    // Multi-step tracking
    const [currentStep, setCurrentStep] = useState<Steps>(Steps.BASIC_INFO);

    // Multiple images and previews
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);

    // Validation errors
    const [errors, setErrors] = useState<Record<string, string | null>>({});

    // All form data in a single state
    const [formData, setFormData] = useState<FormData>({
        title: "",
        jobType: "",
        years: 1,
        price: "",
        city: "",
        category: null,
        description: "",
    });

    // If user has no profile, show a prompt (your original code)
    if (!currentUser || !currentUser["userProfile"]) {
        return <CreateProfilePrompt />;
    }

    // Handle text/number/textarea changes
    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error for this field
    };

    // Handle multiple image selection
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        // Convert FileList to an array
        const newFilesArray = Array.from(files);

        // Update imageFiles state
        setImageFiles((prev) => [...prev, ...newFilesArray]);

        // Generate previews
        newFilesArray.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    setPreviewImages((prev) => [...prev, reader.result as string]);
                }
            };
            reader.readAsDataURL(file);
        });

        // Clear any previous image-related error
        setErrors((prev) => ({ ...prev, images: "" }));
    };

    // Remove a specific image & preview
    const removeImage = (index: number) => {
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    };

    // Handle category selection
    const handleCategorySelect = (category: number) => {
        console.log('----77----');
        console.log(typeof category);
        console.log('====77====');
        setFormData((prev) => ({ ...prev, category }));
        setErrors((prev) => ({ ...prev, category: null }));
    };

    // Validate only the relevant fields for the current step
    const validateStep = (step: Steps) => {
        const newErrors: Record<string, string> = {};

        if (step === Steps.BASIC_INFO) {
            if (!formData.title) newErrors.title = "Job title is required";
            if (!formData.jobType) newErrors.jobType = "Job type is required";
        }

        if (step === Steps.DURATION_PRICE) {
            if (formData.years < 1) {
                newErrors.years = "Years of experience must be at least 1";
            }
            if (!formData.price || parseFloat(formData.price) <= 0) {
                newErrors.price = "Price must be a positive number";
            }
        }

        if (step === Steps.LOCATION_CATEGORY) {
            if (!formData.city) newErrors.city = "City is required";
            if (!formData.category) newErrors.category = "Job category is required";
        }

        if (step === Steps.DESCRIPTION_IMAGES) {
            if (!formData.description) {
                newErrors.description = "Job description is required";
            }
            if (imageFiles.length === 0) {
                newErrors.images = "At least one image is required";
            }
        }

        setErrors(newErrors);
        // Return true if no errors
        return Object.keys(newErrors).length === 0;
    };

    // Proceed to the next step if validation passes
    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep((prev) => (prev + 1) as Steps);
        }
    };

    // Go back to the previous step
    const handleBack = () => {
        if (currentStep > Steps.BASIC_INFO) {
            setCurrentStep((prev) => (prev - 1) as Steps);
        }
    };

    // Final submission
    const handleSubmit = async (e?: FormEvent) => {
        if (e) e.preventDefault();

        // Always validate final step fields before submission
        if (!validateStep(Steps.DESCRIPTION_IMAGES)) {
            return;
        }

        // Build form data
        const data = new FormData();
        data.append("title", formData.title);
        data.append("jobType", formData.jobType);
        data.append("years", String(formData.years));
        data.append("city", formData.city);
        data.append("price", formData.price);

        console.log('----99----');
        console.log(formData.category);
        console.log('====99====');
        if (formData?.category) {
            data.append("categoryId", String(formData.category)); // Converts number to string
        }
        data.append("description", formData.description);

        // Append multiple images
        imageFiles.forEach((file) => {
            // Some servers expect 'images[]', others are fine with 'images'
            data.append("images", file);
        });

        try {
            await createJob(data)

            // Reset form
            setFormData({
                title: "",
                jobType: "",
                years: 1,
                price: "",
                city: "",
                category: null,
                description: "",
            });
            setImageFiles([]);
            setPreviewImages([]);
            setCurrentStep(Steps.BASIC_INFO);
        } catch (error) {
            console.error("Error creating job:", error);
        } finally {
            // Reset form
            // setFormData({
            //     title: "",
            //     jobType: "",
            //     years: 1,
            //     price: "",
            //     city: "",
            //     category: "",
            //     description: "",
            // });
            // setImageFiles([]);
            // setPreviewImages([]);
            // setCurrentStep(Steps.BASIC_INFO);
        }
    };

    // For city selection
    const stateOptions: Option[] =
        State.getStatesOfCountry("GB")?.map((s) => ({
            value: s.name,
            label: s.name,
        })) || [];

    // Render each step
    const renderStep = () => {
        switch (currentStep) {
            /** STEP 1: Basic Info */
            case Steps.BASIC_INFO:
                return (
                    <div>
                        <h2 className="mb-4 text-xl font-bold text-gray-800">
                            1. Basic Information
                        </h2>

                        {/* Job Title */}
                        <div className="mb-4">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Job Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Experienced Plumber"
                                className={`block w-full rounded-md border p-3 ${errors.title ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                            )}
                        </div>

                        {/* Job Type Selection */}
                        <div className="mb-4">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Job Type
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {["Contractor", "Employee", "Grant"].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        className={`flex-1 rounded-lg border py-2 px-4 text-center transition 
                      ${formData.jobType === type
                                                ? "border-indigo-500 bg-indigo-50 text-indigo-500"
                                                : "border-gray-300 bg-white"
                                            } 
                      ${errors.jobType ? "border-red-500" : ""}`}
                                        onClick={() => {
                                            setFormData({ ...formData, jobType: type });
                                            setErrors({ ...errors, jobType: "" });
                                        }}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                            {errors.jobType && (
                                <p className="text-red-500 text-sm mt-1">{errors.jobType}</p>
                            )}
                        </div>
                    </div>
                );

            /** STEP 2: Duration & Price */
            case Steps.DURATION_PRICE:
                return (
                    <div>
                        <h2 className="mb-4 text-xl font-bold text-gray-800">
                            2. Duration & Price
                        </h2>

                        {/* Years */}
                        <div className="mb-4">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Duration (Years)
                            </label>
                            <input
                                type="number"
                                name="years"
                                value={formData.years}
                                onChange={handleChange}
                                placeholder="1"
                                className={`block w-full rounded-md border p-3 ${errors.years ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors.years && (
                                <p className="text-red-500 text-sm mt-1">{errors.years}</p>
                            )}
                        </div>

                        {/* Price */}
                        <div className="mb-4">
                            <label
                                htmlFor="price"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Price (£)
                            </label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="150"
                                className={`block w-full rounded-md border p-3 ${errors.price ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors.price && (
                                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                            )}
                        </div>
                    </div>
                );

            /** STEP 3: Location & Category */
            case Steps.LOCATION_CATEGORY:
                return (
                    <div>
                        <h2 className="mb-4 text-xl font-bold text-gray-800">
                            3. Location & Category
                        </h2>

                        {/* City */}
                        <div className="mb-4">
                            <label
                                htmlFor="city"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                City
                            </label>
                            <CustomTypeHead
                                options={stateOptions}
                                value={formData.city}
                                onChange={(value) => {
                                    setFormData({ ...formData, city: value.value });
                                    setErrors({ ...errors, city: "" });
                                }}
                                placeholder="📍 Select a city"
                                icon={faMapMarkerAlt}
                            />
                            {errors.city && (
                                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                            )}
                        </div>

                        {/* Category */}
                        <div className="mb-4">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Choose a category
                            </label>
                            <div className="flex overflow-x-auto space-x-4 py-2">
                                {categories?.map((cat) => (
                                    <button
                                        key={cat.name}
                                        type="button"
                                        className={`flex flex-col items-center min-w-[100px] rounded-lg border py-4 text-center transition 
                      ${formData.category === cat.id
                                                ? "border-indigo-500 text-indigo-500"
                                                : "border-gray-300"
                                            }
                      ${errors.category ? "border-red-500" : ""}`}
                                        onClick={() => handleCategorySelect(cat?.id)}
                                    >
                                        {/* Icon */}
                                        <svg
                                            className={`h-6 w-6 text-red-500 mb-2`}
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M13 7h-2v6h6v-2h-4V7zM20 15.31l.69.73C21.39 16.38 22 17.09 22 18v1h-7.21c.11.31.21.65.21 1s-.1.69-.21 1H22v1c0 .91-.61 1.62-1.31 1.96l-.69.73H13V17.93c-.35-.06-.68-.16-1-.29V22H6.31l-.73-.69C5.62 21.39 5 20.68 5 19.78v-1h7.21c-.11-.31-.21-.65-.21-1s.1-.69.21-1H2v-1c0-.91.61-1.62 1.31-1.96l.69-.73H11v1.06c.32.13.65.23 1 .29V15.31zM5 3h14c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2h-4v1.93c-.68.24-1.33.58-1.93 1.07H15V9H5v10h4.07c-.5-.6-.84-1.25-1.07-1.93H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2z" />
                                        </svg>
                                        {/* Category name */}
                                        <span className="text-sm font-medium">{cat.name}</span>
                                    </button>
                                ))}
                            </div>
                            {errors.category && (
                                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                            )}
                        </div>
                    </div>
                );

            /** STEP 4: Description & Multiple Images */
            case Steps.DESCRIPTION_IMAGES:
                return (
                    <div>
                        <h2 className="mb-4 text-xl font-bold text-gray-800">
                            4. Description & Images
                        </h2>

                        {/* Description */}
                        <div className="mb-4">
                            <label
                                htmlFor="description"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Job Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe the job requirements..."
                                className={`block w-full rounded-md border p-3 ${errors.description ? "border-red-500" : "border-gray-300"
                                    }`}
                                rows={4}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* Multiple Images Upload */}
                        <div className="mb-4">
                            <label
                                htmlFor="image"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Upload Images
                            </label>
                            <div
                                className={`relative flex items-center justify-center w-full min-h-[4rem] border-2 border-dashed rounded-lg p-2 cursor-pointer transition
                  hover:border-indigo-500 hover:bg-indigo-50
                  ${errors.images ? "border-red-500" : "border-gray-300"}
                `}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const files = e.dataTransfer.files;
                                    if (!files || files.length === 0) return;
                                    // Manually trigger handleFileChange
                                    const inputEvent = {
                                        target: { files } as unknown,
                                    } as ChangeEvent<HTMLInputElement>;
                                    handleFileChange(inputEvent);
                                }}
                            >
                                <input
                                    type="file"
                                    id="image"
                                    accept="image/*"
                                    multiple // Allows multiple file selection
                                    onChange={handleFileChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <div className="flex flex-col items-center text-center pointer-events-none">
                                    <svg
                                        className="w-12 h-12 text-gray-400"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5 3a3 3 0 00-3 3v12a3 3 0 003 3h14a3 3 0 003-3V6a3 3 0 00-3-3H5zm0 2h14a1 1 0 011 1v12a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1zm6 2a1 1 0 00-.8 1.6l2 3a1 1 0 001.6 0l2-3A1 1 0 0015 7H9zM7 14a2 2 0 100 4 2 2 0 000-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="mt-2 text-gray-600">
                                        Drag & drop or click to upload images
                                    </span>
                                </div>
                            </div>
                            {errors.images && (
                                <p className="text-red-500 text-sm mt-1">{errors.images}</p>
                            )}
                        </div>

                        {/* Preview the uploaded images */}
                        {previewImages.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                                {previewImages.map((src, index) => (
                                    <div
                                        key={index}
                                        className="relative w-full h-32 border rounded-md overflow-hidden"
                                    >
                                        <Image
                                            src={src}
                                            alt={`Preview ${index}`}
                                            fill
                                            style={{ objectFit: "cover" }}
                                        />
                                        <button
                                            type="button"
                                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                                            onClick={() => removeImage(index)}
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );

            // Fallback (should never hit)
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
                {/* Header / Nav */}
                <div className="mb-6 flex items-center justify-between">
                    {currentStep > Steps.BASIC_INFO ? (
                        <button
                            type="button"
                            onClick={handleBack}
                            className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 transition hover:bg-gray-300"
                        >
                            ← Back
                        </button>
                    ) : (
                        <div />
                    )}

                    {currentStep < Steps.DESCRIPTION_IMAGES ? (
                        <button
                            onClick={handleNext}
                            className="rounded-md bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="rounded-md bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
                        >
                            Submit
                        </button>
                    )}
                </div>

                {/* Render the current step */}
                <form onSubmit={handleSubmit}>{renderStep()}</form>
            </div>
        </div>
    );
};

export default ClientComp;
