import { model } from "@medusajs/framework/utils";
import WishlistDetail from "./wishlist-details";

const WishlistItem = model.define("wishlist_item", {
	id: model.id().primaryKey(),
	// TODO variant_id
	variant_id: model.text().nullable(),
	wishlist_id: model.belongsTo(() => WishlistDetail, {
		mappedBy: "items",
	}),
});

export type WishlistItemTypes = {
	id?: string;
	variant_id: string;
	wishlist_id: string;
};

export default WishlistItem;
