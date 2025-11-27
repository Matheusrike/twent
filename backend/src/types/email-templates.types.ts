export interface PasswordResetEmailParams {
	userName: string;
	resetUrl: string;
	expirationMinutes: number;
}

export interface PasswordChangedEmailParams {
	userName: string;
}
