import { CashRegisterService } from '@/services/CashRegister.service';
import { IJwtAuthPayload } from '@/types/authorization.types';
import { AppError, HttpError } from '@/utils/errors.util';
import { FastifyRequest } from 'fastify';

export class CashRegisterController {
	constructor(private cashRegisterService: CashRegisterService) {}

	async getCashRegisters(request: FastifyRequest) {
		try {
			const { storeId } = request.user as IJwtAuthPayload;
			const response =
				await this.cashRegisterService.getCashRegisters(storeId!);
			return response;
		} catch (error) {
			if (error instanceof AppError) {
				throw new HttpError({
					message: error.message,
					statusCode: 400,
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
            const response = await this.cashRegisterService.newCashRegister(storeId!);
            return response;
        } catch (error) {
            if (error instanceof AppError) {
                throw new HttpError({
                    message: error.message,
                    statusCode: 400,
                    errorCode: error.errorCode,
                });
            }
            throw new HttpError({
                message: error.message,
                statusCode: 500,
                errorCode: 'INTERNAL_SERVER_ERROR',
            })
        }
    }

    async activateCashRegister(request: FastifyRequest) {
        try {
            const { id } = request.params as { id: string };
            const response = await this.cashRegisterService.activateCashRegister(id);
            return response;
        } catch (error) {
            if (error instanceof AppError) {
                throw new HttpError({
                    message: error.message,
                    statusCode: 400,
                    errorCode: error.errorCode,
                });
            }
        }
    }
    async deactivateCashRegister(request: FastifyRequest) {
        try {
            const { id } = request.params as { id: string };
            const response = await this.cashRegisterService.deactivateCashRegister(id);
            return response;
        } catch (error) {
            if (error instanceof AppError) {
                throw new HttpError({
                    message: error.message,
                    statusCode: 400,
                    errorCode: error.errorCode,
                });
            }
        }
    }
}
