import { fastify } from 'fastify';
import prisma from '../prisma/client.ts';

const app = fastify();
const PORT = 3000;

console.log(await prisma.user.findMany());

app.listen({ port: 3000 }, (err) => {
	console.log(`Server running on http://localhost:${PORT}`);
	if (err) {
		console.error(err);
		process.exit(1);
	}
});
