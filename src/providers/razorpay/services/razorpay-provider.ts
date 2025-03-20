import RazorpayBase from "../core/razorpay-base";
import { PaymentIntentOptions, PaymentProviderKeys } from "../types";

class RazorpayService extends RazorpayBase {
  static identifier = PaymentProviderKeys.RAZORPAY;

  constructor(_, options) {
    super(_, options);
  }

  get paymentIntentOptions(): PaymentIntentOptions {
    return {} as any;
  }
}

export default RazorpayService;
