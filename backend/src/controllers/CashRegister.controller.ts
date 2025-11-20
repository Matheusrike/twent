import { CashRegisterService } from '@/services/CashRegister.service';
import { IJwtAuthPayload } from '@/types/authorization.types';
import { AppError, HttpError } from '@/utils/errors.util';
import { FastifyRequest } from 'fastify';

export class CashRegisterController {
	constructor(private cashRegisterService: CashRegisterService) {}

	async getCashRegisters(request: FastifyRequest) {
		try {
			const { storeId } = request.user as IJwtAuthPayload;
			const response = await this.cashRegisterService.getCashRegisters(
				storeId!,
			);
			return response;
		} catch (error) {
			if (error instanceof AppError) {
				throw new HttpError({
					message: error.message,
					statusCode: 500,
					errorCode: error.errorCode,
				});
			}
		}
	}

	async newCashRegister(request: FastifyRequest) {
		try {
			const { storeId } = request.user as IJwtAuthPayload;
			if (!storeId) {
				throw new HttpError({
					message: 'Store ID is missing in token',
					statusCode: 400,
					errorCode: 'BAD_REQUEST',
				});
			}
			const response = await this.cashRegisterService.newCashRegister(
				storeId!,
			);
			return response;
		} catch (error) {
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'BAD_REQUEST':
						throw new HttpError({
							message: error.message,
							statusCode: 400,
							errorCode: error.errorCode,
						});
					default:
						throw new HttpError({
							message: error.message,
							statusCode: 500,
							errorCode: error.errorCode,
						});
				}
			}
		}
	}

	async activateCashRegister(request: FastifyRequest) {
		try {
			const { id } = request.params as { id: string };
			const response =
				await this.cashRegisterService.activateCashRegister(id);
			return response;
		} catch (error) {
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'NOT_FOUND':
						throw new HttpError({
							message: error.message,
							statusCode: 404,
							errorCode: error.errorCode,
						});
					default:
						throw new HttpError({
							message: error.message,
							statusCode: 500,
							errorCode: error.errorCode,
						});
				}
			}
		}
	}
	async deactivateCashRegister(request: FastifyRequest) {
		try {
			const { id } = request.params as { id: string };
			const response =
				await this.cashRegisterService.deactivateCashRegister(id);
			return response;
		} catch (error) {
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'NOT_FOUND':
						throw new HttpError({
							message: error.message,
							statusCode: 404,
							errorCode: error.errorCode,
						});
					default:
						throw new HttpError({
							message: error.message,
							statusCode: 500,
							errorCode: error.errorCode,
						});
				}
			}
		}
	}

	async getOpenSessions() {
		try {
			const response = await this.cashRegisterService.getOpenSessions();
			return response;
		} catch (error) {
			if (error instanceof AppError) {
				throw new HttpError({
					message: error.message,
					statusCode: 500,
					errorCode: error.errorCode,
				});
			}
		}
	}

	async getClosedSessions(request: FastifyRequest) {
		try {
			const { id, cash_register_id } = request.query as {
				id: string;
				cash_register_id: string;
			};
			const response = await this.cashRegisterService.getClosedSessions(
				cash_register_id,
				id,
			);
			return response;
		} catch (error) {
			if (error instanceof AppError) {
				throw new HttpError({
					message: error.message,
					statusCode: 500,
					errorCode: error.errorCode,
				});
			}
		}
	}

	async openSession(request: FastifyRequest) {
		try {
			const { cash_register_id } = request.params as {
				cash_register_id: string;
			};
			const { id } = request.user as IJwtAuthPayload;
			const response = await this.cashRegisterService.openSession(
				cash_register_id,
				id,
			);
			return response;
		} catch (error) {
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'CONFLICT':
						throw new HttpError({
							message: error.message,
							statusCode: 409,
							errorCode: error.errorCode,
						});
					default:
						throw new HttpError({
							message: error.message,
							statusCode: 500,
							errorCode: error.errorCode,
						});
				}
			}
		}
	}

	async closeSession(request: FastifyRequest) {
		try {
			const { cash_register_id } = request.params as {
				cash_register_id: string;
			};
			const { closing_amount } = request.body as {
				closing_amount: number;
			};

			const response = await this.cashRegisterService.closeSession(
				cash_register_id,
				closing_amount,
			);
			return response;
		} catch (error) {
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'NOT_FOUND':
						throw new HttpError({
							message: error.message,
							statusCode: 404,
							errorCode: error.errorCode,
						});
					default:
						throw new HttpError({
							message: error.message,
							statusCode: 500,
							errorCode: error.errorCode,
						});
				}
			}
		}
	}
}
