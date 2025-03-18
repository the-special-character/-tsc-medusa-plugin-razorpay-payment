import { loadEnv, defineConfig } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    // redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  plugins: [
    {
      resolve: "medusa-plugin-wishlist",
      options: {},
    },
    // {
    //   resolve: "medusa-plugin-product-seo",
    //   options: {},
    // },
    // {
    //   resolve: "medusa-plugin-brand",
    //   options: {},
    // },
    // {
    //   resolve: "medusa-plugin-faq",
    //   options: {},
    // },
    // {
    //   resolve: "medusa-plugin-product-variant-images",
    //   options: {},
    // },
    // {
    //   resolve: "medusa-plugin-product-filter",
    //   options: {},
    // },
    // {
    //   resolve: "medusa-plugin-product-additional-details",
    //   options: {},
    // },
    // {
    //   resolve: "medusa-plugin-product-category-details",
    //   options: {},
    // },
  ],
  admin: {},
  modules: [],
});
