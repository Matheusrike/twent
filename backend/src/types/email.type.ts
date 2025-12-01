export interface SendPasswordResetEmailParams {
	to: string;
	userName: string;
	resetUrl: string;
	expirationMinutes: number;
}

export interface SendPasswordChangedEmailParams {
	to: string;
	userName: string;
}
