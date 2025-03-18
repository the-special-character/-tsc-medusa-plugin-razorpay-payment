import { defineLink, DefineLinkExport } from "@medusajs/framework/utils";
import ProductModule from "@medusajs/medusa/product";
import WishlistModule, { WISHLIST_MODULE } from "../modules/wishlist";

let link: DefineLinkExport | null = null;

//pk_ad7c6dbe33a23c6f0468b4f54197b7a9afda818d2d168d821a0e859038625080

link = defineLink(ProductModule.linkable.product, {
  linkable: WishlistModule.linkable.wishlistItem,
  deleteCascade: true,
});

export default link;
