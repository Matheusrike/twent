import { validateLocation } from '../helpers/validate-location.helper.ts';
import prisma from '../../prisma/client.ts';
import bcrypt from 'bcryptjs';
import { IGetUserProps, IUser } from '../types/users.types.ts';
import { AppError } from '../utils/errors.util.ts';
import { ApiResponse } from '../utils/api-response.util.ts';

export class UserService {
	async create(userData: IUser) {
		const usedEmail = await prisma.user.findUnique({
			where: { email: userData.email },
		});

		if (usedEmail) {
			throw new AppError({
				message: 'Email já em uso',
				errorCode: 'CONFLICT',
			});
		}

		const usedDocument = await prisma.user.findUnique({
			where: { document_number: userData.document_number },
		});

		if (usedDocument) {
			throw new AppError({
				message: 'Número de documento já registrado',
				errorCode: 'CONFLICT',
			});
		}

		userData.password_hash = await bcrypt.hash(userData.password_hash, 10);

		if (userData.birth_date) {
			userData.birth_date = new Date(userData.birth_date!);
		}
		if (
			userData.city ||
			userData.country ||
			userData.district ||
			userData.state ||
			userData.street
		) {
			await validateLocation(userData);
		}
		const user = await prisma.user.create({
			data: userData,
		});
		return new ApiResponse({
			statusCode: 201,
			success: true,
			message: 'Usuário criado',
			data: user,
		});
	}

	async getAll() {
		const users = await prisma.user.findMany();

		return new ApiResponse({
			statusCode: 200,
			success: true,
			message: 'Usuários encontrados',
			data: users,
		});
	}

	async get({params: IGetUserProps) {

        //TODO: resolver esta porra
		const user = await prisma.user.findUnique({ where: params });

		if (user == null) {
			throw new AppError({
				message: 'Usuário não encontrado',
				errorCode: 'NOT_FOUND',
			});
		}

        return new ApiResponse({
			statusCode: 200,
			success: true,
			message: 'Usuário encontrado',
			data: user,
		});
	}

	async update(id: string, userData: Partial<IUser>) {
		try {
			if (userData.password_hash) {
				userData.password_hash = await bcrypt.hash(
					userData.password_hash,
					10,
				);
			}

			if (userData.birth_date) {
				userData.birth_date = new Date(userData.birth_date);
			}

			return await prisma.user.update({
				where: { id },
				data: userData,
			});
		} catch (error) {
			return error;
		}
	}

	async statusUser(id: string, newStatus: boolean) {
		try {
			return await prisma.user.update({
				where: { id: id },
				data: { is_active: newStatus },
			});
		} catch (error) {
			return error;
		}
	}
}
