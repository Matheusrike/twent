import { fastifyTypedInstance } from '@/types/types';
import { PasswordRecoveryController } from '@/controllers/PasswordRecovery.controller';
import { PasswordRecoveryService } from '@/services/PasswordRecovery.service';
import { EmailService } from '@/services/Email.service';
import {
	requestPasswordResetSchema,
	resetPasswordSchema,
} from '@/schemas/password-recovery.schema';
import prisma from '@prisma/client';
import { ApiResponse } from '@/utils/api-response.util';
import { HttpError } from '@/utils/errors.util';

export async function passwordRecoveryRoutes(app: fastifyTypedInstance) {
	const emailService = new EmailService();
	const passwordRecoveryService = new PasswordRecoveryService(
		prisma,
		emailService,
	);
	const passwordRecoveryController = new PasswordRecoveryController(
		passwordRecoveryService,
	);

	app.post(
		'/request',
		{
			schema: {
				tags: ['Password Recovery'],
				summary: 'Solicita um token de recuperação de senha',
				description:
					'Envia um email com link de recuperação válido por 5 minutos',
				body: requestPasswordResetSchema,
			},
		},
		async (request, reply) => {
			try {
				await passwordRecoveryController.requestPasswordReset(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message:
						'Se o email existir, um link de recuperação será enviado',
				}).send(reply);
			} catch (error) {
				if (error instanceof HttpError) {
					return new ApiResponse({
						statusCode: error.statusCode,
						success: false,
						message: error.message,
						errorCode: error.errorCode,
					}).send(reply);
				}

				return new ApiResponse({
					statusCode: 500,
					success: false,
					message: 'Erro ao processar solicitação',
					errorCode: 'INTERNAL_SERVER_ERROR',
				}).send(reply);
			}
		},
	);

	app.get(
		'/validate/:token',
		{
			schema: {
				tags: ['Password Recovery'],
				summary: 'Valida um token de recuperação',
				description: 'Verifica se o token é válido e não expirou',
			},
		},
		async (request, reply) => {
			try {
				const isValid =
					await passwordRecoveryController.validateToken(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Token validado com sucesso',
					data: { valid: isValid },
				}).send(reply);
			} catch (error) {
				if (error instanceof HttpError) {
					return new ApiResponse({
						statusCode: error.statusCode,
						success: false,
						message: error.message,
						errorCode: error.errorCode,
					}).send(reply);
				}

				return new ApiResponse({
					statusCode: 500,
					success: false,
					message: 'Erro ao validar token',
					errorCode: 'INTERNAL_SERVER_ERROR',
				}).send(reply);
			}
		},
	);

	app.patch(
		'/reset',
		{
			schema: {
				tags: ['Password Recovery'],
				summary: 'Redefine a senha do usuário',
				description: 'Redefine a senha usando um token válido',
				body: resetPasswordSchema,
			},
		},
		async (request, reply) => {
			try {
				await passwordRecoveryController.resetPassword(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Senha redefinida com sucesso',
				}).send(reply);
			} catch (error) {
				if (error instanceof HttpError) {
					return new ApiResponse({
						statusCode: error.statusCode,
						success: false,
						message: error.message,
						errorCode: error.errorCode,
					}).send(reply);
				}

				return new ApiResponse({
					statusCode: 500,
					success: false,
					message: 'Erro ao redefinir senha',
					errorCode: 'INTERNAL_SERVER_ERROR',
				}).send(reply);
			}
		},
	);
}
