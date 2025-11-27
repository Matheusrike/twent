import { PasswordResetEmailParams } from '@/types/email-templates.types';

export function passwordResetEmailTemplate(
	params: PasswordResetEmailParams,
): string {
	const { userName, resetUrl, expirationMinutes } = params;

	return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperação de Senha - TWENT</title>
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
                                Recuperação de Senha
                            </h2>
                            
                            <p style="margin: 0 0 16px 0; color: #4A5568; font-size: 16px; line-height: 1.6;">
                                Olá, <strong>${userName}</strong>
                            </p>
                            
                            <p style="margin: 0 0 16px 0; color: #4A5568; font-size: 16px; line-height: 1.6;">
                                Recebemos uma solicitação para redefinir a senha da sua conta na TWENT. 
                                Se você não fez esta solicitação, pode ignorar este email com segurança.
                            </p>
                            
                            <p style="margin: 0 0 24px 0; color: #4A5568; font-size: 16px; line-height: 1.6;">
                                Para redefinir sua senha, clique no botão abaixo:
                            </p>
                            
                            <!-- Button -->
                            <table role="presentation" style="margin: 0 0 24px 0;">
                                <tr>
                                    <td style="border-radius: 4px; background-color: #DE1A26;">
                                        <a href="${resetUrl}" 
                                           target="_blank" 
                                           style="display: inline-block; padding: 16px 32px; font-size: 16px; color: #FFFFFF; text-decoration: none; font-weight: 600; letter-spacing: 0.5px;">
                                            Redefinir Senha
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <div style="margin: 24px 0; padding: 16px; background-color: #FFF5F5; border-left: 4px solid #DE1A26; border-radius: 4px;">
                                <p style="margin: 0; color: #C53030; font-size: 14px; line-height: 1.6;">
                                    <strong>⚠️ Importante:</strong> Este link expira em ${expirationMinutes} minutos por questões de segurança.
                                </p>
                            </div>
                            
                            <p style="margin: 24px 0 0 0; color: #718096; font-size: 14px; line-height: 1.6;">
                                Se o botão não funcionar, copie e cole este link no seu navegador:
                            </p>
                            <p style="margin: 8px 0 0 0; word-break: break-all;">
                                <a href="${resetUrl}" 
                                   style="color: #DE1A26; font-size: 14px; text-decoration: underline;">
                                    ${resetUrl}
                                </a>
                            </p>
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
