import { BRAND_MODULE } from "../../../../modules/brand";
import BrandModuleService from "../../../../modules/brand/service";
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { MedusaError } from "@medusajs/framework/utils";

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
	const brandModuleService: BrandModuleService =
		req.scope.resolve(BRAND_MODULE);
	const { id } = req.params;

	const query = req.scope.resolve("query");
	const { data: brands } = await query.graph({
		entity: "brand",
		fields: ["*", "products.*"],
		filters: {
			id: id,
		},
	});
	if (!brands) {
		throw new Error("Brand not found");
	}

	if (brands[0].products && brands[0].products.length > 0) {
		throw new MedusaError(
			MedusaError.Types.NOT_ALLOWED,
			"Brand is associated with products. Cannot delete."
		);
	}

	await brandModuleService.deleteBrands(id);
	const brandDeleted = await brandModuleService.listBrands();
	res
		.status(200)
		.json({ brand: brandDeleted, message: "Brand deleted successfully" });
};

export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
	const brandModuleService: BrandModuleService =
		req.scope.resolve(BRAND_MODULE);
	const { id } = req.params;
	if (!id) {
		throw new MedusaError(
			MedusaError.Types.INVALID_DATA,
			"Brand ID is required."
		);
	}
	if (
		typeof req.body !== "object" ||
		req.body === null ||
		!req.body.hasOwnProperty("name")
	) {
		throw new MedusaError(
			MedusaError.Types.INVALID_DATA,
			"Invalid request body. 'name' property is required."
		);
	}
	const { name } = req.body as { name: string };
	const query = req.scope.resolve("query");
	const { data: brandExists } = await query.graph({
		entity: "brand",
		fields: ["*"],
		filters: {
			name: name,
		},
	});
	if (brandExists.length > 0 && brandExists[0].id !== id) {
		throw new MedusaError(
			MedusaError.Types.INVALID_DATA,
			"Brand name with " + name + " already exists."
		);
	}
	const brand = await brandModuleService.updateBrands({ id, name });

	res.send({ brand });
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
	const { id } = req.params;
	const query = req.scope.resolve("query");

	const { data: brands } = await query.graph({
		entity: "brand",
		fields: ["*", "products.*"],
		filters: {
			id: id,
		},
	});
	if (!brands) {
		throw new MedusaError(MedusaError.Types.NOT_FOUND, "Brand not found");
	}
	res.send(brands[0]);
};
