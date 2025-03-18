import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { PRODUCT_CATEGORY_DETAILS_MODULE } from "../../../../modules/product-category-details";
import ProductCategoryDetailsModuleService from "../../../../modules/product-category-details/service";
import { PRODUCT_CATEGORY_DETAILS_TYPE } from "../type";

export async function PUT(
	req: MedusaRequest<PRODUCT_CATEGORY_DETAILS_TYPE>,
	res: MedusaResponse
): Promise<void> {
	const id = req.params?.id;
	try {
		const productCategoryDetailsService: ProductCategoryDetailsModuleService =
			req.scope.resolve(PRODUCT_CATEGORY_DETAILS_MODULE);

		const category_detail =
			await productCategoryDetailsService.updateCategoryDetails({
				...req.body,
				id,
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

export async function DELETE(
	req: MedusaRequest,
	res: MedusaResponse
): Promise<void> {
	const id = req.params?.id;
	try {
		const productCategoryDetailsService: ProductCategoryDetailsModuleService =
			req.scope.resolve(PRODUCT_CATEGORY_DETAILS_MODULE);

		const category_detail =
			await productCategoryDetailsService.deleteCategoryDetails(id);

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

export async function GET(
	req: MedusaRequest,
	res: MedusaResponse
): Promise<void> {
	const id = req.params?.id;
	try {
		const productCategoryDetailsService: ProductCategoryDetailsModuleService =
			req.scope.resolve(PRODUCT_CATEGORY_DETAILS_MODULE);

		const [category_details, count] =
			await productCategoryDetailsService.listCategoryDetails({
				id,
			});

		res.json({
			category_details,
			count,
		});
	} catch (error) {
		res.status(500).json({
			error,
			message: "internal server error",
		});
	}
}
