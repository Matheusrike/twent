export interface IAuthorizationOptions {
	requiredRoles?: string[];
}

export interface IJwtAuthPayload {
	id: string;
	firstName: string;
	email: string;
	role: string;
}
