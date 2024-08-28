/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    async rewrites(){
        return [{
            source: '/api/:path*', destination: 'http://localhost:5121/api/:path*'
        }]
    }
};

export default nextConfig;
