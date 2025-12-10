import { configDotenv } from 'dotenv';
import { z } from 'zod';
import { IAppConfig } from '@/types/types';

configDotenv({ quiet: true });

const envSchema = z.object({
	NODE_ENV: z.enum(['prod', 'dev']).default('prod'),
	PORT: z.coerce.number().default(3333),
	DATABASE_URL: z.string().min(1, 'Database URL is required'),
	FRONTEND_URL: z
		.string()
		.url('Frontend URL must be a valid URL')
		.optional(),

	COOKIE_SECRET: z.string().min(1, 'Cookie secret is required'),
	JWT_SECRET: z.string().min(1, 'JWT secret is required'),
	ADMIN_PASSWORD: z.string().min(1, 'Admin password is required'),

	CLOUDINARY_CLOUD_NAME: z
		.string()
		.min(1, 'Cloudinary cloud name is required'),
	CLOUDINARY_API_KEY: z.string().min(1, 'Cloudinary API key is required'),
	CLOUDINARY_API_SECRET: z
		.string()
		.min(1, 'Cloudinary API secret is required'),

	RESEND_API_KEY: z.string('Resend API key is required'),
	FROM_EMAIL: z.string('From email must be a valid email address'),
});

export function loadConfig(): IAppConfig {
	const parseEnv = envSchema.safeParse(process.env);

	if (!parseEnv.success) {
		console.error('❌ Invalid environment variables:');
		parseEnv.error!.issues.forEach((issue) => {
			console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
		});
		process.exit(1);
	}

	const env = parseEnv.data;

	if (!env.PORT) {
		console.warn('⚠ PORT not specified in .env, defaulting to 3333\n');
	}

	// Valida FRONTEND_URL em produção
	if (env.NODE_ENV === 'prod' && !env.FRONTEND_URL) {
		console.error(
			'❌ FRONTEND_URL is required in production mode. Please set FRONTEND_URL environment variable.',
		);
		process.exit(1);
	}

	return {
		nodeEnv: env.NODE_ENV,
		port: env.PORT,
		frontendUrl:
			env.NODE_ENV === 'prod'
				? env.FRONTEND_URL || 'https://twent.store'
				: 'http://localhost:3000',
		databaseUrl: env.DATABASE_URL,
		cookieSecret: env.COOKIE_SECRET,
		jwtSecret: env.JWT_SECRET,
		adminPassword: env.ADMIN_PASSWORD,
		cloudinaryCloudName: env.CLOUDINARY_CLOUD_NAME,
		cloudinaryApiKey: env.CLOUDINARY_API_KEY,
		cloudinaryApiSecret: env.CLOUDINARY_API_SECRET,
	};
}
