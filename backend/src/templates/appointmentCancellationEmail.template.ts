import { AppointmentCancellationEmailParams } from '@/types/email-templates.types';

export function appointmentCancellationEmailTemplate(
	params: AppointmentCancellationEmailParams,
): string {
	const { customerName, appointmentDate } = params;

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
    <title>Agendamento Cancelado - TWENT</title>
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
                            <div style="text-align: center; margin-bottom: 24px;">
                                <div style="display: inline-block; width: 64px; height: 64px; background-color: #FED7D7; border-radius: 50%; line-height: 64px;">
                                    <span style="font-size: 32px;">!</span>
                                </div>
                            </div>
                            
                            <h2 style="margin: 0 0 20px 0; color: #0F0F0F; font-size: 24px; font-weight: 600; text-align: center;">
                                Agendamento Cancelado
                            </h2>
                            
                            <p style="margin: 0 0 16px 0; color: #4A5568; font-size: 16px; line-height: 1.6;">
                                Olá, <strong>${customerName}</strong>
                            </p>
                            
                            <p style="margin: 0 0 24px 0; color: #4A5568; font-size: 16px; line-height: 1.6;">
                                Infelizmente, seu agendamento foi cancelado. Lamentamos qualquer inconveniente.
                            </p>
                            
                            <!-- Informações do Agendamento Cancelado -->
                            <div style="margin: 24px 0; padding: 24px; background-color: #FFF5F5; border-radius: 8px; border-left: 4px solid #E53E3E;">
                                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; text-align: center;">
                                            <strong style="color: #0F0F0F; font-size: 16px;">Data e Hora (Cancelado)</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; text-align: center;">
                                            <p style="margin: 0; color: #742A2A; font-size: 18px; font-weight: 600;">
                                                ${formattedDate}
                                            </p>
                                            <p style="margin: 8px 0 0 0; color: #742A2A; font-size: 18px; font-weight: 600;">
                                                às ${formattedTime}
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <div style="margin: 24px 0; padding: 16px; background-color: #EBF8FF; border-radius: 4px;">
                                <p style="margin: 0 0 8px 0; color: #2C5282; font-size: 14px; font-weight: 600;">
                                    💡 Deseja reagendar?
                                </p>
                                <p style="margin: 0; color: #2C5282; font-size: 14px; line-height: 1.6;">
                                    Entre em contato conosco para agendar um novo horário que melhor se adapte à sua agenda.
                                </p>
                            </div>
                            
                            <div style="margin: 24px 0; padding: 16px; background-color: #F7FAFC; border-radius: 4px;">
                                <p style="margin: 0; color: #4A5568; font-size: 14px; line-height: 1.6;">
                                    Se você tiver alguma dúvida ou precisar de mais informações, estamos à disposição para ajudar.
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

