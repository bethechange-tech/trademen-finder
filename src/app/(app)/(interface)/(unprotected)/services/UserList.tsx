import React from 'react';

interface User {
    id: number;
    name: string;
    location: string;
    role: string;
    imgSrc: string;
}

interface UserListProps {
    users: User[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Users</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {users.map((user) => (
                    <div key={user.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-150 ease-in-out transform hover:-translate-y-1 hover:scale-105">
                        <div className="flex items-center space-x-4">
                            <img src={user.imgSrc} alt={user.name} className="w-16 h-16 rounded-full border-2 border-indigo-500" />
                            <div>
                                <h4 className="font-semibold text-gray-900 text-lg">{user.name}</h4>
                                <p className="text-gray-500 text-sm">{user.location}</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className={`text-sm font-medium px-3 py-1 rounded-full ${user.role === 'New Member' ? 'bg-green-100 text-green-600' :
                                user.role === 'Editor' ? 'bg-blue-100 text-blue-600' :
                                    'bg-red-100 text-red-600'
                                }`}>
                                {user.role}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserList;
