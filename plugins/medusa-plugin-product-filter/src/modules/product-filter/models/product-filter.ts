import { model } from "@medusajs/framework/utils"

export const ProductFilter = model.define("product_filter", {
    id: model.id().primaryKey(),
    name: model.text().index(),
    value: model.text().index()
})  