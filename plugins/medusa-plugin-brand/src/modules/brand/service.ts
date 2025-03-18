import { MedusaService } from "@medusajs/framework/utils";
import { InjectManager, MedusaContext } from "@medusajs/framework/utils";
import { SqlEntityManager } from "@mikro-orm/knex";
import { Context } from "@medusajs/framework/types";
import { Brand } from "./models/brand";

interface FilterOptions {
	limit?: number | null;
	offset?: number | null;
	order?: string | null;
	created_at?: {
		$gte?: string;
		$lte?: string;
	};
	updated_at?: {
		$gte?: string;
		$lte?: string;
	};
	q?: string | null;
}

class BrandModuleService extends MedusaService({
	Brand,
}) {
	@InjectManager()
	async getBrandsWithProducts(
		filters: FilterOptions,
		@MedusaContext() sharedContext?: Context<SqlEntityManager>
	): Promise<any> {
		if (!sharedContext?.manager) {
			throw new Error("Shared context or manager is undefined.");
		}

		// Base query
		let query = `
           SELECT 
			b.id AS id,
			b.name AS name,
			b.created_at,
			b.updated_at,
			ARRAY_AGG(ppbb.product_id) AS product_ids 
		FROM 
			public.brand b
		LEFT JOIN 
			public.product_product_brand_brand ppbb ON b.id = ppbb.brand_id  AND ppbb.deleted_at IS NULL
		WHERE 
			b.deleted_at IS NULL
			${filters.created_at?.$gte ? `AND b.created_at >= '${filters.created_at?.$gte}'` : ""}
		${filters.created_at?.$lte ? `AND b.created_at <= '${filters.created_at?.$lte}'` : ""}
		${filters.updated_at?.$gte ? `AND b.updated_at >= '${filters.updated_at?.$gte}'` : ""}
		${filters.updated_at?.$lte ? `AND b.updated_at <= '${filters.updated_at?.$lte}'` : ""}
		${filters.q ? `AND b.name ILIKE '%${filters.q}%'` : ""}
		GROUP BY 
			b.id, b.name`;
		const sortOptions = filters.order || "created_at";
		const sortDirection = sortOptions.startsWith("-") ? "DESC" : "ASC";
		const sortField = sortOptions.replace("-", "");

		// Append ORDER BY clause
		query += ` ORDER BY ${sortField} ${sortDirection}`;
		const countQuery = `SELECT COUNT(*) FROM (${query}) AS subquery`;
		const countResult = await sharedContext.manager.execute(countQuery);
		const totalCount = countResult[0].count;
		// Append LIMIT and OFFSET clauses
		if (filters.limit !== null) {
			query += ` LIMIT ${filters.limit}`;
		}
		if (filters.offset !== null) {
			query += ` OFFSET ${filters.offset}`;
		}

		// Execute the query
		const result = await sharedContext.manager.execute(query);
		return {
			brands: result,
			count: parseInt(totalCount),
			offset: filters.offset,
			limit: filters.limit,
		};
	}
}

export default BrandModuleService;
