"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { getHankoToken, getHankoSession } from "@/helpers/hanko-helpers";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { CustomTypeHead, Option } from "@/components/CustomTypeHead";
import { State } from "country-state-city";

const stateOptions: Option[] =
    State.getStatesOfCountry("GB")?.map((s) => ({
        value: s.name,
        label: s.name,
    })) || [];

// Number of steps in the multi-step form
const TOTAL_STEPS = 3;

interface ExperienceItem {
    companyName: string;
    role: string;
    duration: string;
    location: string;
    initial: string;
    color: string;
}

type FormDataType = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city: string;
    jobTitle: string;
    experience: string;
    education: string;
    skills: string;
    bio: string;
    address: string;
    state: string;
    postalCode: string;
    country: string;
    providerId: string;
    photo: File | null;
};

const MultiStepForm: React.FC = () => {
    // Track which step is active
    const [currentStep, setCurrentStep] = useState<number>(1);

    // Main form data
    const [formData, setFormData] = useState<FormDataType>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        city: "",
        jobTitle: "",
        experience: "",
        education: "",
        skills: "",
        bio: "",
        address: "",
        state: "",
        postalCode: "",
        country: "",
        providerId: "",
        photo: null,
    });

    useEffect(() => {
        getHankoSession().then(session => {
            setFormData((prev) => ({ ...prev, email: session?.email ?? '' }));
        })
    }, [])

    // Experience array
    const [experienceDetails, setExperienceDetails] = useState<ExperienceItem[]>(
        []
    );

    // Image preview
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    // UI feedback
    const [loading, setLoading] = useState<boolean>(false);
    const [feedback, setFeedback] = useState<string | null>(null);

    // ---------------- Handlers ----------------

    // Generic input change handler
    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle city with CustomTypeHead
    const handleCityChange = (val: Option) => {
        setFormData((prev) => ({ ...prev, city: val.value }));
    };

    // Handle photo changes
    const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setFormData((prev) => ({ ...prev, photo: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setFormData((prev) => ({ ...prev, photo: null }));
            setPhotoPreview(null);
        }
    };

    // Experience array handlers
    const addExperience = () => {
        setExperienceDetails((prev) => [
            ...prev,
            {
                companyName: "",
                role: "",
                duration: "",
                location: "",
                initial: "",
                color: "",
            },
        ]);
    };

    const removeExperience = (index: number) => {
        setExperienceDetails((prev) => prev.filter((_, i) => i !== index));
    };

    const handleExperienceChange = (
        index: number,
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setExperienceDetails((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, [name]: value } : item
            )
        );
    };

    // Step navigation
    const goNext = () => {
        setFeedback(null);
        setCurrentStep((prev) => prev + 1);
    };

    const goPrevious = () => {
        setFeedback(null);
        setCurrentStep((prev) => prev - 1);
    };

    // ---------------- Step Contents ----------------

    // STEP 1: Basic Info
    const StepOne = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 1: Basic Info</h3>
            {/* First Name */}
            <div>
                <label className="block text-sm font-medium text-gray-800">
                    First Name*
                </label>
                <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full mt-1 rounded border border-gray-300 p-2 text-sm"
                    placeholder="John"
                />
            </div>
            {/* Last Name */}
            <div>
                <label className="block text-sm font-medium text-gray-800">
                    Last Name*
                </label>
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full mt-1 rounded border border-gray-300 p-2 text-sm"
                    placeholder="Doe"
                />
            </div>
            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-gray-800">
                    Email*
                </label>
                <input
                    type="email"
                    name="email"
                    disabled
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full mt-1 rounded border border-gray-300 p-2 text-sm"
                    placeholder="john@example.com"
                />
            </div>
            {/* Phone */}
            <div>
                <label className="block text-sm font-medium text-gray-800">
                    Phone*
                </label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full mt-1 rounded border border-gray-300 p-2 text-sm"
                    placeholder="(555) 123-4567"
                />
            </div>

            <div className="flex justify-end">
                {/* Important: type="button" so it does NOT submit the form */}
                <button
                    type="button"
                    onClick={goNext}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Next
                </button>
            </div>
        </div>
    );

    // STEP 2: Background Fields
    const StepTwo = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 2: Background</h3>
            {/* Job Title */}
            <div>
                <label className="block text-sm font-medium text-gray-800">
                    Job Title
                </label>
                <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    className="w-full mt-1 rounded border border-gray-300 p-2 text-sm"
                    placeholder="Software Engineer"
                />
            </div>
            {/* Experience */}
            <div>
                <label className="block text-sm font-medium text-gray-800">
                    Experience
                </label>
                <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full mt-1 rounded border border-gray-300 p-2 text-sm"
                    placeholder="3 years"
                />
            </div>
            {/* Education */}
            <div>
                <label className="block text-sm font-medium text-gray-800">
                    Education
                </label>
                <input
                    type="text"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    className="w-full mt-1 rounded border border-gray-300 p-2 text-sm"
                    placeholder="Bachelor's in Computer Science"
                />
            </div>
            {/* Skills */}
            <div>
                <label className="block text-sm font-medium text-gray-800">
                    Skills
                </label>
                <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    className="w-full mt-1 rounded border border-gray-300 p-2 text-sm"
                    placeholder="React, Node.js, SQL..."
                />
            </div>
            {/* Bio */}
            <div>
                <label className="block text-sm font-medium text-gray-800">
                    Bio
                </label>
                <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full mt-1 rounded border border-gray-300 p-2 text-sm"
                    placeholder="Tell us about yourself"
                    rows={3}
                />
            </div>

            <div className="flex justify-between">
                {/* type="button" prevents submission */}
                <button
                    type="button"
                    onClick={goPrevious}
                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                    Previous
                </button>
                <button
                    type="button"
                    onClick={goNext}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Next
                </button>
            </div>
        </div>
    );

    // STEP 3: Final Fields & Submit
    const StepThree = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 3: Address & Photo</h3>
            {/* Address */}
            <div>
                <label className="block text-sm font-medium text-gray-800">
                    Address
                </label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full mt-1 rounded border border-gray-300 p-2 text-sm"
                    placeholder="123 Main St"
                />
            </div>
            {/* City (CustomTypeHead) */}
            <div>
                <label className="block text-sm font-medium text-gray-800">City</label>
                <CustomTypeHead
                    options={stateOptions}
                    value={formData.city}
                    onChange={handleCityChange}
                    placeholder="Select your city"
                    icon={faMapMarkerAlt}
                />
            </div>
            {/* State */}
            <div>
                <label className="block text-sm font-medium text-gray-800">State</label>
                <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full mt-1 rounded border border-gray-300 p-2 text-sm"
                    placeholder="California"
                />
            </div>
            {/* Postal Code */}
            <div>
                <label className="block text-sm font-medium text-gray-800">
                    Postal Code
                </label>
                <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full mt-1 rounded border border-gray-300 p-2 text-sm"
                    placeholder="12345"
                />
            </div>
            {/* Country */}
            <div>
                <label className="block text-sm font-medium text-gray-800">
                    Country
                </label>
                <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full mt-1 rounded border border-gray-300 p-2 text-sm"
                    placeholder="United Kingdom"
                />
            </div>

            {/* Photo Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-800">
                    Upload Profile Photo
                </label>
                <div className="relative mt-1 flex items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 p-4">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {!photoPreview ? (
                        <div className="text-center text-sm text-gray-600">
                            Drag & drop or click to upload
                        </div>
                    ) : (
                        <div className="relative h-28 w-28 overflow-hidden rounded-md border border-gray-200">
                            <Image
                                src={photoPreview}
                                alt="Preview"
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Experience Details */}
            <div>
                <h4 className="text-sm font-medium text-gray-800 my-2">
                    Experience Details
                </h4>
                {experienceDetails.map((item, idx) => (
                    <div
                        key={idx}
                        className="relative mb-4 rounded-md border border-gray-300 bg-white p-3"
                    >
                        <button
                            type="button"
                            onClick={() => removeExperience(idx)}
                            className="absolute top-2 right-2 text-red-600 text-xs font-bold"
                        >
                            &times;
                        </button>
                        {/* Company Name */}
                        <div>
                            <label className="block text-sm text-gray-700">Company Name</label>
                            <input
                                type="text"
                                name="companyName"
                                value={item.companyName}
                                onChange={(e) => handleExperienceChange(idx, e)}
                                className="w-full mt-1 rounded border border-gray-200 p-2 text-sm"
                            />
                        </div>
                        {/* Role */}
                        <div className="mt-2">
                            <label className="block text-sm text-gray-700">Role</label>
                            <input
                                type="text"
                                name="role"
                                value={item.role}
                                onChange={(e) => handleExperienceChange(idx, e)}
                                className="w-full mt-1 rounded border border-gray-200 p-2 text-sm"
                            />
                        </div>
                        {/* Duration */}
                        <div className="mt-2">
                            <label className="block text-sm text-gray-700">Duration</label>
                            <input
                                type="text"
                                name="duration"
                                value={item.duration}
                                onChange={(e) => handleExperienceChange(idx, e)}
                                className="w-full mt-1 rounded border border-gray-200 p-2 text-sm"
                            />
                        </div>
                        {/* Location */}
                        <div className="mt-2">
                            <label className="block text-sm text-gray-700">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={item.location}
                                onChange={(e) => handleExperienceChange(idx, e)}
                                className="w-full mt-1 rounded border border-gray-200 p-2 text-sm"
                            />
                        </div>
                        {/* Initial */}
                        <div className="mt-2">
                            <label className="block text-sm text-gray-700">Initial</label>
                            <input
                                type="text"
                                name="initial"
                                value={item.initial}
                                onChange={(e) => handleExperienceChange(idx, e)}
                                className="w-full mt-1 rounded border border-gray-200 p-2 text-sm"
                            />
                        </div>
                        {/* Color */}
                        <div className="mt-2">
                            <label className="block text-sm text-gray-700">Color</label>
                            <input
                                type="text"
                                name="color"
                                value={item.color}
                                onChange={(e) => handleExperienceChange(idx, e)}
                                className="w-full mt-1 rounded border border-gray-200 p-2 text-sm"
                            />
                        </div>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addExperience}
                    className="rounded bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300"
                >
                    + Add Experience
                </button>
            </div>

            <div className="flex justify-between mt-4">
                {/* Only a button, not submitting yet */}
                <button
                    type="button"
                    onClick={goPrevious}
                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                    Previous
                </button>
                {/* Final submission button is type="submit" */}
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </div>
        </div>
    );

    // ---------------- Submit Handler ----------------

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFeedback(null);
        setLoading(true);

        try {
            // Retrieve token/session if needed
            const session = await getHankoSession();
            const hankoToken = await getHankoToken();

            // Build the FormData
            const formStateData = new FormData();
            formStateData.append("firstName", formData.firstName);
            formStateData.append("lastName", formData.lastName);
            formStateData.append("email", session?.email ?? '');
            formStateData.append("phone", formData.phone);
            formStateData.append("city", formData.city);
            formStateData.append("jobTitle", formData.jobTitle);
            formStateData.append("experience", formData.experience);
            formStateData.append("education", formData.education);
            formStateData.append("skills", formData.skills);
            formStateData.append("bio", formData.bio);
            formStateData.append("address", formData.address);
            formStateData.append("state", formData.state);
            formStateData.append("postalCode", formData.postalCode);
            formStateData.append("country", formData.country);
            formStateData.append("providerId", session?.authProviderId || "");

            // Experience details as JSON
            formStateData.append("experienceDetails", JSON.stringify(experienceDetails));

            // Photo
            if (formData.photo) {
                formStateData.append("image", formData.photo);
            }

            // Make the request
            await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user-job-profile`,
                formStateData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "hanko-token": hankoToken,
                    },
                }
            );

            setFeedback("Profile created/updated successfully!");
            // Optionally redirect or refresh
            window.location.href = "/";
        } catch (error) {
            console.error("Error upserting profile:", error);
            setFeedback("Error occurred while upserting profile.");
        } finally {
            setLoading(false);
        }
    };

    // ---------------- Render ----------------

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Multi-Step Form</h2>
                <p className="text-sm text-gray-600">
                    Step {currentStep} of {TOTAL_STEPS}
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Steps */}
                {currentStep === 1 && <StepOne />}
                {currentStep === 2 && <StepTwo />}
                {currentStep === 3 && <StepThree />}
            </form>

            {feedback && (
                <div
                    className={`mt-4 p-3 rounded text-sm ${feedback.toLowerCase().includes("success")
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                        }`}
                >
                    {feedback}
                </div>
            )}
        </div>
    );
};

export default MultiStepForm;
