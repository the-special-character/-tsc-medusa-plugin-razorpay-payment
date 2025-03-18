import { defineMiddlewares, MiddlewareRoute } from "@medusajs/framework";
import upload from "./middlewares/fileUploadMiddleware";

const productSeoRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/product-seo/**",
    method: "POST",
    middlewares: [upload.array("files")],
  },
  {
    matcher: "/admin/product-seo/**",
    method: "PUT",
    middlewares: [upload.array("files")],
  },
];

export default defineMiddlewares(productSeoRoutesMiddlewares);
