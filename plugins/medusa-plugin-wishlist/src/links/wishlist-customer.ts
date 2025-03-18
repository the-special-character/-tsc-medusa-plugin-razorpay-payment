import { defineLink, DefineLinkExport } from "@medusajs/framework/utils";
import WishlistModule, { WISHLIST_MODULE } from "../modules/wishlist";
import CustomerModule from "@medusajs/medusa/customer";

let link: DefineLinkExport | null = null;

link = defineLink(CustomerModule.linkable.customer, {
  linkable: WishlistModule.linkable.wishlist,
  deleteCascade: true,
});

export default link;
