import { FastifyReply, FastifyRequest } from 'fastify';
import { UserService } from '../service/user.service.ts';
import { HttpError } from '../utils/errors.util.ts';
import { ApiResponse } from '../utils/api-response.util.ts';
import { TypeGetUserProps } from '../types/users.types.ts';

const userService = new UserService();
export class UserController {
	private service: UserService;
	constructor() {
		this.service = userService;

		this.getInfo = this.getInfo.bind(this);
		this.get = this.get.bind(this);
		this.changeStatus = this.changeStatus.bind(this);
	}

	async getInfo(
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply,
	) {
		try {
			const { id } = request.params;
			const response = await this.service.getInfo(id);
			reply.status(200).send(
				new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Informações do usuário encontradas',
					data: response,
				}),
			);
		} catch (error) {
			switch (error.errorCode) {
				case 'NOT_FOUND':
					return new HttpError({
						message: error.message,
						statusCode: 404,
					});
				default:
					return new HttpError({
						message: error.message,
						statusCode: 500,
					});
			}
		}
	}
	/*
model User {
  id                  String    @id @default(uuid()) @db.Char(36)
  store_id            String?
  user_type           UserType
  email               String    @unique
  password_hash       String
  first_name          String
  last_name           String
  phone               String?
  document_number     String?   @unique
  birth_date          DateTime?
  street              String?
  number              String?
  district            String?
  city                String?
  state               String?
  zip_code            String?
  country             String?
  reset_token         String?
  reset_token_expires DateTime?
  last_login_at       DateTime?
  is_active           Boolean   @default(true)
  created_at          DateTime  @default(now())
  updated_at          DateTime  @updatedAt

  store                  Store?                 @relation(fields: [store_id], references: [id])
  user_roles             UserRole[]
  employee               Employee?
  employee_leaves        EmployeeLeave[]        @relation("ApprovedBy")
  inventory_movements    InventoryMovement[]
  products_updated       Product[]              @relation("UpdatedBy")
  price_changes          ProductPriceHistory[]  @relation("ChangedBy")
  cash_sessions          CashSession[]
  sales_created          Sale[]                 @relation("SalesCreatedBy")
  appointments           Appointment[]
  financial_transactions FinancialTransaction[]
  audit_logs             AuditLog[]
  Sale                   Sale[]
  CustomerFavorite       CustomerFavorite[]
}*/
	async get(
		request: FastifyRequest<{
			Body: { filters?: TypeGetUserProps };
			Querystring: { skip?: number; take?: number };
		}>,
		reply: FastifyReply,
	) {
		try {
			if (!request.body) {
				const response = await this.service.get();
				return reply.status(200).send(
					new ApiResponse({
						statusCode: 200,
						success: true,
						message: 'Informações dos usuários encontradas',
						data: response,
					}),
				);
			}

			const { filters = {} } = request.body;

			const { skip = 0, take = 10 } = request.query;

			const response = await this.service.get(filters, skip, take);

			return reply.status(200).send(
				new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Informações do usuário encontradas',
					data: response,
				}),
			);
		} catch (error) {
			switch (error?.errorCode) {
				case 'BAD_REQUEST':
					return new HttpError({
						message: error.message,
						statusCode: 400,
					});
				case 'NOT_FOUND':
					return new HttpError({
						message: error.message,
						statusCode: 404,
					});
				default:
					console.error(error);
					return new HttpError({
						message: error?.message ?? 'Erro interno',
						statusCode: 500,
					});
			}
		}
	}

	async changeStatus(
		request: FastifyRequest<{
			Params: { id: string };
			Body: { newStatus: boolean };
		}>,
		reply: FastifyReply,
	) {
		try {
			const { id } = request.params;
			const { newStatus } = request.body;
			const response = await this.service.changeStatus(id, newStatus);
			reply.status(200).send(
				new ApiResponse({
					statusCode: 200,
					success: true,
					message:
						newStatus == true
							? 'Usuário:' + id + ' alterado para ativo'
							: 'Usuário:' + id + ' alterado para inativo',
					data: response,
				}),
			);
		} catch (error) {
			switch (error.errorCode) {
				case 'NOT_FOUND':
					return new HttpError({
						message: error.message,
						statusCode: 404,
					});
				case 'UNAUTHORIZED':
					return new HttpError({
						message: error.message,
						statusCode: 401,
					});
				case 'BAD_REQUEST':
					return new HttpError({
						message: error.message,
						statusCode: 400,
					});
				default:
					return new HttpError({
						message: error.message,
						statusCode: 500,
					});
			}
		}
	}
}
