import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import type { FileDTO } from "@medusajs/framework/types";
import { Link } from "@medusajs/framework/modules-sdk";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { PRODUCT_SEO_MODULE } from "../../../../modules/product-seo";
import { SeoDetailsTypes } from "../../../../modules/product-seo/models/seo-details";
import ProductSeoModuleService from "../../../../modules/product-seo/service";
import { uploadFilesWorkflow } from "@medusajs/medusa/core-flows";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  if (req.params.productId) {
    const { data } = await query.graph({
      entity: "products",
      fields: ["*", "seo_details.*", "seo_details.metaSocial.*"],
      filters: {
        id: req.params.productId,
      },
    });

    if (!data.at(0)?.seo_details) {
      return res.status(400).json({ message: "Product SEO not found" });
    }

    return res.json({
      data: data.at(0)?.seo_details,
    });
  }
  return res.status(400).json({ message: "Product ID is required" });
}

export async function POST(
  req: MedusaRequest<SeoDetailsTypes>,
  res: MedusaResponse
) {
  try {
    if (!req.params.productId) {
      res.status(400).json({ message: "Product ID is required" });
    }
    const productSeoService: ProductSeoModuleService =
      req.scope.resolve(PRODUCT_SEO_MODULE);
    const { metaSocial, metaImage, ...rest } = req.body;
    const socials =
      typeof metaSocial === "string" ? JSON.parse(metaSocial) : metaSocial;
    // return;
    if (!rest.metaTitle || !rest.metaDescription) {
      res
        .status(400)
        .json({ message: "Meta title and description are required" });
      return;
    }

    const files_input = req.files as Express.Multer.File[];

    const social_files = files_input?.filter((f) =>
      f.originalname.includes("metaSocial.image")
    );
    const seo_files = files_input?.filter(
      (f) => !f.originalname.includes("metaSocial.image")
    );
    let upload_result: FileDTO | null = null;
    if (seo_files?.length > 0) {
      const { result } = await uploadFilesWorkflow(req.scope).run({
        input: {
          files: seo_files?.map((f) => ({
            filename: f.originalname,
            mimeType: f.mimetype,
            content: f.buffer.toString("binary"),
            access: "public",
          })),
        },
      });
      if (result) {
        upload_result = result[0];
      }
    }
    const data = await productSeoService.createSeoDetails({
      ...rest,
      ...(upload_result?.url && { metaImage: upload_result?.url }),
    });

    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
    const { data: productData } = await query.graph({
      entity: "products",
      fields: ["*"],
      filters: {
        id: req.params.productId,
      },
    });
    if (socials && Array.isArray(socials) && socials.at(0)) {
      socials.forEach(async (item) => {
        let upload_result: FileDTO | null = null;
        const new_image_file = social_files.find((f) => {
          if (f.originalname.includes(`new_item_${item.index}_newMetaSocial`)) {
            return f;
          }
        });
        if (new_image_file) {
          const { result } = await uploadFilesWorkflow(req.scope).run({
            input: {
              files: [
                {
                  filename: new_image_file.originalname,
                  mimeType: new_image_file.mimetype,
                  content: new_image_file.buffer.toString("binary"),
                  access: "public",
                },
              ],
            },
          });
          if (result) {
            upload_result = result[0];
          }
        }
        const social_data = await productSeoService.createSeoSocials({
          ...item,
          seo_details_id: data.id,
          // ...(upload_result?.url && { image: upload_result?.url }),
        });
        await productSeoService.updateSeoSocials({
          id: social_data.id,
          ...(upload_result?.url && { image: upload_result?.url }),
        });
      });
    }
    const newProductSeo = await productSeoService.retrieveSeoDetails(data.id, {
      relations: ["*", "metaSocial.*"],
    });
    const remoteLink: Link = req.scope.resolve(ContainerRegistrationKeys.LINK);
    await remoteLink.create({
      [Modules.PRODUCT]: {
        product_id: productData.at(0)?.id,
      },
      productSeoModuleService: {
        seo_details_id: data.id,
      },
    });
    res.json({ data: newProductSeo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
