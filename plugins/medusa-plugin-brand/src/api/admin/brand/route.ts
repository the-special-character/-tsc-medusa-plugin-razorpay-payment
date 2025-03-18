import { BRAND_MODULE } from "../../../modules/brand";
import BrandModuleService from "../../../modules/brand/service";
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { MedusaError } from "@medusajs/framework/utils";

type PostAdminCreateBrandType = {
	name: string;
};

export const POST = async (
	req: MedusaRequest<PostAdminCreateBrandType>,
	res: MedusaResponse
) => {
	const { name } = req.body;
	const brandModuleService: BrandModuleService =
		req.scope.resolve(BRAND_MODULE);

	const query = req.scope.resolve("query");
	const { data: brandExists } = await query.graph({
		entity: "brand",
		fields: ["*"],
		filters: {
			name: name,
		},
	});
	if (brandExists.length > 0) {
		throw new MedusaError(
			MedusaError.Types.INVALID_DATA,
			"Brand name with " + name + " already exists."
		);
	}

	const brand = await brandModuleService.createBrands(req.body);
	res.send({ brand });
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
	const { created_at, updated_at, q, order, limit, offset } = req.query;

	const filterOptions = {
		created_at: {
			$gte: created_at?.["$gte"],
			$lte: created_at?.["$lte"],
		},
		updated_at: {
			$gte: updated_at?.["$gte"],
			$lte: updated_at?.["$lte"],
		},
		q: q && typeof q === "string" ? q : null,
		order: order && typeof order === "string" ? order : null,
		limit: limit ? parseInt(limit as string) : null,
		offset: offset ? parseInt(offset as string) : null,
	};
	const brandModuleService: BrandModuleService =
		req.scope.resolve(BRAND_MODULE);
	const brandsWithProducts =
		await brandModuleService.getBrandsWithProducts(filterOptions);

	res.send(brandsWithProducts);
};
