import React from 'react';
import Link from 'next/link';

const CreateProfilePrompt: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-indigo-50 to-blue-100 p-8">
            <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Your Profile</h2>
                <p className="text-gray-700 mb-6">
                    It looks like you don&apos;t have a profile yet. To apply for jobs and access more features, please create your profile.
                </p>
                <Link href="/upsert-user-job-profile">
                    <div className="inline-block bg-indigo-600 text-white text-lg font-medium py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition duration-200">
                        Create Profile
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default CreateProfilePrompt;
