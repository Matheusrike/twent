import { configDotenv } from 'dotenv';
import { z } from 'zod';
import { IAppConfig } from '@/types/types';

configDotenv({ quiet: true });

const envSchema = z.object({
	NODE_ENV: z.enum(['prod', 'dev']).default('prod'),
	PORT: z.coerce.number().default(3333),
	DATABASE_URL: z.string().min(1, 'Database URL is required'),
	COOKIE_SECRET: z.string().min(1, 'Cookie secret is required'),
	JWT_SECRET: z.string().min(1, 'JWT secret is required'),
	ADMIN_PASSWORD: z.string().min(1, 'Admin password is required'),
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

	return {
		nodeEnv: env.NODE_ENV,
		port: env.PORT,
		databaseUrl: env.DATABASE_URL,
		cookieSecret: env.COOKIE_SECRET,
		jwtSecret: env.JWT_SECRET,
		adminPassword: env.ADMIN_PASSWORD,
	};
}
