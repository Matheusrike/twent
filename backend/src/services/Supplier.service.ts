import {
	CreateSupplierType,
	UpdateSupplierType,
	ISupplierFilters,
} from '@/schemas/supplier.schema';
import { IJwtAuthPayload } from '@/types/authorization.types';
import { IPaginationParams } from '@/types/pagination.types';
import { AppError } from '@/utils/errors.util';
import { Prisma, PrismaClient } from '@prisma/generated/client';

export class SupplierService {
	constructor(private database: PrismaClient) {}

	async create(data: CreateSupplierType, user: IJwtAuthPayload) {
		try {
			const existingSupplier = await this.database.supplier.findFirst({
				where: {
					email: data.email,
				},
			});

			if (existingSupplier) {
				throw new AppError({
					message: 'Fornecedor com este email já existe',
					errorCode: 'SUPPLIER_EMAIL_ALREADY_EXISTS',
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
					errorCode: 'SUPPLIER_PHONE_ALREADY_EXISTS',
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
					user_id: user.id,
					action: 'CREATE',
					entity: 'Supplier',
					entity_id: supplier.id,
					new_value: supplier,
				},
			});

			return supplier;
		} catch (error) {
			if (error instanceof AppError) throw error;
			throw error;
		}
	}

	async findAll(
		user: IJwtAuthPayload,
		filters?: ISupplierFilters,
		pagination?: IPaginationParams,
	) {
		const page =
			pagination?.page && pagination.page > 0 ? pagination.page : 1;
		const limit =
			pagination?.limit && pagination.limit > 0 ? pagination.limit : 10;
		const skip = (page - 1) * limit;

		const where: Prisma.SupplierWhereInput = {};

		if (filters?.name) {
			where.name = {
				contains: filters.name,
			};
		}

		if (filters?.email) {
			where.email = {
				contains: filters.email,
			};
		}

		if (filters?.contact_name) {
			where.contact_name = {
				contains: filters.contact_name,
			};
		}

		if (filters?.city) {
			where.city = {
				contains: filters.city,
			};
		}

		if (filters?.state) {
			where.state = {
				contains: filters.state,
			};
		}

		if (filters?.country) {
			where.country = {
				contains: filters.country,
			};
		}

		if (filters?.is_active !== undefined) {
			where.is_active = filters.is_active;
		} else {
			where.is_active = true;
		}

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
				take: limit,
			}),
			this.database.supplier.count({ where }),
		]);

		const totalPages = Math.ceil(total / limit);
		const hasNext = page < totalPages;
		const hasPrev = page > 1;

		return {
			suppliers,
			pagination: {
				page,
				limit,
				total,
				totalPages,
				hasNext,
				hasPrev,
			},
		};
	}

	async findById(id: string) {
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
				errorCode: 'SUPPLIER_NOT_FOUND',
			});
		}

		if (!supplier.is_active) {
			throw new AppError({
				message: 'Fornecedor inativo',
				errorCode: 'SUPPLIER_INACTIVE',
			});
		}

		return supplier;
	}

	async update(id: string, data: UpdateSupplierType, user: IJwtAuthPayload) {
		try {
			const existingSupplier = await this.database.supplier.findUnique({
				where: { id },
			});

			if (!existingSupplier) {
				throw new AppError({
					message: 'Fornecedor não encontrado',
					errorCode: 'SUPPLIER_NOT_FOUND',
				});
			}

			if (!existingSupplier.is_active) {
				throw new AppError({
					message: 'Não é possível atualizar um fornecedor inativo',
					errorCode: 'SUPPLIER_INACTIVE',
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
						errorCode: 'SUPPLIER_EMAIL_ALREADY_EXISTS',
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
						errorCode: 'SUPPLIER_PHONE_ALREADY_EXISTS',
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
			if (error instanceof AppError) throw error;
			throw error;
		}
	}

	async setActiveStatus(id: string, user: IJwtAuthPayload) {
		const supplier = await this.database.supplier.findUnique({
			where: { id },
		});

		if (!supplier) {
			throw new AppError({
				message: 'Fornecedor não encontrado',
				errorCode: 'SUPPLIER_NOT_FOUND',
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
	}

	async delete(id: string, user: IJwtAuthPayload) {
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
				errorCode: 'SUPPLIER_NOT_FOUND',
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
	}

	async getTransactions(id: string) {
		const supplier = await this.database.supplier.findUnique({
			where: { id },
		});

		if (!supplier) {
			throw new AppError({
				message: 'Fornecedor não encontrado',
				errorCode: 'SUPPLIER_NOT_FOUND',
			});
		}

		const transactions = await this.database.financialTransaction.findMany({
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
	}
}
