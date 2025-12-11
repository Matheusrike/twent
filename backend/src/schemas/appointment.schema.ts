import { z } from 'zod';
import { AppointmentStatus } from '@prisma/generated/enums';
import { ConflictResponseSchema, NotFoundResponseSchema, UuidSchema } from './generic.schema';
import { ApiResponseSchema } from './api-response.schema';

export const AppointmentUuidSchema = UuidSchema.extend({
    id: z.uuid(),
})
export const AppointmentSchema = z.object({
	id: z.uuid(),
	store_id: z.uuid(),
	customer_id: z.uuid().nullable(),
	customer_name: z.string(),
	customer_email: z.email(),
	customer_phone: z.string(),
	appointment_date: z.coerce.date(),
	notes: z.string().nullable(),
	status: z.enum(AppointmentStatus),
	created_at: z.date(),
});

export const AppointmentResponseSchema= ApiResponseSchema.extend({
    success: z.literal(true),
    message: z.string().meta({ examples: ['Agendamento criado com sucesso'] }),
    data: AppointmentSchema,
});

export const CreateAppointmentSchema = AppointmentSchema.omit({
    id: true,
    customer_id: true,
    created_at: true,
    status: true
});

export const AppointmentGetResponseSchema = ApiResponseSchema.extend({
    success: z.literal(true),
    message: z.string().meta({ examples: ['Agendamentos listados com sucesso'] }),
    data: z.array(AppointmentSchema),
});

export type CreateAppointment = z.infer<typeof CreateAppointmentSchema>;

export const AppointmentConflictSchema = ConflictResponseSchema.extend({
    message: z.string().meta({ examples: ['Informações do agendamento conflitantes'] }),
})

export const AppointmentNotFoundSchema = NotFoundResponseSchema.extend({
    message: z.string().meta({ examples: ['Agendamento nao encontrado'] }),
})