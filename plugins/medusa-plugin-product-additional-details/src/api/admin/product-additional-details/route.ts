import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import ProductAdditionalDetailsService from "../../../modules/product-additional-details/service";
import { PRODUCT_ADDITIONAL_DETAILS_MODULE } from "../../../modules/product-additional-details";
import { PRODUCT_ADDITIONAL_DETAILS_TYPE } from "./type";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export async function GET(
	req: MedusaRequest,
	res: MedusaResponse
): Promise<void> {
	try {
		const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

		const productAdditionalDetailsService: ProductAdditionalDetailsService =
			req.scope.resolve(PRODUCT_ADDITIONAL_DETAILS_MODULE);

		const [additional_details, count] =
			await productAdditionalDetailsService.listAndCountAdditionalDetails();

		const { data } = await query.graph({
			entity: "product_additional_details",
			fields: ["*", "product.*"],
		});

		res.json({
			additional_details,
			count,
			data,
		});
	} catch (error) {
		res.status(500).json({
			error,
			message: "internal server error",
		});
	}
}

export async function POST(
	req: MedusaRequest<PRODUCT_ADDITIONAL_DETAILS_TYPE>,
	res: MedusaResponse
) {
	console.log("creating my_custom with data", req.body);

	try {
		const productAdditionalDetailsService: ProductAdditionalDetailsService =
			req.scope.resolve(PRODUCT_ADDITIONAL_DETAILS_MODULE);

		const additional_details =
			await productAdditionalDetailsService.createAdditionalDetails({
				...req.body,
			});

		res.json({
			additional_details,
		});
	} catch (error) {
		res.status(500).json({
			error,
			message: "internal server error",
		});
	}
}
