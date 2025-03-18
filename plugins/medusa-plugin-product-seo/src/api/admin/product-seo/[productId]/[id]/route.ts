import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import type { FileDTO } from "@medusajs/framework/types";
import { PRODUCT_SEO_MODULE } from "../../../../../modules/product-seo";
import { SeoDetailsTypes } from "../../../../../modules/product-seo/models/seo-details";
import ProductSeoModuleService from "../../../../../modules/product-seo/service";
import { uploadFilesWorkflow } from "@medusajs/medusa/core-flows";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const productSeoService: ProductSeoModuleService =
      req.scope.resolve(PRODUCT_SEO_MODULE);

    const data = await productSeoService.retrieveSeoDetails(req.params.id, {
      relations: ["metaSocial.*"],
      select: ["*"],
    });
    if (!data) {
      return res.json({ error: "Product SEO not found" });
    }
    return res.json({ data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function PUT(
  req: MedusaRequest<SeoDetailsTypes>,
  res: MedusaResponse
) {
  try {
    const { metaSocial, ...rest } = req.body;
    console.log("step 1", req.body);

    const productSeoService: ProductSeoModuleService =
      req.scope.resolve(PRODUCT_SEO_MODULE);
    console.log("step 2");
    const files_input = req.files as Express.Multer.File[];
    const social_files = files_input?.filter((f) =>
      f.originalname.includes("metaSocial.image")
    );
    const seo_files = files_input?.filter(
      (f) => !f.originalname.includes("metaSocial.image")
    );
    console.log("step 3");
    let upload_result: FileDTO | null = null;
    if (seo_files?.length > 0) {
      const { result } = await uploadFilesWorkflow(req.scope).run({
        input: {
          files: seo_files?.map((f) => {
            return {
              filename: f.originalname,
              mimeType: f.mimetype,
              content: f.buffer.toString("binary"),
              access: "public",
            };
          }),
        },
      });
      if (result) {
        upload_result = result[0];
      }
    }
    console.log("step 4");
    const data = await productSeoService.updateSeoDetails({
      id: req.params.id,
      ...rest,
      ...(upload_result?.url && { metaImage: upload_result?.url }),
    });
    console.log("step 5");
    const socials =
      typeof metaSocial === "string" ? JSON.parse(metaSocial) : metaSocial;
    console.log("metaSocial", metaSocial);

    if (socials && Array.isArray(socials) && socials.at(0)) {
      socials.forEach(async (item) => {
        let upload_result: FileDTO | null = null;
        if (item.id) {
          const edited_image_file = social_files.find((f) => {
            if (f.originalname.includes(item.id)) {
              return f;
            }
          });
          if (edited_image_file) {
            const { result } = await uploadFilesWorkflow(req.scope).run({
              input: {
                files: [
                  {
                    filename: edited_image_file.originalname,
                    mimeType: edited_image_file.mimetype,
                    content: edited_image_file.buffer.toString("binary"),
                    access: "public",
                  },
                ],
              },
            });
            if (result) {
              upload_result = result[0];
            }
          }
          if (!item.isDeleted) {
            await productSeoService.updateSeoSocials({
              id: item.id,
              ...item,
              ...(upload_result?.url && { image: upload_result?.url }),
            });
          }
          if (item.isDeleted) {
            console.log("DELETING:::::::::item.id", item.id, item);
            const response = await productSeoService.deleteSeoSocials(item.id);
            console.log("DELETING:::::::::response", response);
            return;
          }
        } else {
          const new_image_file = social_files.find((f) => {
            if (
              f.originalname.includes(`new_item_${item.index}_newMetaSocial`)
            ) {
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
          await productSeoService.createSeoSocials({
            ...item,
            seo_details_id: data.id,
            ...(upload_result?.url && { image: upload_result?.url }),
          });
        }
      });
    }
    console.log("step 6");
    const newProductSeo = await productSeoService.retrieveSeoDetails(data.id, {
      relations: ["*", "metaSocial.*"],
    });
    console.log("step 7");
    res.json({ data: newProductSeo });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  try {
    const productSeoService: ProductSeoModuleService =
      req.scope.resolve(PRODUCT_SEO_MODULE);
    await productSeoService.deleteSeoDetails(req.params.id);
    res.json({ message: "Product SEO deleted" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
