import {
	CreateSupplierType,
	UpdateSupplierType,
	SupplierFilters,
} from '@/schemas/supplier.schema';
import { IJwtAuthPayload } from '@/types/authorization.types';
import { AppError } from '@/utils/errors.util';
import { Prisma, PrismaClient } from '@prisma/generated/client';

export class SupplierService {
	constructor(private database: PrismaClient) {}

	async create(data: CreateSupplierType, id: string) {
		try {
			const existingSupplier = await this.database.supplier.findFirst({
				where: {
					email: data.email,
				},
			});

			if (existingSupplier) {
				throw new AppError({
					message: 'Fornecedor com este email já existe',
					errorCode: 'CONFLICT',
				});
			}

			const existingPhone = await this.database.supplier.findFirst({
				where: {
					phone: data.phone,
				},
			});

			if (existingPhone) {
				throw new AppError({
					message: 'Fornecedor com este telefone já existe',
					errorCode: 'CONFLICT',
				});
			}

			const existingDocument = await this.database.supplier.findFirst({
				where: {
					document_number: data.document_number,
				},
			});

			if (existingDocument) {
				throw new AppError({
					message: 'Fornecedor com este documento já existe',
					errorCode: 'CONFLICT',
				});
			}

			const supplier = await this.database.supplier.create({
				data: {
					name: data.name,
					contact_name: data.contact_name,
					email: data.email,
					phone: data.phone,
					document_number: data.document_number,
					street: data.street,
					number: data.number,
					district: data.district,
					city: data.city,
					state: data.state,
					zip_code: data.zip_code,
					country: data.country,
				},
			});

			await this.database.auditLog.create({
				data: {
					user_id: id,
					action: 'CREATE',
					entity: 'Supplier',
					entity_id: supplier.id,
					new_value: supplier,
				},
			});

			return supplier;
		} catch (error) {
			throw new AppError({
				message: error.message,
				errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
			});
		}
	}
	async findAll(filters: SupplierFilters, page = 1, limit = 10) {
		try {
			const safePage = Math.max(1, page);
			const safeLimit = Math.max(1, limit);
			const skip = (safePage - 1) * safeLimit;

			const where: Prisma.SupplierWhereInput = {};

			if (filters?.name) {
				where.name = { startsWith: filters.name, mode: 'insensitive' };
			}

			if (filters?.email) {
				where.email = {
					startsWith: filters.email,
					mode: 'insensitive',
				};
			}

			for (const key of [
				'contact_name',
				'city',
				'state',
				'country',
			] as const) {
				if (filters?.[key]) {
					where[key] = {
						contains: filters[key],
						mode: 'insensitive',
					};
				}
			}

			where.is_active = filters?.is_active ?? true;

			const [suppliers, total] = await Promise.all([
				this.database.supplier.findMany({
					where,
					include: {
						_count: {
							select: {
								financial_transactions: true,
							},
						},
					},
					orderBy: { name: 'asc' },
					skip,
					take: safeLimit,
				}),
				this.database.supplier.count({ where }),
			]);

			const totalPages = Math.ceil(total / safeLimit);

			return {
				suppliers,
				pagination: {
					page: safePage,
					limit: safeLimit,
					total,
					totalPages,
					hasNext: safePage < totalPages,
					hasPrev: safePage > 1,
				},
			};
		} catch (error) {
			throw new AppError({
				message: error.message,
				errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
			});
		}
	}
	async findById(id: string) {
		try {
			const supplier = await this.database.supplier.findUnique({
				where: { id },
				include: {
					financial_transactions: {
						orderBy: { transaction_date: 'desc' },
						take: 10,
						include: {
							store: {
								select: {
									id: true,
									name: true,
									code: true,
								},
							},
							createdBy: {
								select: {
									id: true,
									first_name: true,
									last_name: true,
									email: true,
								},
							},
						},
					},
					_count: {
						select: {
							financial_transactions: true,
						},
					},
				},
			});

			if (!supplier) {
				throw new AppError({
					message: 'Fornecedor não encontrado',
					errorCode: 'NOT_FOUND',
				});
			}

			if (!supplier.is_active) {
				throw new AppError({
					message: 'Fornecedor inativo',
					errorCode: 'BAD_REQUEST',
				});
			}

			return supplier;
		} catch (error) {
			throw new AppError({
				message: error.message,
				errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
			});
		}
	}

