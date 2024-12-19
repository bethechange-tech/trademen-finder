'use client'
import React, { useMemo } from 'react';
import CreateProfilePrompt from '../CreateProfilePrompt';
import type { UserProfile } from "@/payload-types";

const UserProfile = ({ profile: serverProfile }: { profile: UserProfile | null }) => {
    const profile = useMemo(() => serverProfile ?? null, [serverProfile]);

    if (!profile) {
        return <CreateProfilePrompt />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-blue-100 p-8 flex justify-center items-center">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3">
                {/* Left Section */}
                <div className="bg-gradient-to-r from-indigo-50 to-blue-100 p-10 flex flex-col justify-center items-center">
                    {/* Profile Picture */}
                    <div className="relative">
                        <img src={profile?.profilePicture} alt="Profile Image" className="rounded-full h-32 w-32 object-cover border-4 border-white shadow-lg" />
                        <div className="absolute bottom-0 right-0 bg-green-500 h-6 w-6 rounded-full border-2 border-white"></div>
                    </div>
                    {/* Name and Title */}
                    <h2 className="mt-6 text-2xl font-bold text-gray-900">{profile?.fullName}</h2>
                    <p className="text-sm text-gray-500">{profile?.jobTitle}</p>
                    {/* Bio */}
                    <p className="mt-6 text-sm text-gray-700 text-center leading-relaxed">
                        {profile?.bio}
                    </p>
                    {/* Skills */}
                    <div className="mt-6 w-full">
                        <h3 className="text-md font-semibold text-gray-700">Skills</h3>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {profile?.skills.split(',').map((skill: boolean | React.ReactElement<string, string | React.JSXElementConstructor<string>> | Iterable<React.ReactNode> | React.Key | null | undefined, idx: React.Key | null | undefined) => (
                                <span key={idx} className="bg-blue-100 text-blue-600 text-xs font-medium px-3 py-1 rounded-lg shadow-sm">{skill}</span>
                            ))}
                        </div>
                    </div>
                    {/* Add Notes */}
                    <div className="mt-8 w-full">
                        <label htmlFor="notes" className="block text-sm font-semibold text-gray-700">Add Notes</label>
                        <textarea id="notes" rows={3} className="mt-2 w-full p-3 text-sm text-gray-700 bg-white rounded-lg border border-gray-300 shadow focus:ring-indigo-500 focus:border-indigo-500" placeholder="Add notes for future reference"></textarea>
                        <button className="mt-4 w-full bg-indigo-600 text-white text-sm font-medium py-2 rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150">Add Note</button>
                    </div>
                </div>

                {/* Right Section */}
                <div className="col-span-2 p-10">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-semibold text-gray-800">Basic Information</h3>
                        <button className="text-sm text-indigo-600 hover:underline">Share Profile</button>
                    </div>
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div>
                            <p className="text-sm text-gray-500">AGE</p>
                            <p className="text-lg font-semibold text-gray-900">28 years</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">YEARS OF EXPERIENCE</p>
                            <p className="text-lg font-semibold text-gray-900">{profile?.experience}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">PHONE</p>
                            <p className="text-lg font-semibold text-gray-900">{profile?.phone}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">LOCATION</p>
                            <p className="text-lg font-semibold text-gray-900">{profile?.city}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-sm text-gray-500">EMAIL</p>
                            <p className="text-lg font-semibold text-gray-900">{profile?.email}</p>
                        </div>
                    </div>
                    <div className="flex space-x-4 mb-10">
                        <button className="bg-indigo-600 text-white text-sm font-medium py-2 px-4 rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150">Download Resume</button>
                        <button className="bg-white text-indigo-600 border border-indigo-600 text-sm font-medium py-2 px-4 rounded-lg shadow hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150">Send Email</button>
                    </div>

                    {/* Experience Section */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800">Experience</h3>
                        <div className="mt-6 space-y-6">
                            {profile?.experienceDetails?.map((detail) =>
                                <div key={detail?.id} className="flex items-center space-x-4">
                                    <div className="flex-shrink-0 bg-pink-500 h-12 w-12 rounded-full flex items-center justify-center text-white text-lg font-medium">PS</div>
                                    <div>
                                        <h4 className="text-md font-semibold text-gray-900">{detail.companyName}</h4>
                                        <p className="text-sm text-gray-600">{detail.role} | {detail.duration} | {detail.location}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Education, Accomplishments, Certification Sections */}
                    <div className="space-y-6">
                        <div className="border-t pt-4">
                            <h4 className="text-md font-semibold text-gray-800">Education</h4>
                            <p className="mt-2 text-sm text-gray-600">{profile?.education}</p>
                        </div>
                        <div className="border-t pt-4">
                            <h4 className="text-md font-semibold text-gray-800">Accomplishments</h4>
                            <p className="mt-2 text-sm text-gray-600">Details of accomplishments here...</p>
                        </div>
                        <div className="border-t pt-4">
                            <h4 className="text-md font-semibold text-gray-800">Certification</h4>
                            <p className="mt-2 text-sm text-gray-600">Details of certifications here...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
