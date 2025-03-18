import { z } from "zod";

export const ProductCategoryDetailsSchema = z.object({
	thumbnail: z.string().nullable().optional(),
	media: z.string().array().nullable().optional(),
	product_aspect_ratio: z.string().nullable().optional(),
	product_bg_color: z.string().nullable().optional(),
});