	async update(id: string, data: UpdateSupplierType, user: IJwtAuthPayload) {
		try {
			const existingSupplier = await this.database.supplier.findUnique({
				where: { id },
			});

			if (!existingSupplier) {
				throw new AppError({
					message: 'Fornecedor não encontrado',
					errorCode: 'NOT_FOUND',
				});
			}

			if (!existingSupplier.is_active) {
				throw new AppError({
					message: 'Não é possível atualizar um fornecedor inativo',
					errorCode: 'BAD_REQUEST',
				});
			}

			if (data.email && data.email !== existingSupplier.email) {
				const emailExists = await this.database.supplier.findFirst({
					where: {
						email: data.email,
						id: { not: id },
					},
				});

				if (emailExists) {
					throw new AppError({
						message: 'Email já está em uso por outro fornecedor',
						errorCode: 'CONFLICT',
					});
				}
			}

			if (data.phone && data.phone !== existingSupplier.phone) {
				const phoneExists = await this.database.supplier.findFirst({
					where: {
						phone: data.phone,
						id: { not: id },
					},
				});

				if (phoneExists) {
					throw new AppError({
						message: 'Telefone já está em uso por outro fornecedor',
						errorCode: 'CONFLICT',
					});
				}
			}

			const updatedSupplier = await this.database.supplier.update({
				where: { id },
				data: {
					name: data.name,
					contact_name: data.contact_name,
					email: data.email,
					phone: data.phone,
					street: data.street,
					number: data.number,
					district: data.district,
					city: data.city,
					state: data.state,
					zip_code: data.zip_code,
					country: data.country,
					is_active: data.is_active,
				},
			});

			await this.database.auditLog.create({
				data: {
					user_id: user.id,
					action: 'UPDATE',
					entity: 'Supplier',
					entity_id: id,
					old_value: existingSupplier,
					new_value: updatedSupplier,
				},
			});

			return updatedSupplier;
		} catch (error) {
			throw new AppError({
				message: error.message,
				errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
			});
		}
	}

	async setActiveStatus(id: string, user: IJwtAuthPayload) {
		try {
			const supplier = await this.database.supplier.findUnique({
				where: { id },
			});

			if (!supplier) {
				throw new AppError({
					message: 'Fornecedor não encontrado',
					errorCode: 'NOT_FOUND',
				});
			}

			if (!supplier.is_active) {
				const updatedSupplier = await this.database.supplier.update({
					where: { id },
					data: { is_active: true },
				});

				await this.database.auditLog.create({
					data: {
						user_id: user.id,
						action: 'UPDATE',
						entity: 'Supplier',
						entity_id: id,
						old_value: supplier,
						new_value: updatedSupplier,
					},
				});
			}

			return supplier;
		} catch (error) {
			throw new AppError({
				message: error.message,
				errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
			});
		}
	}

	async delete(id: string, user: IJwtAuthPayload) {
		try {
			const supplier = await this.database.supplier.findUnique({
				where: { id },
				include: {
					_count: {
						select: {
							financial_transactions: true,
						},
					},
				},
			});

			if (!supplier) {
				throw new AppError({
					message: 'Fornecedor não encontrado',
					errorCode: 'NOT_FOUND',
				});
			}

			const oldData = { ...supplier };

			await this.database.supplier.update({
				where: { id },
				data: { is_active: false },
			});

			await this.database.auditLog.create({
				data: {
					user_id: user.id,
					action: 'DELETE',
					entity: 'Supplier',
					entity_id: id,
					old_value: oldData,
				},
			});
		} catch (error) {
			throw new AppError({
				message: error.message,
				errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
			});
		}
	}

	async getTransactions(id: string) {
		try {
			const supplier = await this.database.supplier.findUnique({
				where: { id },
			});

			if (!supplier) {
				throw new AppError({
					message: 'Fornecedor não encontrado',
					errorCode: 'NOT_FOUND',
				});
			}

			const transactions =
				await this.database.financialTransaction.findMany({
					where: {
						supplier_id: id,
					},
					include: {
						store: {
							select: {
								id: true,
								name: true,
								code: true,
								type: true,
							},
						},
						createdBy: {
							select: {
								id: true,
								first_name: true,
								last_name: true,
								email: true,
							},
						},
					},
					orderBy: { transaction_date: 'desc' },
				});

			return transactions;
		} catch (error) {
			throw new AppError({
				message: error.message,
				errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
			});
		}
	}
}
