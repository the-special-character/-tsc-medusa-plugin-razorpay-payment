import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { WISHLIST_MODULE } from "../../../modules/wishlist";
import WishlistService from "../../../modules/wishlist/service";
import { WishlistDetailTypes } from "../../../modules/wishlist/models/wishlist-details";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { WishlistItemTypes } from "../../../modules/wishlist/models/wishlist-item";
import { Link } from "@medusajs/framework/modules-sdk";

// export async function POST(
// 	req: MedusaRequest<{ customer_id?: string; region_id?: string }>,
// 	res: MedusaResponse
// ) {
// 	const { customer_id, region_id } = req.body;
// 	const wishlistService: WishlistService = req.scope.resolve(WISHLIST_MODULE);
// 	const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
// 	const { data: customers } = await query.graph({
// 		entity: "customer",
// 		fields: ["*", "wishlist.*", "wishlist.items.*"],
// 		filters: {
// 			id: customer_id,
// 		},
// 	});

// 	const { data: region } = await query.graph({
// 		entity: "region",
// 		filters: {
// 			id: region_id,
// 		},
// 		fields: ["*"],
// 	});
// 	if (
// 		(customers && customers.length === 0) ||
// 		(region && region.length === 0)
// 	) {
// 		return res
// 			.status(400)
// 			.send({ message: "invalid parameters customer or region" });
// 	}
// 	let wishlist;
// 	if (
// 		Array.isArray(customers[0].wishlist) &&
// 		customers[0].wishlist.find((x) => x)
// 	) {
// 		console.log(
// 			"wishlist exist as null array",
// 			customers[0].wishlist,
// 			customers[0].wishlist.find((x) => x)
// 		);
// 		wishlist = customers[0].wishlist.find((x) => x);
// 		return res.send({ wishlist });
// 	}
// 	if (customers[0].wishlist && !Array.isArray(customers[0].wishlist)) {
// 		console.log("wishlist exist", customers[0].wishlist);

// 		wishlist = customers[0].wishlist;
// 		return res.send({ wishlist });
// 	}
// 	console.log({ customers: customers });

// 	wishlist = await wishlistService.createWishlists({
// 		region_id,
// 		customer_id,
// 	});
// 	const remoteLink: Link = req.scope.resolve(
// 		ContainerRegistrationKeys.LINK
// 	);
// 	if (customer_id) {
// 		await remoteLink.create({
// 			[Modules.CUSTOMER]: {
// 				customer_id: wishlist.customer_id,
// 			},
// 			wishlistModuleService: {
// 				wishlist_id: wishlist.id,
// 			},
// 		});
// 	}

// 	console.log({ wishlist });
// 	res.send({ wishlist });

// 	// const listWishlist = await wishlistService.listWishlists(
// 	// 	{},
// 	// 	{
// 	// 		filters: {},
// 	// 	}
// 	// );
// 	// if (listWishlist.length > 1) {
// 	// 	return res.status(400).send({
// 	// 		message: `wishlist with product id ${product_id} already exist`,
// 	// 		listWishlist,
// 	// 	});
// 	// }
// 	// console.log({ listWishlist });
// 	// const wishlistCreated = await wishlistService.createWishlists({
// 	// 	customer_id,
// 	// 	product_id,
// 	// 	region_id,
// 	// });
// 	// return res.status(200).json({ wishlist: wishlistCreated });
// }
export async function GET(
	req: MedusaRequest<WishlistDetailTypes>,
	res: MedusaResponse
) {
	const wishlistService: WishlistService = req.scope.resolve(WISHLIST_MODULE);
	// if (!req.body.product_id) {
	// 	return res.status(400).send({ message: "product id is required" });
	// }
	const wishlist = await wishlistService.listWishlists(
		{},
		{ relations: ["items"] }
	);
	const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
	const { data: products } = await query.graph({
		entity: "products",
		fields: ["*", "wishlist_item.*"],
		filters: {
			id: "prod_01JDYARQ47H6GMQRH4J4EDF14D",
		},
	});
	const { data: customers } = await query.graph({
		entity: "customer",
		fields: ["*", "wishlist.*", "wishlist.items.*"],
		filters: {},
	});
	console.log({
		customers: JSON.stringify(customers),
		products: JSON.stringify(products),
	});
	res.status(200).json({ wishlist });
}
