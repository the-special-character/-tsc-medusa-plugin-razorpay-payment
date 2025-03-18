import {
	AuthenticatedMedusaRequest,
	MedusaResponse,
} from "@medusajs/framework";
import { WISHLIST_MODULE } from "../../../modules/wishlist";
import WishlistService from "../../../modules/wishlist/service";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

export async function POST(
	req: AuthenticatedMedusaRequest<{ region_id?: string; variant_id?: string }>,
	res: MedusaResponse
) {
	const { region_id, variant_id } = req.body;
	const customer_id = req.auth_context.actor_id;
	if (!region_id) {
		return res.status(400).send({ message: "region_id is required" });
	}
	if (!variant_id) {
		return res.status(400).send({ message: "variant_id is required" });
	}
	const wishlistService: WishlistService = req.scope.resolve(WISHLIST_MODULE);
	const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

	const { data: region } = await query.graph({
		entity: "region",
		filters: {
			id: region_id,
		},
		fields: ["*"],
	});
	if (region && region.length === 0) {
		return res.status(400).send({ message: "invalid parameters region" });
	}
	let wishlist;
	// first check if wishlist exist
	const { data: wishlistExist } = await query.graph({
		entity: "wishlists",
		filters: {
			customer_id: customer_id as unknown as undefined,
			region_id: region_id as unknown as undefined,
		},
		fields: ["*", "items.*"],
	});
	if (wishlistExist && wishlistExist.length > 0) {
		wishlist = wishlistExist[0];
	} else {
		//create new wishlist
		wishlist = await wishlistService.createWishlists({
			customer_id,
			region_id,
		});
	}
	//add item in to wishlistItem but check if item already exist then delete it
	const wishlistItemExist = await wishlistService.listWishlistItems({
		variant_id,
		wishlist_id: wishlist.id,
	});
	if (wishlistItemExist && wishlistItemExist.length > 0) {
		await wishlistService.deleteWishlistItems(wishlistItemExist[0].id);
	} else {
		await wishlistService.createWishlistItems({
			variant_id,
			wishlist_id: wishlist.id,
		});
	}
	const { data: dataWishlist } = await query.graph({
		entity: "wishlists",
		filters: {
			customer_id: customer_id as unknown as undefined,
			region_id: region_id as unknown as undefined,
		},
		fields: ["*", "items.*"],
	});

	return res.status(200).json({ wishlist: dataWishlist });
}

export async function GET(
	req: AuthenticatedMedusaRequest,
	res: MedusaResponse
) {
	const customerId = req.auth_context.actor_id;
	const { region_id } = req.query;
	if (!region_id) {
		return res.status(400).send({ message: "region_id is required" });
	}
	const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
	const { data: wishlist } = await query.graph({
		entity: "wishlists",
		filters: {
			customer_id: customerId as unknown as undefined,
			region_id: region_id as unknown as undefined,
		},
		fields: ["*", "items.*"],
	});
	const { data } = await query.graph({
		entity: "products",
		fields: ["*", "wishlist_item.*", "variants.*"],
		filters: {
			variants: {
				id: wishlist?.flatMap((x) =>
					x?.items?.map((p) => p?.variant_id)
				) as string[],
			},
		},
	});
	const variantIDs = wishlist?.flatMap(
		(x) => x?.items?.map((p) => p?.variant_id) as string[]
	);
	const { data: variants } = await query.graph({
		entity: "variants",
		fields: ["*", "product.*"],
		filters: {
			id: variantIDs,
		},
	});
	res.status(200).json({ wishlist, products: data, variants });
}
