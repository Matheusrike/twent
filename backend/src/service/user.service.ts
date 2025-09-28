import { AppError } from '../utils/errors.util.ts';
import prisma from '../../prisma/client.ts';
import { TypeGetUserProps } from '../types/users.types.ts';

export class UserService {
	async validateUser(email?: string, document_number?: string) {
        if (email !== undefined) {
		const usedEmail = await prisma.user.findUnique({
			where: { email },
		});
    
		if (usedEmail) {
			throw new AppError({
				message: 'Email já em uso',
				errorCode: 'CONFLICT',
			});
		}
    }
    if (document_number === undefined) return true;
		const usedDocument = await prisma.user.findUnique({
			where: { document_number },
		});
		if (usedDocument) {
			throw new AppError({
				message: 'Número de documento já registrado',
				errorCode: 'CONFLICT',
			});
		}
		return true;
	}

	async get(params: TypeGetUserProps) {
		const user = await prisma.user.findMany({
			where: params,
		});

		return user;
	}

	async getInfo(id: string) {
		const user = await prisma.user.findUnique({
			where: { id },
		});

		if (!user) {
			throw new AppError({
				message: 'Usuário não encontrado',
				errorCode: 'NOT_FOUND',
			});
		}
		return user;
	}

	async changeStatus(id: string, newStatus: boolean) {
		const user = await this.get({ id });
		if (!user) {
			throw new AppError({
				message: 'Usuário não encontrado',
				errorCode: 'NOT_FOUND',
			});
		}
		await prisma.user.update({
			where: { id: id },
			data: { is_active: newStatus },
		});

		return user;
	}
}
