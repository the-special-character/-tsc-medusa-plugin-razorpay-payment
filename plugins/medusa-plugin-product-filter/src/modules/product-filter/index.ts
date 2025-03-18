import { Module } from "@medusajs/framework/utils"
import ProductFilterModuleService from "./service"

export const PRODUCT_FILTER_MODULE = "product-filter"

export default Module(PRODUCT_FILTER_MODULE, {
    service: ProductFilterModuleService,
})  