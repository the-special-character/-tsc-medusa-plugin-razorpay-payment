import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { PRODUCT_VARIANT_IMAGES_TYPE } from "../type";
import ProductVariantImagesModuleService from "../../../../modules/product-variant-images/service";
import { PRODUCT_VARIANT_IMAGES_MODULE } from "../../../../modules/product-variant-images";

export async function PUT(
	req: MedusaRequest<PRODUCT_VARIANT_IMAGES_TYPE>,
	res: MedusaResponse
): Promise<void> {
	try {
		const id = req?.params?.id;
		console.log(
			"updating product_variant_images with id",
			id,
			"with data",
			req.body
		);

		const productVariantImagesModuleService: ProductVariantImagesModuleService =
			req.scope.resolve(PRODUCT_VARIANT_IMAGES_MODULE);

		console.log("log 1");

		const product_variant_images =
			await productVariantImagesModuleService.updateVariantImages({
				id,
				...req?.body,
			});

		console.log("created");

		res.json({
			product_variant_images,
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

		console.log("deleting product_variant_images with id", id);

		const ProductVariantImagesModuleService: ProductVariantImagesModuleService =
			req.scope.resolve(PRODUCT_VARIANT_IMAGES_MODULE);

		const my_custom =
			await ProductVariantImagesModuleService.deleteVariantImages(id);

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
