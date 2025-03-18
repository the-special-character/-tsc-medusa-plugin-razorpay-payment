import { MedusaService } from "@medusajs/framework/utils";
import { ProductFilter } from "./models/product-filter";
import { InjectManager, MedusaContext } from "@medusajs/framework/utils";
import { SqlEntityManager } from "@mikro-orm/knex";
import { Context } from "@medusajs/framework/types";

interface FilterOptions {
	query?: string | null;
	collection_ids?: string[] | null;
	category_ids?: string[] | null;
	brand_ids?: string[] | null;
	price_range?: { min: number; max: number } | null;
	option_value?: string[][] | null;
	sort_by?: string | null;
	sort_order?: string | null;
	limit?: number | null;
	page?: number | null;
	availableStock?: boolean | null;
	isDiscountAvailable?: boolean | null;
	region_id?: string | null;
}

class ProductFilterService extends MedusaService({
	ProductFilter,
}) {
	private getCommonCTEs(
		transformedGroups: string[],
		regionId?: string
	): string {
		return `
            WITH variant_options AS (
                SELECT 
                    pvo.variant_id,
                    jsonb_agg(
                        jsonb_build_object(
                            'option_id', po.id,
                            'option_title', po.title,
                            'value', pov.value,
                            'option_value_id', pov.id
                        )
                    ) as options
                FROM product_variant_option pvo
                JOIN product_option_value pov ON pvo.option_value_id = pov.id
                JOIN product_option po ON pov.option_id = po.id
                GROUP BY pvo.variant_id
            ),
            option_value_groups AS (
                SELECT 
                    ROW_NUMBER() OVER () as id,
                    value_pairs,
                    array_length(value_pairs, 1) as pair_length
                FROM (
                    VALUES 
                        ${
													transformedGroups.length > 0
														? transformedGroups.join(",")
														: "(ARRAY[]::text[])"
												}                           
                ) AS groups(value_pairs)
            ),
            variants_per_group AS (
                SELECT DISTINCT 
                    pv.id as variant_id
                FROM public.product_variant pv
                LEFT JOIN product_variant_option pvo ON pv.id = pvo.variant_id
                LEFT JOIN product_option_value pov ON pvo.option_value_id = pov.id
                LEFT JOIN product_option po ON pov.option_id = po.id
                CROSS JOIN option_value_groups g
                WHERE 
                    pv.deleted_at IS NULL
                    AND (
                        g.pair_length IS NULL 
                        OR g.pair_length = 0 
                        OR (
                            EXISTS (
                                SELECT 1
                                FROM product_variant_option pvo2
                                JOIN product_option_value pov2 ON pvo2.option_value_id = pov2.id
                                WHERE pvo2.variant_id = pv.id
                                AND LOWER(pov2.value) = ANY(SELECT LOWER(unnest) FROM unnest(g.value_pairs))
                                GROUP BY pvo2.variant_id
                                HAVING COUNT(DISTINCT LOWER(pov2.value)) = g.pair_length
                            )
                        )
                    )
            ),
            filtered_variants AS (
                SELECT DISTINCT variant_id
                FROM variants_per_group
            ),
            region_currency AS (
                SELECT currency_code
                FROM region
                WHERE id = '${regionId}'
                AND deleted_at IS NULL
            ),
            active_prices AS (
                SELECT 
                    pvps.variant_id,
                    price.amount,
                    price.currency_code,
                    price.min_quantity,
                    price.max_quantity,
                    price.price_list_id,
                    price.price_set_id,
                    price.id as price_id,
                    price.raw_amount as raw_amount,
                    ROW_NUMBER() OVER (
                        PARTITION BY pvps.variant_id, price.currency_code 
                        ORDER BY 
                            CASE 
                                WHEN pl.starts_at <= CURRENT_TIMESTAMP 
                                AND (pl.ends_at IS NULL OR pl.ends_at > CURRENT_TIMESTAMP)
                                THEN 0 
                                ELSE 1 
                            END,
                            price.amount
                    ) as price_rank
                FROM product_variant_price_set pvps
                JOIN price_set ps ON pvps.price_set_id = ps.id 
                JOIN price ON ps.id = price.price_set_id
                LEFT JOIN price_list pl ON price.price_list_id = pl.id
                JOIN region_currency rc ON price.currency_code = rc.currency_code
                WHERE pvps.deleted_at IS NULL
                AND price.deleted_at IS NULL
                AND ps.deleted_at IS NULL
                AND (
                    (pl.id IS NOT NULL
                    AND pl.status = 'active'
                    AND (pl.starts_at IS NULL OR pl.starts_at <= CURRENT_TIMESTAMP)
                    AND (pl.ends_at IS NULL OR pl.ends_at > CURRENT_TIMESTAMP))
                    OR 
                    pl.id IS NULL
                )
            ),

            variant_prices AS (
                SELECT 
                    variant_id,
                    jsonb_build_object(
                        'amount', amount,
                        'currency_code', currency_code,
                        'min_quantity', min_quantity,
                        'max_quantity', max_quantity,
                        'price_list_id', price_list_id,
                        'price_id', price_id,
                        'id', price_set_id,
                        'raw_amount', raw_amount,
                        'original_price', 
                        CASE 
                            WHEN price_list_id IS NOT NULL THEN (
                                SELECT 
                                jsonb_build_object(
                                'amount',po.amount,
                                'price_id', po.id,
                                'currency_code', po.currency_code,
                                'min_quantity', po.min_quantity,
                                'max_quantity', po.max_quantity,
                                'price_list_id', po.price_list_id,
                                'price_set_id', po.price_set_id,
                                'raw_amount', po.raw_amount)
                                FROM price po
                                WHERE po.price_set_id = active_prices.price_set_id 
                                AND po.price_list_id IS NULL
                                AND po.deleted_at IS NULL
                                AND po.currency_code = active_prices.currency_code
                                LIMIT 1
                            )
                            ELSE null
                        END,
                        'is_discount_available',
                        CASE 
                            WHEN active_prices.amount < (
                                SELECT po.amount
                                FROM price po
                                WHERE po.price_set_id = active_prices.price_set_id 
                                    AND po.price_list_id IS NULL
                                    AND po.deleted_at IS NULL
                                    AND po.currency_code = active_prices.currency_code
                                LIMIT 1
                            ) THEN true
                            ELSE false
                        END
                    ) as price
                FROM active_prices
                WHERE price_rank = 1
            ),
            price_extremes AS (
                SELECT 
                    pv.product_id,
                    MIN((vp.price->>'amount')::numeric) as min_price,
                    MAX((vp.price->>'amount')::numeric) as max_price
                FROM public.product_variant pv
                JOIN variant_prices vp ON pv.id = vp.variant_id
                GROUP BY pv.product_id
            ),
            variant_inventory AS (
                SELECT 
                    pvii.variant_id,
                    SUM(il.stocked_quantity - il.reserved_quantity) AS total_available_inventory
                FROM public.product_variant_inventory_item pvii
                JOIN inventory_level il ON pvii.inventory_item_id = il.inventory_item_id
                WHERE il.deleted_at IS NULL
                GROUP BY pvii.variant_id
            ),
            product_variant_counts AS (
                SELECT 
                    p.id AS product_id,
                    COUNT(DISTINCT pv.id) AS variant_count,
                    COUNT(DISTINCT CASE WHEN vi.total_available_inventory > 0 THEN pv.id END) AS available_variant_count
                FROM public.product p
                LEFT JOIN public.product_variant pv ON p.id = pv.product_id AND pv.deleted_at IS NULL
                LEFT JOIN variant_inventory vi ON pv.id = vi.variant_id
                GROUP BY p.id
            ),
            option_data AS (
                SELECT 
                    option.id,
                    option.title,
                    option.metadata,
                    option.product_id,
                    option.created_at,
                    option.updated_at,
                    option.deleted_at,
                    jsonb_agg(
                        jsonb_build_object(
                            'id', option_value.id,
                            'value', option_value.value,
                            'metadata', option_value.metadata,
                            'option_id', option.id,
                            'created_at', option_value.created_at,
                            'updated_at', option_value.updated_at,
                            'deleted_at', option_value.deleted_at
                        )
                    ) AS values
                FROM public.product_option option
                LEFT JOIN public.product_option_value option_value ON option.id = option_value.option_id
                WHERE option.deleted_at IS NULL
                GROUP BY option.id, option.title, option.metadata, option.product_id, option.created_at, option.updated_at, option.deleted_at
            ),
            brand_data AS (
                    SELECT 
                      pp.product_id, 
                      pp.brand_id, 
                      b.name
                    FROM public.product_product_brand_brand pp 
                    LEFT JOIN public.brand b ON b.id= pp.brand_id
                    where pp.deleted_at IS NULL
                )`;
	}

	private getWhereConditions(
		query?: string,
		collectionIds?: string[],
		categoryIds?: string[],
		minPrice?: number,
		maxPrice?: number,
		avilableStock?: boolean,
		isDiscountAvailable?: boolean,
		brandIds?: string[]
	): string {
		return `
            p.deleted_at IS NULL
            ${query ? `AND (p.title ILIKE '%${query}%' OR p.description ILIKE '%${query}%')` : ""}
            ${collectionIds?.length ? `AND (p.collection_id = ANY(ARRAY[${collectionIds.map((id) => `'${id}'`).join(",")}]))` : ""}
            ${categoryIds?.length ? `AND (pcp.product_category_id = ANY(ARRAY[${categoryIds.map((id) => `'${id}'`).join(",")}]))` : ""}
            ${
							minPrice !== undefined && maxPrice !== undefined
								? `AND EXISTS (
                    SELECT 1 
                    FROM variant_prices vp2 
                    WHERE vp2.variant_id = pv.id 
                    AND (vp2.price->>'amount')::numeric BETWEEN ${minPrice} AND ${maxPrice}
                )`
								: ""
						}
            ${avilableStock ? "AND pvc.available_variant_count > 0" : ""}
            ${isDiscountAvailable ? "AND (price->>'is_discount_available')::boolean = true" : ""}
             ${
								brandIds?.length
									? `AND (bd.brand_id = ANY(ARRAY[${brandIds
											.map((id) => `'${id}'`)
											.join(",")}]))`
									: ""
							}`;
	}

	private getCommonJoins(): string {
		return `
            public.product p
            LEFT JOIN public.product_variant pv ON p.id = pv.product_id AND pv.deleted_at IS NULL
            LEFT JOIN public.product_collection pcoll ON p.collection_id = pcoll.id
            LEFT JOIN product_variant_counts pvc ON p.id = pvc.product_id
            LEFT JOIN variant_inventory vi ON pv.id = vi.variant_id
            INNER JOIN filtered_variants fv ON pv.id = fv.variant_id
            LEFT JOIN variant_options vo ON pv.id = vo.variant_id
            LEFT JOIN variant_prices vp ON pv.id = vp.variant_id
            LEFT JOIN public.product_category_product pcp ON p.id = pcp.product_id
            LEFT JOIN public.product_category pc ON pcp.product_category_id = pc.id
            LEFT JOIN price_extremes pe ON p.id = pe.product_id
            LEFT JOIN public.product_tags pt ON p.id = pt.product_id
            LEFT JOIN public.product_tag tag ON pt.product_tag_id = tag.id
            LEFT JOIN public.image img ON p.id = img.product_id
            LEFT JOIN option_data od ON p.id = od.product_id
            LEFT JOIN brand_data bd ON p.id = bd.product_id
            `;
	}

	@InjectManager()
	async getFilterWithValue(
		filters: FilterOptions,
		@MedusaContext() sharedContext?: Context<SqlEntityManager>
	): Promise<any> {
		if (!sharedContext?.manager) {
			throw new Error("Shared context or manager is undefined.");
		}

		const query = filters?.query || "";
		const collectionIds = filters?.collection_ids || [];
		const categoryIds = filters?.category_ids || [];
		const minPrice = filters?.price_range?.min || 0;
		const maxPrice = filters?.price_range?.max || 1000000;
		const optionValue = filters?.option_value || [];
		const brandIds = filters?.brand_ids || [];
		const regionId = filters?.region_id || "";
		const transformedGroups = optionValue.map((group) => {
			const parsedGroup = JSON.parse(group as unknown as string);
			return `(ARRAY[${parsedGroup.map((option) => `'${option}'`).join(", ")}])`;
		});

		let sortBy =
			filters?.sort_by?.toLowerCase() === "price" ||
			filters?.sort_by?.toLowerCase() === "updated_at" ||
			filters?.sort_by?.toLowerCase() === "name"
				? filters.sort_by
				: "updated_at";

		let sortOrder =
			filters?.sort_order?.toUpperCase() === "ASC" ||
			filters?.sort_order?.toUpperCase() === "DESC"
				? filters.sort_order
				: "DESC";

		const page = filters?.page || 1;
		const limit = filters?.limit || 10;
		const offset = (page - 1) * limit;
		const availableStock = filters?.availableStock || false;
		const isDiscountAvailable = filters?.isDiscountAvailable || false;
		try {
			const [count, products] = await Promise.all([
				sharedContext.manager.execute(`
                    ${this.getCommonCTEs(transformedGroups, regionId)}
                    SELECT COUNT(*) FROM (
                        SELECT 
                            p.id as product_id
                        FROM 
                            ${this.getCommonJoins()}
                        WHERE 
                            ${this.getWhereConditions(query, collectionIds, categoryIds, minPrice, maxPrice, availableStock, isDiscountAvailable, brandIds)}
                        GROUP BY 
                            p.id, p.title, p.description, p.status, p.updated_at, pe.max_price, p.collection_id
                    ) as count`),
				sharedContext.manager.execute(`
                    ${this.getCommonCTEs(transformedGroups, regionId)}
                    SELECT 
                        p.id,
                        p.title,
                        p.description,
                        p.status,
                        p.updated_at,
                        pe.max_price,   
                        p.created_at,
                        p.thumbnail,
                        p.handle,
                        p.discountable,
                        p.collection_id,    
                        p.weight,
                        p.length,
                        p.height,
                        p.width,
                        p.subtitle,
                        p.is_giftcard,
                        p.metadata,
                        json_agg(DISTINCT jsonb_build_object(
                            'id',pcoll.id,
                            'title', pcoll.title,
                            'handle',pcoll.handle,
                            'metadata',pcoll.metadata,
                            'created_at',pcoll.created_at,
                            'updated_at',pcoll.updated_at,
                            'deleted_at',pcoll.deleted_at
                        )) FILTER (WHERE pcoll.id IS NOT NULL) as collection,
                        jsonb_agg(DISTINCT jsonb_build_object(
                            'id', bd.brand_id,
                            'name', bd.name,
                            'product_id', bd.product_id
                        )) FILTER (WHERE bd.brand_id IS NOT NULL) as brand,
                        jsonb_agg(DISTINCT jsonb_build_object(
                            'id', tag.id,
                            'value', tag.value,
                            'created_at', tag.created_at,
                            'updated_at', tag.updated_at,
                            'metadata', tag.metadata,
                            'deleted_at', tag.deleted_at
                        )) FILTER (WHERE tag.id IS NOT NULL) as tags, 
                        jsonb_agg(DISTINCT jsonb_build_object( 
                            'id', img.id,
                            'url', img.url,
                            'metadata', img.metadata,
                            'created_at', img.created_at,
                            'updated_at', img.updated_at,
                            'deleted_at', img.deleted_at,
                            'rank', img.rank
                        )) FILTER (WHERE img.id IS NOT NULL) as images, 
                         jsonb_agg(DISTINCT jsonb_build_object(
                             'id', pcp.product_category_id,
                             'name', pc.name,
                             'description', pc.description,
                             'handle', pc.handle,
                             'metadata', pc.metadata,
                             'parent_category_id', pc.parent_category_id
                             )) FILTER (WHERE pc.id IS NOT NULL) as categories,
                        jsonb_agg(DISTINCT od) as options,
                        jsonb_agg(DISTINCT
                            ${
															availableStock
																? `CASE 
                                WHEN vi.total_available_inventory > 0 THEN`
																: ""
														}
                                    jsonb_build_object(
                                        'id', pv.id,
                                        'title', pv.title,
                                        'sku', pv.sku,
                                        'allow_backorder', pv.allow_backorder,
                                        'manage_inventory', pv.manage_inventory,
                                        'origin_country', pv.origin_country,
                                        'height', pv.height,
                                        'width', pv.width,
                                        'material', pv.material,
                                        'weight', pv.weight,
                                        'length', pv.length,
                                        'metadata', pv.metadata,
                                        'variant_rank', pv.variant_rank,
                                        'hs_code', pv.hs_code,
                                        'barcode', pv.barcode,
                                        'updated_at', pv.updated_at,
                                        'created_at', pv.created_at,
                                        'product_id', pv.product_id,
                                        'mid_code', pv.mid_code,
                                        'deleted_at', pv.deleted_at,
                                        'origin_country', pv.origin_country,
                                        'upc', pv.upc,
                                        'ean', pv.ean,
                                        'options', COALESCE(vo.options, '[]'::jsonb),
                                        'calculated_price', COALESCE(vp.price, '{}'::jsonb),
                                        'inventory', COALESCE(vi.total_available_inventory, 0)
                                    )
                            ${availableStock ? "ELSE NULL" : ""}
                        ${availableStock ? "END" : ""}
                        ) ${availableStock ? "FILTER (WHERE vi.total_available_inventory > 0)" : ""} as variants
                    FROM 
                        ${this.getCommonJoins()}
                    WHERE 
                        ${this.getWhereConditions(query, collectionIds, categoryIds, minPrice, maxPrice, availableStock, isDiscountAvailable, brandIds)}
                    GROUP BY 
                        p.id, p.title, p.description, p.status, p.created_at, p.updated_at, pe.max_price, p.collection_id
                    ORDER BY 
                        ${sortBy === "price" ? "pe.max_price" : sortBy === "name" ? "p.title" : `p.${sortBy}`} ${sortOrder} NULLS LAST
                    LIMIT ${limit} OFFSET ${offset}`),
			]);

			return {
				products,
				page,
				limit,
				count: Number(count[0].count),
			};
		} catch (error) {
			console.error("Error in getFilterWithValue:", error);
			throw error;
		}
	}

	@InjectManager()
	async getPriceRangeValue(
		filters: { currency_code?: string },
		@MedusaContext() sharedContext?: Context<SqlEntityManager>
	): Promise<any> {
		if (!sharedContext?.manager) {
			throw new Error("Shared context or manager is undefined.");
		}

		try {
			const [result] = await sharedContext.manager.execute(`
                    SELECT MAX(amount), MIN(amount)
                    FROM "price"
                    WHERE deleted_at IS NULL
                    ${filters.currency_code ? `AND currency_code = '${filters.currency_code}'` : ""}
                `);

			return {
				...result,
				...(filters.currency_code
					? { currencyCode: filters.currency_code }
					: {}),
			};
		} catch (error) {
			console.error("Error in getPriceRangeValue:", error);
			throw error;
		}
	}
}

export default ProductFilterService;
