import { CreateAppointment } from '@/schemas/appointment.schema';
import { AppError } from '@/utils/errors.util';
import { PrismaClient } from '@prisma/generated/client';
import { Resend } from 'resend';

export class AppointmentService {
	private resend: Resend;
	private fromEmail: string;

	constructor(private database: PrismaClient) {
		const apiKey = process.env.RESEND_API_KEY;

		if (!apiKey) {
			throw new Error(
				'RESEND_API_KEY não configurada nas variáveis de ambiente',
			);
		}

		this.resend = new Resend(apiKey);
		this.fromEmail = process.env.FROM_EMAIL || 'noreply@twent.com';
	}
	async create(appointmentData: CreateAppointment) {
		try {
            appointmentData.appointment_date = new Date(
				appointmentData.appointment_date,
			);

            const customer = await this.database.user.findUnique({
                where: {
                    email: appointmentData.customer_email
                },
                select: {
                    id: true
                }
            })

            if (!customer) {
                throw new AppError({
                    message: 'Cliente nao encontrado.',
                    errorCode: 'NOT_FOUND',
                });
            }
            const { data, error } = await this.resend.emails.send({
				from: this.fromEmail,
				to: 'noreply.twent@gmail.com',
				subject: 'Novo Agendamento - TWENT',
				html: `<h1>Novo Agendamento</h1>
                <p>Cliente ID: ${customer!.id}</p>
                <p>Nome: ${appointmentData.customer_name}</p>
                <p>Telefone: ${appointmentData.customer_phone}</p>
                <p>Email: ${appointmentData.customer_email}</p>
                <p>Data: ${appointmentData.appointment_date}</p>`,
			});
            if (error) {
                throw new AppError({
                    message: error.name + ': ' + error.message,
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
