import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { PRODUCT_CATEGORY_DETAILS_MODULE } from "../../../modules/product-category-details";
import ProductCategoryDetailsModuleService from "../../../modules/product-category-details/service";
import { PRODUCT_CATEGORY_DETAILS_TYPE } from "./type";

export async function GET(
	req: MedusaRequest,
	res: MedusaResponse
): Promise<void> {
	try {
		const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

		const productCategoryDetailsService: ProductCategoryDetailsModuleService =
			req.scope.resolve(PRODUCT_CATEGORY_DETAILS_MODULE);

		const [category_details, count] =
			await productCategoryDetailsService.listAndCountCategoryDetails();

		// const { data } = await query.graph({
		// 	entity: "product_additional_details",
		// 	fields: ["*", "product.*"],
		// });

		res.json({
			category_details,
			count,
			// data,
		});
	} catch (error) {
		res.status(500).json({
			error,
			message: "internal server error",
		});
	}
}

export async function POST(
	req: MedusaRequest<PRODUCT_CATEGORY_DETAILS_TYPE>,
	res: MedusaResponse
): Promise<void> {
	try {
		// const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

		const productCategoryDetailsService: ProductCategoryDetailsModuleService =
			req.scope.resolve(PRODUCT_CATEGORY_DETAILS_MODULE);

		const category_detail =
			await productCategoryDetailsService.createCategoryDetails({
				...req.body,
			});

		res.json({
			category_detail,
		});
	} catch (error) {
		res.status(500).json({
			error,
			message: "internal server error",
		});
	}
}
