import { AppointmentController } from '@/controllers/Appointment.controller';
import { ApiGenericErrorSchema } from '@/schemas/api-response.schema';
import {
	AppointmentConflictSchema,
	AppointmentGetResponseSchema,
	AppointmentNotFoundSchema,
	AppointmentResponseSchema,
	AppointmentUuidSchema,
	CreateAppointmentSchema,
} from '@/schemas/appointment.schema';
import { AppointmentService } from '@/services/Appointment.service';
import { fastifyTypedInstance } from '@/types/types';
import { ApiResponse } from '@/utils/api-response.util';
import prisma from '@prisma/client';

export async function appointmentRoutes(app: fastifyTypedInstance) {
	const appointmentService = new AppointmentService(prisma);
	const appointmentController = new AppointmentController(appointmentService);

	app.post(
		'/',
		{
			schema: {
				tags: ['Appointment'],
				summary: 'Cria um novo agendamento',
				body: CreateAppointmentSchema,
				response: {
					404: AppointmentNotFoundSchema,
					409: AppointmentConflictSchema,
					500: ApiGenericErrorSchema,
				},
			},
		},
		async (request, reply) => {
			try {
				const appointment = await appointmentController.create(request);
				return new ApiResponse({
					statusCode: 201,
					success: true,
					message: 'Agendamento criado com sucesso',
					data: appointment,
				}).send(reply);
			} catch (error) {
				return new ApiResponse({
					success: false,
					statusCode: error.statusCode,
					message: error.message,
					errorCode: error.errorCode,
				}).send(reply);
			}
		},
	);

	app.get(
		'/',
		{
			schema: {
				tags: ['Appointment'],
				summary: 'Busca todos os agendamentos',
				response: {
					200: AppointmentGetResponseSchema,
					500: ApiGenericErrorSchema,
				},
			},
			preHandler: [app.authorization()],
		},
		async (request, reply) => {
			try {
				const appointments = await appointmentController.get();
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Agendamentos encontrados',
					data: appointments,
				}).send(reply);
			} catch (error) {
				return new ApiResponse({
					success: false,
					statusCode: error.statusCode,
					message: error.message,
					errorCode: error.errorCode,
				}).send(reply);
			}
		},
	);

	app.delete(
		'/:id/cancel',
		{
			schema: {
				tags: ['Appointment'],
				summary: 'Cancela um agendamento',
				params: AppointmentUuidSchema,
				response: {
					200: AppointmentResponseSchema,
					404: AppointmentNotFoundSchema,
					500: ApiGenericErrorSchema,
				},
			},
			preHandler: [app.authorization()],
		},
		async (request, reply) => {
			try {
				const appointment =
					await appointmentController.cancelAppointment(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Agendamento cancelado com sucesso',
					data: appointment,
				}).send(reply);
			} catch (error) {
				return new ApiResponse({
					success: false,
					statusCode: error.statusCode,
					message: error.message,
					errorCode: error.errorCode,
				}).send(reply);
			}
		},
	);

	app.patch(
		'/:id/confirm',
		{
			schema: {
				tags: ['Appointment'],
				summary: 'Confirma um agendamento',
				params: AppointmentUuidSchema,
				response: {
					200: AppointmentResponseSchema,
					404: AppointmentNotFoundSchema,
					500: ApiGenericErrorSchema,
				},
			},
			preHandler: [app.authorization()],
		},
		async (request, reply) => {
			try {
				const appointment =
					await appointmentController.confirmAppointment(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Agendamento confirmado com sucesso',
					data: appointment,
				}).send(reply);
			} catch (error) {
				return new ApiResponse({
					success: false,
					statusCode: error.statusCode,
					message: error.message,
					errorCode: error.errorCode,
				}).send(reply);
			}
		},
	);

	app.patch(
		'/:id/complete',
		{
			schema: {
				tags: ['Appointment'],
				summary: 'Finaliza um agendamento',
				params: AppointmentUuidSchema,
				response: {
					200: AppointmentResponseSchema,
					404: AppointmentNotFoundSchema,
					500: ApiGenericErrorSchema,
				},
			},
			preHandler: [app.authorization()],
		},
		async (request, reply) => {
			try {
				const appointment =
					await appointmentController.completeAppointment(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Agendamento finalizado com sucesso',
					data: appointment,
				}).send(reply);
			} catch (error) {
				return new ApiResponse({
					success: false,
					statusCode: error.statusCode,
					message: error.message,
					errorCode: error.errorCode,
				}).send(reply);
			}
		},
	);
}
