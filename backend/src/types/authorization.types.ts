export interface IAuthorizationOptions {
	requiredRoles?: string[];
}

export interface IJwtProvider {
	sign(payload: object, options?: Record<string, unknown>): string;
}

export interface IJwtAuthPayload {
	id: string;
	roles: string[];
	storeId?: string;
}

export interface ILoginInput {
	email: string;
	password: string;
}
