import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-blue-700 text-white py-6">
            <div className="container mx-auto text-center">
                <p className="text-sm">© 2024 PlumbFast. All rights reserved.</p>
                <nav className="mt-4 space-x-2 md:space-x-4">
                    <a href="#" className="hover:underline">Privacy Policy</a>
                    <a href="#" className="hover:underline">Terms of Service</a>
                </nav>
            </div>
        </footer>
    );
}

export default Footer;
