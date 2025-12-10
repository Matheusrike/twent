import type { NextConfig } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

const nextConfig: NextConfig = {
	async rewrites() {
		return [
			{
				source: '/response/:path*',
				destination: `${API_URL}/:path*`,
			},
		];
	},

	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
				pathname: '/**',
			},
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '3333',
				pathname: '/**',
			},
		],
	},

	devIndicators: false,
};

export default nextConfig;
