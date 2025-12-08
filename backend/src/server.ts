import { createApp } from './app';
import { loadConfig } from './config/env';

async function startServer() {
	try {
		const config = loadConfig();
		const app = await createApp(config);

		await app.listen({
			port: config.port,
			host: '0.0.0.0',
		});

		if (config.nodeEnv !== 'prod') {
			console.log('🛠️  Running in development mode');
			console.log(
				`🚀 Server running on http://localhost:${config.port}/api`,
			);
			console.log(
				`📚 API Documentation available at http://localhost:${config.port}/docs`,
			);
		} else {
			console.log('🚀 Server running in production mode');
		}
	} catch (error) {
		console.error('❌ Error starting server:', error);
		process.exit(1);
	}
}

process.on('SIGINT', () => {
	console.log('\n🛑 Shutting down server...');
	process.exit(0);
});

process.on('SIGTERM', () => {
	console.log('\n🛑 Shutting down server...');
	process.exit(0);
});

startServer();
