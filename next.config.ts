/** @type {import('next').NextConfig} */
const nextConfig = {
  //  instrumentationHook: true,
  reactStrictMode: false,  // Disable strict mode
  images: {
    domains: ['res.cloudinary.com', 'picsum.photos'], // Add other domains if needed
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "example.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'image.shutterstock.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "ypphzcgzihluwhwjcnix.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
