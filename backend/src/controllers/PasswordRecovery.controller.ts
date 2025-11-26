import { FastifyRequest } from 'fastify';
import { PasswordRecoveryService } from '@/services/PasswordRecovery.service';
import {
	RequestPasswordResetType,
	ResetPasswordType,
} from '@/schemas/password-recovery.schema';
import { AppError, HttpError } from '@/utils/errors.util';

export class PasswordRecoveryController {
	constructor(private passwordRecoveryService: PasswordRecoveryService) {}

	async requestPasswordReset(request: FastifyRequest) {
		try {
			const { email } = request.body as RequestPasswordResetType;
			await this.passwordRecoveryService.requestPasswordReset(email);
		} catch (error) {
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'NOT_FOUND':
					case 'INACTIVE':
						throw new HttpError({
							statusCode: 400,
							message: error.message,
							errorCode: error.errorCode,
						});
					default:
						throw new HttpError({
							statusCode: 400,
							message: error.message,
							errorCode: error.errorCode,
						});
				}
			}

			console.error('Unexpected error in password reset:', error);
			throw new HttpError({
				statusCode: 500,
				message: 'Erro ao processar solicitação',
				errorCode: 'INTERNAL_SERVER_ERROR',
			});
		}
	}

	async validateToken(request: FastifyRequest) {
		try {
			const { token } = request.params as { token: string };
			const isValid =
				await this.passwordRecoveryService.validateToken(token);
			return isValid;
		} catch (error) {
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'TOKEN_NOT_FOUND':
					case 'TOKEN_EXPIRED':
						throw new HttpError({
							statusCode: 400,
							message: error.message,
							errorCode: error.errorCode,
						});
					default:
						throw new HttpError({
							statusCode: 400,
							message: error.message,
							errorCode: error.errorCode,
						});
				}
			}

			console.error('Unexpected error validating token:', error);
			throw new HttpError({
				statusCode: 500,
				message: 'Erro ao validar token',
				errorCode: 'INTERNAL_SERVER_ERROR',
			});
		}
	}

	async resetPassword(request: FastifyRequest) {
		try {
			const data = request.body as ResetPasswordType;
			await this.passwordRecoveryService.resetPassword(
				data.token,
				data.password,
			);
		} catch (error) {
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'TOKEN_NOT_FOUND':
					case 'TOKEN_EXPIRED':
					case 'TOKEN_ALREADY_USED':
						throw new HttpError({
							statusCode: 400,
							message: error.message,
							errorCode: error.errorCode,
						});
					case 'USER_NOT_FOUND':
						throw new HttpError({
							statusCode: 404,
							message: error.message,
							errorCode: error.errorCode,
						});
					default:
						throw new HttpError({
							statusCode: 400,
							message: error.message,
							errorCode: error.errorCode,
						});
				}
			}

			console.error('Unexpected error resetting password:', error);
			throw new HttpError({
				statusCode: 500,
				message: 'Erro ao redefinir senha',
				errorCode: 'INTERNAL_SERVER_ERROR',
			});
		}
	}
}
