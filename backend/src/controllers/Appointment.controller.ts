import { CreateAppointment } from '@/schemas/appointment.schema';
import { AppointmentService } from '@/services/Appointment.service';
import { AppError, HttpError } from '@/utils/errors.util';
import { FastifyRequest } from 'fastify';

export class AppointmentController {
	constructor(private appointmentService: AppointmentService) {}

	async create(request: FastifyRequest) {
		try {
			const data = request.body as CreateAppointment;
			const appointment = await this.appointmentService.create(data);
			return appointment;
		} catch (error) {
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'CONFLICT':
						throw new HttpError({
							message: error.message,
							statusCode: 409,
							errorCode: error.errorCode,
						});
					case 'NOT_FOUND':
						throw new HttpError({
							message: error.message,
							statusCode: 404,
							errorCode: error.errorCode,
						});
					default:
						throw new HttpError({
							message: error.message,
							statusCode: 500,
							errorCode: 'INTERNAL_SERVER_ERROR',
						});
				}
			}
		}
	}

	async get() {
		try {
			const appointments = await this.appointmentService.get();
			return appointments;
		} catch (error) {
			if (error instanceof AppError) {
				throw new HttpError({
					message: error.message,
					statusCode: 500,
					errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
				});
			}
		}
	}

	async cancelAppointment(request: FastifyRequest) {
		try {
			const { id } = request.params as { id: string };
			const appointment = await this.appointmentService.cancelAppointment(id);
			return appointment;
		} catch (error) {
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'NOT_FOUND':
						throw new HttpError({
							message: error.message,
							statusCode: 404,
							errorCode: error.errorCode,
						});
					default:
						throw new HttpError({
							message: error.message,
							statusCode: 500,
							errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
						});
				}
			}
		}
	}

	async confirmAppointment(request: FastifyRequest) {
		try {
			const { id } = request.params as { id: string };
			const appointment = await this.appointmentService.confirmAppointment(id);
			return appointment;
		} catch (error) {
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'NOT_FOUND':
						throw new HttpError({
							message: error.message,
							statusCode: 404,
							errorCode: error.errorCode,
						});
					default:
						throw new HttpError({
							message: error.message,
							statusCode: 500,
							errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
						});
				}
			}
		}
	}

	async completeAppointment(request: FastifyRequest) {
		try {
			const { id } = request.params as { id: string };
			const appointment = await this.appointmentService.completeAppointment(id);
			return appointment;
		} catch (error) {
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'NOT_FOUND':
						throw new HttpError({
							message: error.message,
							statusCode: 404,
							errorCode: error.errorCode,
						});
					default:
						throw new HttpError({
							message: error.message,
							statusCode: 500,
							errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
						});
				}
			}
		}
	}
}
