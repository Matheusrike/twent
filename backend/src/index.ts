import { fastify } from 'fastify';

const app = fastify();
const PORT = 3000;

app.listen({ port: 3000 }, (err) => {
	console.log(`Server running on http://localhost:${PORT}`);
	if (err) {
		console.error(err);
		process.exit(1);
	}
});
