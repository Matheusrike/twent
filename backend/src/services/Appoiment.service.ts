import { CreateAppointment } from '@/schemas/appointment.schema';
import { AppError } from '@/utils/errors.util';
import { PrismaClient } from '@prisma/generated/client';

export class AppointmentService {
	constructor(private database: PrismaClient) {}

	async create(data: CreateAppointment, id: string) {
		try {
            data.appointment_date = new Date(data.appointment_date);
			const appoiment = await this.database.appointment.create({
				data: {customer_id: id, status: "SCHEDULED",...data},
			});
			return appoiment;
		} catch (error) {
			if (error.code === 'P2002') {
				throw new AppError({
					message: 'Dados conflitantes: ' + error.meta.target,
					errorCode: 'CONFLICT',
				});
			}
			if (error.code === 'P2025') {
				throw new AppError({
					message: 'Recurso não encontrado.',
					errorCode: 'NOT_FOUND',
				});
			}
            console.log(error);
			throw new AppError({
				message: error.message,
				errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
			});
		}
	}

	async get() {
		try {
			const appoiments = await this.database.appointment.findMany();
			return appoiments;
		} catch (error) {
			throw new AppError({
				message: error.message,
				errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
			});
		}
	}

	async cancelAppoiment(id: string) {
		try {
			const appoiment = await this.database.appointment.update({
				where: { id },
				data: { status: 'CANCELLED' },
			});
			return appoiment;
		} catch (error) {
            console.log(error);
			if (error.code === 'P2025') {
				throw new AppError({
					message: 'Agendamento não encontrado.',
					errorCode: 'NOT_FOUND',
				});
			}
			throw new AppError({
				message: error.message,
				errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
			});
		}
	}

	async confirmAppoiment(id: string) {
		try {
			const appoiment = await this.database.appointment.update({
				where: { id },
				data: { status: 'CONFIRMED' },
			});
			return appoiment;
		} catch (error) {
			if (error.code === 'P2025') {
				throw new AppError({
					message: 'Agendamento não encontrado.',
					errorCode: 'NOT_FOUND',
				});
			}
			throw new AppError({
				message: error.message,
				errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
			});
		}
	}

	async completeAppoiment(id: string) {
		try {
			const appoiment = await this.database.appointment.update({
				where: { id },
				data: { status: 'COMPLETED' },
			});
			return appoiment;
		} catch (error) {
			if (error.code === 'P2025') {
				throw new AppError({
					message: 'Agendamento não encontrado.',
					errorCode: 'NOT_FOUND',
				});
			}
			throw new AppError({
				message: error.message,
				errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
			});
		}
	}
}
