import { z } from "zod";

export const ProductAdditionalDetailsSchema = z.object({
	additional_description: z.string(),
	additional_details_title: z.string(),
	additional_details_content: z.string(),
	grid_view: z.boolean(),
});
