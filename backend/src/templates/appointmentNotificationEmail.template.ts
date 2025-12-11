import { AppointmentNotificationEmailParams } from '@/types/email-templates.types';

export function appointmentNotificationEmailTemplate(
	params: AppointmentNotificationEmailParams,
): string {
	const { customerName, customerEmail, customerPhone, appointmentDate, notes } = params;

	// Formatar data e hora
	const date = new Date(appointmentDate);
	const formattedDate = date.toLocaleDateString('pt-BR', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
	const formattedTime = date.toLocaleTimeString('pt-BR', {
		hour: '2-digit',
		minute: '2-digit',
	});

	return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Novo Agendamento - TWENT</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F9F9FB;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #FFFFFF; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px 40px; text-align: center; background-color: #0F0F0F; border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0; color: #FFFFFF; font-size: 24px; font-weight: 600; letter-spacing: 2px;">
                                TWENT
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 20px 0; color: #0F0F0F; font-size: 24px; font-weight: 600;">
                                Novo Agendamento
                            </h2>
                            
                            <p style="margin: 0 0 24px 0; color: #4A5568; font-size: 16px; line-height: 1.6;">
                                Você recebeu um novo agendamento. Seguem os detalhes do cliente:
                            </p>
                            
                            <!-- Informações do Cliente -->
                            <div style="margin: 24px 0; padding: 24px; background-color: #F7FAFC; border-radius: 8px; border-left: 4px solid #DE1A26;">
                                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0;">
                                            <strong style="color: #0F0F0F; font-size: 14px;">Nome:</strong>
                                            <span style="color: #4A5568; font-size: 14px; margin-left: 8px;">${customerName}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0;">
                                            <strong style="color: #0F0F0F; font-size: 14px;">E-mail:</strong>
                                            <span style="color: #4A5568; font-size: 14px; margin-left: 8px;">${customerEmail}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0;">
                                            <strong style="color: #0F0F0F; font-size: 14px;">Telefone:</strong>
                                            <span style="color: #4A5568; font-size: 14px; margin-left: 8px;">${customerPhone}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0;">
                                            <strong style="color: #0F0F0F; font-size: 14px;">Data e Hora:</strong>
                                            <span style="color: #4A5568; font-size: 14px; margin-left: 8px;">${formattedDate} às ${formattedTime}</span>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            ${notes ? `
                            <!-- Mensagem do Cliente -->
                            <div style="margin: 24px 0; padding: 20px; background-color: #EBF8FF; border-radius: 8px; border-left: 4px solid #3182CE;">
                                <p style="margin: 0 0 8px 0; color: #2C5282; font-size: 14px; font-weight: 600;">
                                    Mensagem do Cliente:
                                </p>
                                <p style="margin: 0; color: #2C5282; font-size: 14px; line-height: 1.6; text-align: left;">
                                    ${notes}
                                </p>
                            </div>
                            ` : ''}
                            
                            <div style="margin: 24px 0; padding: 16px; background-color: #FFF5F5; border-left: 4px solid #DE1A26; border-radius: 4px;">
                                <p style="margin: 0; color: #C53030; font-size: 14px; line-height: 1.6;">
                                    <strong>⚠️ Atenção:</strong> Este agendamento está aguardando confirmação. Por favor, confirme ou entre em contato com o cliente.
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 24px 40px; background-color: #F7FAFC; border-radius: 0 0 8px 8px; border-top: 1px solid #E2E8F0;">
                            <p style="margin: 0 0 8px 0; color: #718096; font-size: 14px; line-height: 1.6;">
                                Este é um email automático, por favor não responda.
                            </p>
                            <p style="margin: 0; color: #718096; font-size: 14px; line-height: 1.6;">
                                © ${new Date().getFullYear()} TWENT. Todos os direitos reservados.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
	`;
}

