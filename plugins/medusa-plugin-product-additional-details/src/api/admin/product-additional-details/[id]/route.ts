import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import ProductAdditionalDetailsService from "../../../../modules/product-additional-details/service";
import { PRODUCT_ADDITIONAL_DETAILS_MODULE } from "../../../../modules/product-additional-details";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { PRODUCT_ADDITIONAL_DETAILS_TYPE } from "../type";

export async function PUT(
	req: MedusaRequest<PRODUCT_ADDITIONAL_DETAILS_TYPE>,
	res: MedusaResponse
): Promise<void> {
	try {
		const id = req?.params?.id;
		console.log(
			"updating product_additional_details with id",
			id,
			"with data",
			req.body
		);

		const productAdditionalDetailsService: ProductAdditionalDetailsService =
			req.scope.resolve(PRODUCT_ADDITIONAL_DETAILS_MODULE);

		const product_additional_details =
			await productAdditionalDetailsService.updateAdditionalDetails({
				id,
				...req?.body,
			});

		res.json({
			product_additional_details,
		});
	} catch (error) {
		res.status(500).json({
			error,
			message: "internal server error",
		});
	}
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
	try {
		const id = req?.params?.id;

		console.log("deleting product_additional_details with id", id);

		const productAdditionalDetailsService: ProductAdditionalDetailsService =
			req.scope.resolve(PRODUCT_ADDITIONAL_DETAILS_MODULE);

		const my_custom =
			await productAdditionalDetailsService.deleteAdditionalDetails(id);

		res.json({
			my_custom,
		});
	} catch (error) {
		res.status(500).json({
			error,
			message: "internal server error",
		});
	}
}
