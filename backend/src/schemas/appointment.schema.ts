import { z } from 'zod';
import { AppointmentStatus } from '@prisma/generated/enums';
import { UuidSchema } from './generic.schema';

export const AppointmentUuidSchema = UuidSchema.extend({
    id: z.uuid(),
})
export const AppointmentSchema = z.object({
	id: z.uuid(),
	store_id: z.uuid(),
	customer_id: z.uuid(),
	customer_name: z.string(),
	customer_email: z.email(),
	customer_phone: z.string(),
	appointment_date: z.date(),
	notes: z.string().nullable(),
	status: z.enum(AppointmentStatus),
	created_at: z.date(),
});

export const CreateAppointmentSchema = AppointmentSchema.omit({
    id: true,
    customer_id: true,
    created_at: true,
});

export type CreateAppointment = z.infer<typeof CreateAppointmentSchema>;