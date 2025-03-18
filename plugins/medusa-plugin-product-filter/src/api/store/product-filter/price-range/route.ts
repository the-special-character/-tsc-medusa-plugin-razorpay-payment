import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { PRODUCT_FILTER_MODULE } from "../../../../modules/product-filter";
import ProductFilterService from "../../../../modules/product-filter/service";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
	try {
		const currency_code = req.query?.currency_code as string;

		const productFilterService: ProductFilterService = req.scope.resolve(
			PRODUCT_FILTER_MODULE
		);

		const result = await productFilterService.getPriceRangeValue({
			currency_code,
		});

		res.json(result);
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({ error: error.message });
	}
};
