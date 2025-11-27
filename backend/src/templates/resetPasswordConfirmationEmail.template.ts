import { PasswordChangedEmailParams } from '@/types/email-templates.types';

export function passwordChangedEmailTemplate(
	params: PasswordChangedEmailParams,
): string {
	const { userName } = params;

	return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Senha Alterada - TWENT</title>
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
                                <div style="display: inline-block; width: 64px; height: 64px; background-color: #C6F6D5; border-radius: 50%; line-height: 64px;">
                                    <span style="font-size: 32px;">✓</span>
                                </div>
                            </div>
                            
                            <h2 style="margin: 0 0 20px 0; color: #0F0F0F; font-size: 24px; font-weight: 600; text-align: center;">
                                Senha Alterada com Sucesso
                            </h2>
                            
                            <p style="margin: 0 0 16px 0; color: #4A5568; font-size: 16px; line-height: 1.6;">
                                Olá, <strong>${userName}</strong>
                            </p>
                            
                            <p style="margin: 0 0 16px 0; color: #4A5568; font-size: 16px; line-height: 1.6;">
                                Sua senha foi alterada com sucesso. Você já pode fazer login com sua nova senha.
                            </p>
                            
                            <div style="margin: 24px 0; padding: 16px; background-color: #FFF5F5; border-left: 4px solid #DE1A26; border-radius: 4px;">
                                <p style="margin: 0; color: #C53030; font-size: 14px; line-height: 1.6;">
                                    <strong>⚠️ Não reconhece esta alteração?</strong>
                                </p>
                                <p style="margin: 8px 0 0 0; color: #C53030; font-size: 14px; line-height: 1.6;">
                                    Se você não realizou esta alteração, entre em contato conosco imediatamente.
                                </p>
                            </div>
                            
                            <div style="margin: 24px 0 0 0; padding: 16px; background-color: #EBF8FF; border-radius: 4px; text-align: center;">
                                <p style="margin: 0 0 8px 0; color: #2C5282; font-size: 14px; font-weight: 600;">
                                    Dicas de Segurança
                                </p>
                                <ul style="margin: 0; padding-left: 20px; text-align: left; color: #2C5282; font-size: 13px; line-height: 1.8;">
                                    <li>Nunca compartilhe sua senha com ninguém</li>
                                    <li>Use senhas fortes e únicas para cada serviço</li>
                                    <li>Ative a autenticação de dois fatores quando disponível</li>
                                    <li>Altere sua senha regularmente</li>
                                </ul>
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
