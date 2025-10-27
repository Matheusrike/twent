import prisma from './client';
import { Prisma } from '@prisma/client/extension';
import { UserType } from '@prisma/generated/enums';
import { IStoreProps } from '@/types/store.types';
import { hashPassword } from '@/utils/hash-password.util';
import { configDotenv } from 'dotenv';
import { Decimal } from '@prisma/client/runtime/library';

configDotenv({ quiet: true });

interface IRoleProps {
	name: string;
	description: string;
}

async function rolesSeed(tx: Prisma.TransactionClient) {
	const roles: IRoleProps[] = [
		{
			name: 'ADMIN',
			description: 'Administrador do Sistema',
		},
		{
			name: 'MANAGER_HQ',
			description: 'Gerente da Matriz',
		},
		{
			name: 'EMPLOYEE_HQ',
			description: 'Funcionário da Matriz',
		},
		{
			name: 'MANAGER_BRANCH',
			description: 'Gerente de Filial',
		},
		{
			name: 'EMPLOYEE_BRANCH',
			description: 'Funcionário de Filial',
		},
		{
			name: 'CASHIER',
			description: 'Operador de PDV',
		},
		{
			name: 'CUSTOMER',
			description: 'Cliente',
		},
	];

	for (const role of roles) {
		await tx.role.upsert({
			where: {
				name: role.name,
			},
			update: {},
			create: role,
		});
	}

	console.log('✔ Roles seeded successfully');
}

async function headquarterSeed(tx: Prisma.TransactionClient) {
	const headquarter: IStoreProps = {
		code: 'CHE001',
		name: 'Twent Headquarter',
		type: 'HEADQUARTERS',
		email: 'office@twent.ch',
		phone: '+41 698336724',
		street: 'Rue du Rhône',
		number: '12',
		district: 'City Center',
		city: 'Genebra',
		state: 'Genebra',
		zip_code: '1204',
		country: 'Suíça',
		latitude: new Decimal(46.2044),
		longitude: new Decimal(6.1432),
		opening_hours: [
			{
				day: 'Monday',
				open: '10:00',
				close: '18:00',
			},
			{
				day: 'Tuesday',
				open: '10:00',
				close: '18:00',
			},
			{
				day: 'Wednesday',
				open: '10:00',
				close: '18:00',
			},
			{
				day: 'Thursday',
				open: '10:00',
				close: '18:00',
			},
			{
				day: 'Friday',
				open: '10:00',
				close: '18:00',
			},
		],
	};

	await tx.store.upsert({
		where: {
			code: headquarter.code,
		},
		update: {},
		create: headquarter,
	});

	console.log('✔ Headquarter seeded successfully');
}

async function adminSeed(tx: Prisma.TransactionClient) {
    const store = await tx.store.findFirst({
        where: {
            type: 'HEADQUARTERS',
        },
    });
	if (!process.env.ADMIN_PASSWORD) {
		throw new Error('✖ ADMIN_PASSWORD not found in .env');
	}

	const admin = await tx.user.upsert({
		where: {
			email: 'admin@twent.ch',
		},
		update: {},
		create: {
			user_type: UserType.EMPLOYEE,
            store_id: store.id,
			email: 'admin@twent.ch',
			password_hash: await hashPassword(process.env.ADMIN_PASSWORD),
			first_name: 'Super',
			last_name: 'Admin',
		},
	});

	console.log('✔ Admin seeded successfully');

	const adminRole = await tx.role.findFirst({
		where: {
			name: 'ADMIN',
		},
	});

	await tx.userRole.upsert({
		where: {
			user_id_role_id: {
				user_id: admin.id,
				role_id: adminRole.id,
			},
		},
		update: {},
		create: {
			user_id: admin.id,
			role_id: adminRole.id,
		},
	});

	console.log('✔ Admin role relationship created successfully');
}

async function seed() {
	console.log('🌱 Seeding database...');

	try {
		await prisma.$connect();
		await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
			await rolesSeed(tx);
			await headquarterSeed(tx);
			await adminSeed(tx);
		});
	} catch (error) {
		console.error(error);
		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}

	console.log('✔ Database seeded successfully');
}

seed();
