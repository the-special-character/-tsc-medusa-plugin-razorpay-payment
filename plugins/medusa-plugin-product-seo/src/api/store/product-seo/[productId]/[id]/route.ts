import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { PRODUCT_SEO_MODULE } from "../../../../../modules/product-seo";
import ProductSeoModuleService from "../../../../../modules/product-seo/service";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
	try {
		const productSeoService: ProductSeoModuleService =
			req.scope.resolve(PRODUCT_SEO_MODULE);

		const data = await productSeoService.retrieveSeoDetails(req.params.id, {
			relations: ["metaSocial.*"],
			select: ["*"],
		});
		if (!data) {
			res.status(404).json({ error: "Product SEO not found" });
		}

		res.json({ data });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}
