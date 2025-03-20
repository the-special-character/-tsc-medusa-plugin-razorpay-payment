import { ModuleProvider, Modules } from "@medusajs/framework/utils";
import { RazorpayService } from "./services";

export default ModuleProvider(Modules.PAYMENT, {
  services: [RazorpayService],
});
