import { authMiddleware } from "./middlewares/auth";

import {
  authenticate,
  defineMiddlewares,
  MiddlewareRoute,
} from "@medusajs/framework";
import upload from "./middlewares/fileUploadMiddleware";

const wishlistRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/store/wishlist",
    method: "GET",
    middlewares: [authMiddleware],
  },
  {
    matcher: "/store/wishlist",
    method: "POST",
    middlewares: [authMiddleware],
  },
];

const blogsRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/blogs",
    method: "POST",
    middlewares: [
      upload.array("blogImage"),
      authenticate("user", ["session", "bearer"]),
    ],
  },
  {
    matcher: "/admin/blogs/*",
    method: "PUT",
    middlewares: [
      upload.array("blogImage"),
      authenticate("user", ["session", "bearer"]),
    ],
  },
  {
    matcher: "/admin/blog-seo/**",
    method: ["PUT", "POST"],
    middlewares: [upload.array("files")],
  },
];

export default defineMiddlewares([
  ...wishlistRoutesMiddlewares,
  ...blogsRoutesMiddlewares,
]);
