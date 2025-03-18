import { z } from "zod";

export const ProductVariantImagesSchema = z.object({
	thumbnail: z.string().optional(),
	images: z.string().array().optional(),
});
