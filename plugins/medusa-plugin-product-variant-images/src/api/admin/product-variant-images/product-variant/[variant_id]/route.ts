import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { PRODUCT_VARIANT_IMAGES_TYPE } from "../../type";
import { Link } from "@medusajs/framework/modules-sdk";
import { PRODUCT_VARIANT_IMAGES_MODULE } from "../../../../../modules/product-variant-images";
import ProductVariantImagesModuleService from "../../../../../modules/product-variant-images/service";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
	const id = req.params?.variant_id;

	try {
		const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

		if (id) {
			const {
				data: [product],
			} = await query.graph({
				entity: "product",
				filters: {
					variants: {
						id,
					},
				},
				fields: [
					"*",
					"additional_details.*",
					"variants.*",
					"variants.variant_images.*",
				],
			});

			return res.json({
				product,
			});
		}
		return res.status(404).json({ error: "no variant id found" });
	} catch (error) {
		res.status(500).json({
			error,
			message: "internal server error",
		});
	}
}

export async function POST(
	req: MedusaRequest<PRODUCT_VARIANT_IMAGES_TYPE>,
	res: MedusaResponse
) {
	const id = req.params?.variant_id;

	console.log(
		"creating variant_images with variant_id",
		id,
		"with data",
		req.body
	);

	try {
		const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

		const remoteLink: Link = req.scope.resolve(ContainerRegistrationKeys.LINK);

		const productVariantImagesService: ProductVariantImagesModuleService =
			req.scope.resolve(PRODUCT_VARIANT_IMAGES_MODULE);

		if (id) {
			const {
				data: [product_variant],
			} = await query.graph({
				entity: "product_variant",
				filters: {
					id,
				},
				fields: ["*", "variant_images.*"],
			});

			if (!product_variant)
				return res.status(404).json({
					message: `no product_variant found with id, ${id}`,
					error: "not found",
				});

			console.dir(product_variant?.variant_images, { depth: null });
			console.log(product_variant?.variant_images ? true : false);

			if (!product_variant?.variant_images?.id) {
				console.log(
					"creating new variant_images for product_variant",
					product_variant.id
				);

				const variant_images =
					await productVariantImagesService.createVariantImages({
						...req.body,
						thumbnail:
							req.body.thumbnail && req.body.thumbnail !== ""
								? req.body.thumbnail
								: null,
					});

				console.log(variant_images);
				if (variant_images?.id) {
					console.log("creating link between", id, "and", variant_images.id);

					await remoteLink.create({
						[Modules.PRODUCT]: {
							product_variant_id: product_variant?.id,
						},
						[PRODUCT_VARIANT_IMAGES_MODULE]: {
							variant_images_id: variant_images?.id,
						},
					});
				}
			} else {
				console.log(
					"updating variant_images with id",
					product_variant?.variant_images?.id
				);

				const variant_images =
					await productVariantImagesService.updateVariantImages({
						id: product_variant?.variant_images?.id,
						...req.body,
						thumbnail:
							req.body.thumbnail && req.body.thumbnail !== ""
								? req.body.thumbnail
								: null,
					});
			}

			const {
				data: [updated_product_variant],
			} = await query.graph({
				entity: "product_variant",
				filters: {
					id,
				},
				fields: ["*", "variant_images.*"],
			});

			return res.json({
				product_variant: updated_product_variant,
			});
		}
		return res.status(404).json({
			message: `id not found`,
			error: "not found",
		});
	} catch (error) {
		res.status(500).json({
			error,
			message: "internal server error",
		});
	}
}
