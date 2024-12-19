"use client";

import React, { useState, ChangeEvent, FormEvent, useMemo } from "react";
import Image from "next/image";
import axios from "axios";
import { CustomTypeHead, Option } from "@/components/CustomTypeHead";
import { State } from "country-state-city";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { ExtendedUserProfile } from "@/types";

interface ExperienceDetail {
    companyName: string;
    role: string;
    duration: string;
    location: string;
    initial: string;
    color: string;
}

const TOTAL_STEPS = 3; // Adjust as needed

const MultiStepProfilePage: React.FC<{ profile: any | null }> = ({
    profile,
}) => {
    // Memoize existing profile
    const memoProfile = useMemo(() => profile ?? null, [profile]);
    const router = useRouter();

    // Track which step the user is on
    const [currentStep, setCurrentStep] = useState<number>(1);

    // Local state for image preview and file
    const [previewImage, setPreviewImage] = useState<string | ArrayBuffer | null | undefined>(
        memoProfile?.profilePicture || null
    );
    const [imageFile, setImageFile] = useState<File | null>(null);

    // Error state & loading state
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    // Experience details array
    const [experienceDetails, setExperienceDetails] = useState<ExperienceDetail[]>(
        memoProfile?.experienceDetails || []
    );

    // Primary form data
    const [formData, setFormData] = useState({
        firstName: memoProfile?.firstName || "",
        lastName: memoProfile?.lastName || "",
        email: memoProfile?.email || "",
        phone: memoProfile?.phone || "",
        city: memoProfile?.city || "",
        jobTitle: memoProfile?.jobTitle || "",
        experience: memoProfile?.experience || "",
        education: memoProfile?.education || "",
        skills: memoProfile?.skills || "",
        bio: memoProfile?.bio || "",
        address: memoProfile?.address || "",
        postalCode: memoProfile?.postalCode || "",
        country: memoProfile?.country || "United Kingdom",
        state: memoProfile?.state || "",
        ...memoProfile, // Spread additional fields, if any
    });

    // State (city) options for your custom TypeHead
    const stateOptions: Option[] =
        State.getStatesOfCountry("GB")?.map((s) => ({
            value: s.name,
            label: s.name,
        })) || [];

    // Helpers for step navigation
    const goNext = () => {
        setCurrentStep((prev) => prev + 1);
    };

    const goPrevious = () => {
        setCurrentStep((prev) => prev - 1);
    };

    // Field change handler
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    // City selection with CustomTypeHead
    const handleCityChange = (val: Option) => {
        setFormData((prev: any) => ({ ...prev, city: val.value }));
        setErrors((prev) => ({ ...prev, city: "" }));
    };

    // File upload handler
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
            setImageFile(null);
        }
    };

    // Experience sub-form
    const handleExperienceChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updated = [...experienceDetails];
        (updated[index] as any)[name] = value;
        setExperienceDetails(updated);
    };

    const addExperience = () => {
        setExperienceDetails((prev) => [
            ...prev,
            { companyName: "", role: "", duration: "", location: "", initial: "", color: "" },
        ]);
    };

    const removeExperience = (index: number) => {
        setExperienceDetails((prev) => prev.filter((_, i) => i !== index));
    };

    // Validate all fields at final step
    const validateAll = (): Record<string, string> => {
        const newErrors: Record<string, string> = {};
        // Required fields
        if (!formData.firstName) newErrors.firstName = "First Name is required";
        if (!formData.lastName) newErrors.lastName = "Last Name is required";
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.phone) newErrors.phone = "Phone number is required";
        if (!formData.city) newErrors.city = "City is required";
        if (!formData.jobTitle) newErrors.jobTitle = "Job Title is required";
        if (!formData.experience) newErrors.experience = "Experience is required";
        if (!formData.education) newErrors.education = "Education is required";
        if (!formData.skills) newErrors.skills = "Skills are required";
        if (!formData.bio) newErrors.bio = "Bio is required";
        if (!formData.country) newErrors.country = "Country is required";
        if (!formData.postalCode) newErrors.postalCode = "Postal Code is required";
        if (!formData.state) newErrors.state = "State is required";

        // If profile didn't already have an image, require a new one
        if (!imageFile && !previewImage) {
            newErrors.image = "Profile picture is required";
        }
        return newErrors;
    };

    // Final submission
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const validationErrors = validateAll();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            // Optionally jump to first step with an error
            // setCurrentStep(1);
            return;
        }

        setLoading(true);
        try {
            const data = new FormData();
            data.append("firstName", formData.firstName);
            data.append("lastName", formData.lastName);
            data.append("email", formData.email);
            data.append("phone", formData.phone);
            data.append("city", formData.city);
            data.append("jobTitle", formData.jobTitle);
            data.append("experience", formData.experience);
            data.append("education", formData.education);
            data.append("skills", formData.skills);
            data.append("bio", formData.bio);
            data.append("address", formData.address!);
            data.append("postalCode", formData.postalCode);
            data.append("country", formData.country);
            data.append("state", formData.state);

            // Convert array to JSON for submission
            data.append("experienceDetails", JSON.stringify(experienceDetails));

            // Append image if new file chosen
            if (imageFile) {
                data.append("image", imageFile);
            }

            const response = await axios.post("/api/user-job-profile", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.status === 200) {
                alert("Profile updated successfully!");
                router.refresh(); // Or router.push('/profile'), etc.
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // STEP 1: Personal Information
    const StepOne = () => (
        <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Step 1: Personal Information
            </h2>
            <p className="mb-4 text-gray-600">
                Let&apos;s start with your basic personal details.
            </p>

            {/* First Name */}
            <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">First Name</label>
                <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    className={`block w-full rounded-md border p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.firstName ? "border-red-500" : "border-gray-300"
                        }`}
                />
                {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                )}
            </div>

            {/* Last Name */}
            <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">Last Name</label>
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    className={`block w-full rounded-md border p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.lastName ? "border-red-500" : "border-gray-300"
                        }`}
                />
                {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
            </div>

            {/* Email */}
            <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john.doe@example.com"
                    className={`block w-full rounded-md border p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                />
                {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
            </div>

            {/* Phone */}
            <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">Phone</label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="123-456-7890"
                    className={`block w-full rounded-md border p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.phone ? "border-red-500" : "border-gray-300"
                        }`}
                />
                {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
            </div>

            <div className="flex justify-end mt-6">
                <button
                    type="button"
                    onClick={goNext}
                    className="inline-flex items-center rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow transition hover:bg-indigo-700"
                >
                    Next
                </button>
            </div>
        </div>
    );

    // STEP 2: Background & Skills
    const StepTwo = () => (
        <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Step 2: Background & Skills
            </h2>
            <p className="mb-4 text-gray-600">
                Provide more details about your work history, education, and skills.
            </p>

            {/* Job Title */}
            <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">Job Title</label>
                <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    placeholder="Your current role"
                    className={`block w-full rounded-md border p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.jobTitle ? "border-red-500" : "border-gray-300"
                        }`}
                />
                {errors.jobTitle && (
                    <p className="text-red-500 text-sm mt-1">{errors.jobTitle}</p>
                )}
            </div>

            {/* Experience */}
            <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">Experience</label>
                <textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="Describe your work experience"
                    className={`block w-full rounded-md border p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.experience ? "border-red-500" : "border-gray-300"
                        }`}
                    rows={3}
                />
                {errors.experience && (
                    <p className="text-red-500 text-sm mt-1">{errors.experience}</p>
                )}
            </div>

            {/* Education */}
            <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">Education</label>
                <textarea
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    placeholder="Describe your educational background"
                    className={`block w-full rounded-md border p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.education ? "border-red-500" : "border-gray-300"
                        }`}
                    rows={3}
                />
                {errors.education && (
                    <p className="text-red-500 text-sm mt-1">{errors.education}</p>
                )}
            </div>

            {/* Skills */}
            <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">Skills</label>
                <textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="List your key skills"
                    className={`block w-full rounded-md border p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.skills ? "border-red-500" : "border-gray-300"
                        }`}
                    rows={3}
                />
                {errors.skills && (
                    <p className="text-red-500 text-sm mt-1">{errors.skills}</p>
                )}
            </div>

            {/* Bio */}
            <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us a little about yourself"
                    className={`block w-full rounded-md border p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.bio ? "border-red-500" : "border-gray-300"
                        }`}
                    rows={3}
                />
                {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
            </div>

            <div className="flex justify-between mt-6">
                <button
                    type="button"
                    onClick={goPrevious}
                    className="inline-flex items-center rounded-md bg-gray-300 px-6 py-3 text-sm font-medium text-gray-800 shadow transition hover:bg-gray-400"
                >
                    Previous
                </button>
                <button
                    type="button"
                    onClick={goNext}
                    className="inline-flex items-center rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow transition hover:bg-indigo-700"
                >
                    Next
                </button>
            </div>
        </div>
    );

    // STEP 3: Location, Image, & Detailed Experience
    const StepThree = () => (
        <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Step 3: Additional Details
            </h2>
            <p className="mb-4 text-gray-600">
                Enter your location and any detailed experience you want to highlight.
            </p>

            {/* Address */}
            <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">Address</label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main St"
                    className={`block w-full rounded-md border p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.address ? "border-red-500" : "border-gray-300"
                        }`}
                />
                {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
            </div>

            {/* City with TypeHead */}
            <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">City</label>
                <CustomTypeHead
                    options={stateOptions}
                    value={formData.city}
                    onChange={handleCityChange}
                    placeholder="📍 Select a city"
                    icon={faMapMarkerAlt}
                />
                {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
            </div>

            {/* State */}
            <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">State</label>
                <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    className={`block w-full rounded-md border p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.state ? "border-red-500" : "border-gray-300"
                        }`}
                />
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
            </div>

            {/* Postal Code */}
            <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">Postal Code</label>
                <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="12345"
                    className={`block w-full rounded-md border p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.postalCode ? "border-red-500" : "border-gray-300"
                        }`}
                />
                {errors.postalCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
                )}
            </div>

            {/* Country */}
            <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">Country</label>
                <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Country"
                    className={`block w-full rounded-md border p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.country ? "border-red-500" : "border-gray-300"
                        }`}
                />
                {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
            </div>

            {/* Detailed Experience Section */}
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800">Detailed Experience</h3>
                <hr className="my-3 border-gray-300" />
                {experienceDetails.map((exp, index) => (
                    <div
                        key={index}
                        className="relative mb-6 rounded-xl border border-gray-300 bg-white p-4 shadow-md hover:scale-[1.01] transition duration-200"
                    >
                        <div className="absolute top-3 right-3">
                            <button
                                type="button"
                                onClick={() => removeExperience(index)}
                                className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-medium text-white shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Company & Role */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={exp.companyName}
                                    onChange={(e) => handleExperienceChange(index, e)}
                                    placeholder="e.g., Acme Corporation"
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Role
                                </label>
                                <input
                                    type="text"
                                    name="role"
                                    value={exp.role}
                                    onChange={(e) => handleExperienceChange(index, e)}
                                    placeholder="e.g., Software Engineer"
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        {/* Duration & Location */}
                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Duration
                                </label>
                                <input
                                    type="text"
                                    name="duration"
                                    value={exp.duration}
                                    onChange={(e) => handleExperienceChange(index, e)}
                                    placeholder="e.g., Jan 2020 - Dec 2021"
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={exp.location}
                                    onChange={(e) => handleExperienceChange(index, e)}
                                    placeholder="e.g., London, UK"
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        {/* Initial & Color */}
                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Initial
                                </label>
                                <input
                                    type="text"
                                    name="initial"
                                    value={exp.initial}
                                    onChange={(e) => handleExperienceChange(index, e)}
                                    placeholder="e.g., J.D."
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Color
                                </label>
                                <input
                                    type="text"
                                    name="color"
                                    value={exp.color}
                                    onChange={(e) => handleExperienceChange(index, e)}
                                    placeholder="e.g., Blue"
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addExperience}
                    className="flex items-center bg-indigo-600 text-white text-sm font-medium py-2 px-4 rounded shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="mr-2 h-5 w-5"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Experience
                </button>
            </div>

            {/* Image Upload */}
            <div className="mb-6">
                <label htmlFor="image" className="mb-2 block text-sm font-medium text-gray-700">
                    Upload Profile Picture
                </label>
                <div
                    className={`relative flex h-40 w-full cursor-pointer items-center justify-center border-2 border-dashed p-2 transition hover:border-indigo-500 hover:bg-indigo-50 ${errors.image ? "border-red-500" : "border-gray-300"
                        }`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        handleFileChange({
                            target: { files: [file] },
                        } as unknown as ChangeEvent<HTMLInputElement>);
                    }}
                >
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 cursor-pointer opacity-0"
                        required={!memoProfile?.profilePicture}
                    />
                    {previewImage ? (
                        <div className="relative h-full w-full">
                            <Image
                                src={previewImage.toString()}
                                alt="Preview"
                                layout="fill"
                                objectFit="contain"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-center">
                            <svg
                                className="h-12 w-12 text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5 3a3 3 0 00-3 3v12a3 3 0 003 3h14a3 3 0 003-3V6a3 3 0 00-3-3H5zm0 2h14a1 1 0 011 1v12a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1zm6 2a1 1 0 00-.8 1.6l2 3a1 1 0 001.6 0l2-3A1 1 0 0015 7H9zM7 14a2 2 0 100 4 2 2 0 000-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="mt-2 text-gray-600">Drag & drop or click to upload</span>
                        </div>
                    )}
                </div>
                {errors.image && (
                    <p className="mt-1 text-sm text-red-500">{errors.image}</p>
                )}
                {previewImage && (
                    <button
                        type="button"
                        className="mt-2 text-sm text-red-500 underline"
                        onClick={() => {
                            setPreviewImage(null);
                            setImageFile(null);
                        }}
                    >
                        Remove Image
                    </button>
                )}
            </div>

            {/* Final Step Buttons */}
            <div className="flex justify-between mt-6">
                <button
                    type="button"
                    onClick={goPrevious}
                    className="inline-flex items-center rounded-md bg-gray-300 px-6 py-3 text-sm font-medium text-gray-800 shadow transition hover:bg-gray-400"
                >
                    Previous
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center rounded-md bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-3 text-sm font-medium text-white shadow-lg transition duration-300 hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {loading ? (
                        <div className="flex items-center">
                            <AiOutlineLoading3Quarters className="mr-2 h-5 w-5 animate-spin" />
                            Processing...
                        </div>
                    ) : (
                        `${memoProfile?.id ? "Update Profile" : "Create Profile"}`
                    )}
                </button>
            </div>
        </div>
    );

    // Render the actual multi-step UI
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
            <div className="w-full max-w-3xl rounded-lg bg-white p-6 lg:p-8 shadow-lg">
                {/* Header / Title */}
                <div className="mb-6 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="text-gray-600 transition hover:text-gray-800"
                    >
                        ← Back
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Update Your Job Profile
                    </h1>
                    {/* Simple step indicator */}
                    <div className="text-sm font-medium text-gray-500">
                        Step {currentStep} of {TOTAL_STEPS}
                    </div>
                </div>

                {/* Multi-Step Form */}
                <form onSubmit={handleSubmit}>
                    {currentStep === 1 && <StepOne />}
                    {currentStep === 2 && <StepTwo />}
                    {currentStep === 3 && <StepThree />}
                </form>
            </div>
        </div>
    );
};

export default MultiStepProfilePage;
