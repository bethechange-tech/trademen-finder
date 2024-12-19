import React from "react";

const TaskTable = ({ tasks }: { tasks: any[] }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Last tasks</h2>
                <span className="text-gray-600">94 in total</span>
            </div>
            <table className="w-full text-left">
                <thead>
                    <tr className="text-gray-600 text-sm">
                        <th className="py-3">Task</th>
                        <th className="py-3">Members</th>
                        <th className="py-3">Date</th>
                        <th className="py-3">Status</th>
                        <th className="py-3">Time</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task, index) => (
                        <tr
                            key={index}
                            className={`text-sm ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                }`}
                        >
                            <td className="py-3">{task.name}</td>
                            <td className="py-3">{task.member}</td>
                            <td className="py-3">{task.date}</td>
                            <td className="py-3 text-green-600">{task.status}</td>
                            <td className="py-3">{task.time}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TaskTable;
