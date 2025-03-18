import { z } from "zod";

export const CreateFaqSchema = z.object({
	title: z.string(),
	content: z.string().optional(),
	type: z.string().optional(),
	by_admin: z.boolean().default(false),
	email: z.string(),
	customer_name: z.string().optional(),
	metadata: z.record(z.any()).optional(),
	display_status: z.enum(["published", "draft"]).default("draft"),
	category: z
		.object({
			title: z.string(),
			description: z.string().optional(),
			metadata: z.record(z.any()).optional(),
		})
		.optional(),
});

export const UpdateFaqSchema = z.object({
	title: z.string().optional(),
	content: z.string().optional(),
	type: z.string().optional(),
	customer_name: z.string().optional(),
	metadata: z.record(z.any()).optional(),
	by_admin: z.boolean().optional(),
	display_status: z.enum(["published", "draft"]).optional(),
	category: z
		.object({
			title: z.string().optional(),
			description: z.string().optional(),
			metadata: z.record(z.any()).optional(),
		})
		.optional(),
});
