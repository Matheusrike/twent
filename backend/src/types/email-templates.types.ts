export interface PasswordResetEmailParams {
	userName: string;
	resetUrl: string;
	expirationMinutes: number;
}

export interface PasswordChangedEmailParams {
	userName: string;
}

export interface AppointmentNotificationEmailParams {
	customerName: string;
	customerEmail: string;
	customerPhone: string;
	appointmentDate: Date;
	notes?: string | null;
}

export interface AppointmentConfirmationEmailParams {
	customerName: string;
	appointmentDate: Date;
	notes?: string | null;
}

export interface AppointmentCancellationEmailParams {
	customerName: string;
	appointmentDate: Date;
}
