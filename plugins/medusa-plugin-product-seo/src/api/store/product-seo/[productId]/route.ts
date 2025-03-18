import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
	const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

	if (req.params.productId) {
		const { data } = await query.graph({
			entity: "products",
			fields: ["*", "seo_details.*", "seo_details.metaSocial.*"],
			filters: {
				id: req.params.productId,
			},
		});

		if (!data.at(0)?.seo_details) {
			res.status(400).json({ message: "Product SEO not found" });
		}
		// if (Array.isArray(data.at(0)?.seo_details)) {
		//   res.json({
		//     data: data.at(0)?.seo_details.find((seo) => seo !== null),
		//   });
		//   return;
		// }

		res.json({
			data: data.at(0)?.seo_details,
		});
	}
	res.status(400).json({ message: "Product ID is required" });
}
