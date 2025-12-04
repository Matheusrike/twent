import { passwordChangedEmailTemplate } from '@/templates/resetPasswordConfirmationEmail.template';
import { passwordResetEmailTemplate } from '@/templates/resetPasswordEmail.template';
import { AppError } from '@/utils/errors.util';
import { Resend } from 'resend';

interface SendPasswordResetEmailParams {
	to: string;
	userName: string;
	resetUrl: string;
	expirationMinutes: number;
}

interface SendPasswordChangedEmailParams {
	to: string;
	userName: string;
}

export class EmailService {
	private resend: Resend;
	private fromEmail: string;

	constructor() {
		const apiKey = process.env.RESEND_API_KEY;

		if (!apiKey) {
			throw new Error(
				'RESEND_API_KEY não configurada nas variáveis de ambiente',
			);
		}

		this.resend = new Resend(apiKey);
		this.fromEmail = process.env.FROM_EMAIL || 'noreply@twent.com';
	}

	async sendPasswordResetEmail(
		params: SendPasswordResetEmailParams,
	): Promise<void> {
		try {
			const { to, userName, resetUrl, expirationMinutes } = params;

			const {error} = await this.resend.emails.send({
				from: this.fromEmail,
				to,
				subject: 'Recuperação de Senha - TWENT',
				html: passwordResetEmailTemplate({
					userName,
					resetUrl,
					expirationMinutes,
				}),
			});
            if (error) {
                throw new AppError({
                    message: error.name + ': ' + error.message,
                    errorCode: 'INTERNAL_SERVER_ERROR',
                })
            }

			console.log(`Password reset email sent to: ${to}`);
		} catch (error) {
			console.error('Error sending password reset email:', error);
			throw new AppError({
				message: error.message,
				errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
			});
		}
	}

	/**
	 * Envia email de confirmação de mudança de senha
	 */
	async sendPasswordChangedEmail(
		params: SendPasswordChangedEmailParams,
	): Promise<void> {
		try {
			const { to, userName } = params;

			const { error } = await this.resend.emails.send({
				from: this.fromEmail,
				to,
				subject: 'Senha Alterada com Sucesso - TWENT',
				html: passwordChangedEmailTemplate({ userName }),
			});

            if (error) {
                throw new AppError({
                    message: error.name + ': ' + error.message,
                    errorCode: 'INTERNAL_SERVER_ERROR',
                })
            }

			console.log(`Password changed confirmation email sent to: ${to}`);
		} catch (error) {
			console.error('Error sending password changed email:', error);
			// Não lançamos erro aqui pois a senha já foi alterada
			// O email de confirmação é apenas informativo
		}
	}

	/**
	 * Envia email de boas-vindas (pode ser usado no registro)
	 */
	async sendWelcomeEmail(to: string, userName: string): Promise<void> {
		try {
			await this.resend.emails.send({
				from: this.fromEmail,
				to,
				subject: 'Bem-vindo à TWENT',
				html: `
					<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
						<h2>Bem-vindo, ${userName}!</h2>
						<p>É um prazer tê-lo conosco na TWENT.</p>
						<p>Sua conta foi criada com sucesso.</p>
					</div>
				`,
			});
		} catch (error) {
			console.error('Error sending welcome email:', error);
		}
	}
}
