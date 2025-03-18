import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import ProductAdditionalDetailsService from "../../../../../modules/product-additional-details/service";
import { PRODUCT_ADDITIONAL_DETAILS_MODULE } from "../../../../../modules/product-additional-details";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { PRODUCT_ADDITIONAL_DETAILS_TYPE } from "../../type";
import { Link } from "@medusajs/framework/modules-sdk";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
	const id = req.params?.product_id;

	try {
		const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

		if (id) {
			const {
				data: [product],
			} = await query.graph({
				entity: "product",
				filters: {
					id,
				},
				fields: ["*", "additional_details.*"],
			});

			return res.json({
				product,
			});
		}
		return res.status(404).json({ error: "no product id found" });
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
	const id = req.params?.product_id;

	console.log("creating my_custom with product_id", id, "with data", req.body);

	try {
		// const productService = req.scope.resolve(Modules.PRODUCT);

		const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

		const remoteLink: Link = req.scope.resolve(ContainerRegistrationKeys.LINK);

		const productAdditionalDetailsService: ProductAdditionalDetailsService =
			req.scope.resolve(PRODUCT_ADDITIONAL_DETAILS_MODULE);

		if (id) {
			// const product = await productService.listAndCountProducts(
			// 	{
			// 		id,
			// 	},
			// 	{
			// 		relations: ["variants"],
			// 	}
			// );

			const {
				data: [product],
			} = await query.graph({
				entity: "product",
				filters: {
					id,
				},
				fields: ["*", "additional_details.*"],
			});

			if (!product)
				return res.status(404).json({ error: "no product found with id", id });

			console.dir(product?.additional_details, { depth: null });
			console.log(product?.additional_details ? true : false);

			if (!product?.additional_details?.id) {
				console.log("creating new additional_details for product", product.id);

				const additional_details =
					await productAdditionalDetailsService.createAdditionalDetails(
						req.body
					);

				console.log(additional_details);
				if (additional_details?.id) {
					console.log(
						"creating link between",
						product.id,
						"and",
						additional_details.id
					);

					await remoteLink.create({
						[Modules.PRODUCT]: {
							product_id: product.id,
						},
						productAdditionalDetailsModuleService: {
							additional_details_id: additional_details.id,
						},
					});
				}
			} else {
				console.log(
					"updating additional details with id",
					product?.additional_details?.id
				);

				const additional_details =
					await productAdditionalDetailsService.updateAdditionalDetails({
						id: product?.additional_details?.id,
						...req.body,
					});
			}

			const {
				data: [updated_product],
			} = await query.graph({
				entity: "product",
				filters: {
					id,
				},
				fields: ["*", "additional_details.*"],
			});

			return res.json({
				product: updated_product,
			});
		}
		return res.status(404).json({ error: "no product id found" });
	} catch (error) {
		res.status(500).json({
			error,
			message: "internal server error",
		});
	}
}
