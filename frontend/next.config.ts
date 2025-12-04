import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	async rewrites() {
		return [
			{
				source: '/response/:path*',
				destination: `${process.env.API_URL}/response/:path*`,
			},
		];
	},
};

export default nextConfig;
