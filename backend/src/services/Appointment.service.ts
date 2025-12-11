import { CreateAppointment } from '@/schemas/appointment.schema';
import { AppError } from '@/utils/errors.util';
import { PrismaClient } from '@prisma/generated/client';
import { Resend } from 'resend';
import { appointmentNotificationEmailTemplate } from '@/templates/appointmentNotificationEmail.template';
import { appointmentConfirmationEmailTemplate } from '@/templates/appointmentConfirmationEmail.template';
import { appointmentCancellationEmailTemplate } from '@/templates/appointmentCancellationEmail.template';

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

			// Verificar se o cliente existe (opcional - não bloqueia o agendamento)
			const customer = await this.database.user.findUnique({
				where: {
					email: appointmentData.customer_email,
				},
				select: {
					id: true,
				},
			});

			// Buscar a loja para obter o email
			if (!appointmentData.store_id) {
				throw new AppError({
					message: 'ID da loja é obrigatório.',
					errorCode: 'NOT_FOUND',
				});
			}

			const store = await this.database.store.findUnique({
				where: {
					id: appointmentData.store_id,
				},
				select: {
					email: true,
					name: true,
				},
			});

			if (!store) {
				throw new AppError({
					message: 'Loja não encontrada.',
					errorCode: 'NOT_FOUND',
				});
			}

			// Criar o agendamento no banco de dados
			const appointment = await this.database.appointment.create({
				data: {
					store_id: appointmentData.store_id,
					customer_id: customer?.id || null, // Pode ser null se o cliente não existir
					customer_name: appointmentData.customer_name,
					customer_email: appointmentData.customer_email,
					customer_phone: appointmentData.customer_phone,
					appointment_date: appointmentData.appointment_date,
					notes: appointmentData.notes || null,
					status: 'SCHEDULED',
				},
			});

			// Tentar enviar email para a loja (não bloqueia a criação do appointment)
			try {
				const { error } = await this.resend.emails.send({
					from: this.fromEmail,
					to: 'noreply.twent@gmail.com',
					subject: 'Novo Agendamento - TWENT',
					html: appointmentNotificationEmailTemplate({
						customerName: appointmentData.customer_name,
						customerEmail: appointmentData.customer_email,
						customerPhone: appointmentData.customer_phone,
						appointmentDate: appointmentData.appointment_date,
						notes: appointmentData.notes,
					}),
				});

				if (error) {
					console.error('Erro ao enviar email de agendamento:', error);
					// Não lança erro, apenas loga
				}
			} catch (emailError) {
				console.error('Erro ao enviar email de agendamento:', emailError);
				// Não lança erro, apenas loga - o appointment já foi criado
			}

			return appointment;
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
			if (error instanceof AppError) {
				throw error;
			}
			console.log(error);
			throw new AppError({
				message: error.message,
				errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
			});
		}
	}

	async get(storeId?: string) {
		try {
			const whereClause: any = {};
			// Se storeId for fornecido, filtra por loja; caso contrário, retorna todos
			if (storeId !== undefined) {
				whereClause.store_id = storeId;
			}
			
			const appointments = await this.database.appointment.findMany({
				where: whereClause,
				orderBy: { appointment_date: 'desc' },
				select: {
					id: true,
					store_id: true,
					customer_id: true,
					customer_name: true,
					customer_email: true,
					customer_phone: true,
					appointment_date: true,
					notes: true,
					status: true,
					created_at: true,
				},
			});
			return appointments;
		} catch (error) {
			throw new AppError({
				message: error.message,
				errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
			});
		}
	}

	async cancelAppointment(id: string, storeId?: string) {
		try {
			// Verifica se o agendamento existe e se pertence à loja do usuário (se storeId fornecido)
			const whereClause: any = { id };
			if (storeId !== undefined) {
				whereClause.store_id = storeId;
			}
			
			const existingAppointment = await this.database.appointment.findUnique({
				where: { id },
			});
			
			if (!existingAppointment) {
				throw new AppError({
					message: 'Agendamento não encontrado',
					errorCode: 'NOT_FOUND',
				});
			}
			
			// Se storeId fornecido, verifica se pertence à loja
			if (storeId !== undefined && existingAppointment.store_id !== storeId) {
				throw new AppError({
					message: 'Agendamento não encontrado',
					errorCode: 'NOT_FOUND',
				});
			}
			
			const appointment = await this.database.appointment.update({
				where: { id },
				data: { status: 'CANCELLED' },
			});

			// Tentar enviar email (não bloqueia o cancelamento)
			try {
				const { error } = await this.resend.emails.send({
					from: this.fromEmail,
					to: appointment.customer_email,
					subject: 'Agendamento Cancelado - TWENT',
					html: appointmentCancellationEmailTemplate({
						customerName: appointment.customer_name,
						appointmentDate: appointment.appointment_date,
					}),
				});

				if (error) {
					console.error('Erro ao enviar email de cancelamento:', error);
				}
			} catch (emailError) {
				console.error('Erro ao enviar email de cancelamento:', emailError);
			}

			return appointment;
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

	async confirmAppointment(id: string, storeId?: string) {
		try {
			// Verifica se o agendamento existe e se pertence à loja do usuário (se storeId fornecido)
			const existingAppointment = await this.database.appointment.findUnique({
				where: { id },
			});
			
			if (!existingAppointment) {
				throw new AppError({
					message: 'Agendamento não encontrado',
					errorCode: 'NOT_FOUND',
				});
			}
			
			// Se storeId fornecido, verifica se pertence à loja
			if (storeId !== undefined && existingAppointment.store_id !== storeId) {
				throw new AppError({
					message: 'Agendamento não encontrado',
					errorCode: 'NOT_FOUND',
				});
			}
			
			const appointment = await this.database.appointment.update({
				where: { id },
				data: { status: 'CONFIRMED' },
			});

			// Tentar enviar email (não bloqueia a confirmação)
			try {
				const { error } = await this.resend.emails.send({
					from: this.fromEmail,
					to: appointment.customer_email,
					subject: 'Agendamento Confirmado - TWENT',
					html: appointmentConfirmationEmailTemplate({
						customerName: appointment.customer_name,
						appointmentDate: appointment.appointment_date,
						notes: appointment.notes,
					}),
				});

				if (error) {
					console.error('Erro ao enviar email de confirmação:', error);
				}
			} catch (emailError) {
				console.error('Erro ao enviar email de confirmação:', emailError);
			}

			return appointment;
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

	async completeAppointment(id: string, storeId?: string) {
		try {
			// Verifica se o agendamento existe e se pertence à loja do usuário (se storeId fornecido)
			const existingAppointment = await this.database.appointment.findUnique({
				where: { id },
			});
			
			if (!existingAppointment) {
				throw new AppError({
					message: 'Agendamento não encontrado',
					errorCode: 'NOT_FOUND',
				});
			}
			
			// Se storeId fornecido, verifica se pertence à loja
			if (storeId !== undefined && existingAppointment.store_id !== storeId) {
				throw new AppError({
					message: 'Agendamento não encontrado',
					errorCode: 'NOT_FOUND',
				});
			}
			
			const appointment = await this.database.appointment.update({
				where: { id },
				data: { status: 'COMPLETED' },
			});
			return appointment;
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

