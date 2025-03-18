import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { PRODUCT_VARIANT_IMAGES_TYPE } from "./type";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { PRODUCT_VARIANT_IMAGES_MODULE } from "../../../modules/product-variant-images";
import ProductVariantImagesModuleService from "../../../modules/product-variant-images/service";

export async function GET(
	req: MedusaRequest,
	res: MedusaResponse
): Promise<void> {
	try {
		const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

		const productVariantImagesModule: ProductVariantImagesModuleService =
			req.scope.resolve(PRODUCT_VARIANT_IMAGES_MODULE);

		const [variant_images, count] =
			await productVariantImagesModule.listAndCountVariantImages();

		res.json({
			variant_images,
			count,
		});
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
	console.log("creating variant_images with data", req.body);

	try {
		const productVariantImagesModule: ProductVariantImagesModuleService =
			req.scope.resolve(PRODUCT_VARIANT_IMAGES_MODULE);

		const variant_images = await productVariantImagesModule.createVariantImages(
			{
				...req.body,
			}
		);

		res.json({
			variant_images,
		});
	} catch (error) {
		res.status(500).json({
			error,
			message: "internal server error",
		});
	}
}
