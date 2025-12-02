import { CreateAppointment } from '@/schemas/appointment.schema';
import { AppointmentService } from '@/services/Appoiment.service';
import { IJwtAuthPayload } from '@/types/authorization.types';
import { AppError, HttpError } from '@/utils/errors.util';
import { FastifyRequest } from 'fastify';

export class AppointmentController {
	constructor(private appointmentService: AppointmentService) {}

	async create(request: FastifyRequest) {
		try {
			const data = request.body as CreateAppointment;
            const { id } = request.user as IJwtAuthPayload
			const appointment = await this.appointmentService.create(data, id);
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
			const appoiments = await this.appointmentService.get();
			return appoiments;
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

    async cancelAppoiment(request: FastifyRequest) {
        try {
            const { id } = request.params as { id: string };
            const appoiment = await this.appointmentService.cancelAppoiment(id);
            return appoiment;
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
    async confirmAppoiment(request: FastifyRequest) {
        try {
            const { id } = request.params as { id: string };
            const appoiment = await this.appointmentService.confirmAppoiment(id);
            return appoiment;
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
    async completeAppoiment(request: FastifyRequest) {
        try {
            const { id } = request.params as { id: string };
            const appoiment = await this.appointmentService.completeAppoiment(id);
            return appoiment;
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
