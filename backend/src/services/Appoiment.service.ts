import { CreateAppointment } from '@/schemas/appointment.schema';
import { AppError } from '@/utils/errors.util';
import { PrismaClient } from '@prisma/generated/client';
import { Resend } from 'resend';

export class AppointmentService {
	constructor(private database: PrismaClient) {}
    private resend = new Resend
    private fromEmail = process.env.FROM_EMAIL || 'noreply@twent.com';

	async create(appointmentData: CreateAppointment, id: string) {
		try {
            appointmentData.appointment_date = new Date(
				appointmentData.appointment_date,
			);
            const { data, error } = await this.resend.emails.send({
				from: this.fromEmail,
				to: 'noreply.twent@gmail.com',
				subject: 'Novo Agendamento - TWENT',
				html: `<h1>Novo Agendamento</h1>
                <p>Cliente ID: ${id}</p>
                <p>Nome: ${appointmentData.customer_name}</p>
                <p>Telefone: ${appointmentData.customer_phone}</p>
                <p>Email: ${appointmentData.customer_email}</p>
                <p>Data: ${appointmentData.appointment_date}</p>`,
			});
            if (error) {
                throw new AppError({
                    message: error.message,
                    errorCode: 'INTERNAL_SERVER_ERROR',
                });
            }
			return data;
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

            await this.resend.emails.send({
                from: this.fromEmail,
                to: appoiment.customer_email,
                subject: 'Agendamento Cancelado - TWENT',
                html: `<h1>Agendamento Cancelado</h1>
                <p>Cliente ID: ${appoiment.customer_id}</p>
                <p>Nome: ${appoiment.customer_name}</p>
                <p>Telefone: ${appoiment.customer_phone}</p>
                <p>Email: ${appoiment.customer_email}</p>
                <p>Data: ${appoiment.appointment_date}</p>`,
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
            await this.resend.emails.send({
                from: this.fromEmail,
                to: appoiment.customer_email,
                subject: 'Agendamento Confirmado - TWENT',
                html: `<h1>Agendamento Confirmado</h1>
                <p>Cliente ID: ${appoiment.customer_id}</p>
                <p>Nome: ${appoiment.customer_name}</p>
                <p>Telefone: ${appoiment.customer_phone}</p>
                <p>Email: ${appoiment.customer_email}</p>
                <p>Data: ${appoiment.appointment_date}</p>`,
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
