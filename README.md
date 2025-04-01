<p align="center">
  <a href="https://www.medusajs.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/59018053/229103275-b5e482bb-4601-46e6-8142-244f531cebdb.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    <img alt="Medusa logo" src="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    </picture>
  </a>
</p>
<h1 align="center">
  Medusa Plugin Starter
</h1>

<h4 align="center">
  <a href="https://docs.medusajs.com">Documentation</a> |
  <a href="https://www.medusajs.com">Website</a>
</h4>

<p align="center">
  Building blocks for digital commerce
</p>
<p align="center">
  <a href="https://github.com/medusajs/medusa/blob/master/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
    <a href="https://www.producthunt.com/posts/medusa"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Day-%23DA552E" alt="Product Hunt"></a>
  <a href="https://discord.gg/xpCwq3Kfn8">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=medusajs">
    <img src="https://img.shields.io/twitter/follow/medusajs.svg?label=Follow%20@medusajs" alt="Follow @medusajs" />
  </a>
</p>

## Compatibility

This starter is compatible with versions >= 2.4.0 of `@medusajs/medusa`. 

# Payment-Razorpay

# Support the Payment-Razorpay Provider - Elevate Our Medusa Community!

Dear Developers and E-commerce Enthusiasts,

Are you ready to revolutionize the world of online stores with MedusaJS? We have an exciting opportunity that will make payment processing a breeze for our beloved Medusa platform! Introducing the Payment-Razorpay provider, a community-driven project that brings the immensely popular [RAZORPAY](https://razorpay.com) payment gateway to our MedusaJS commerce stack.

**What's in it for You:**

🚀 Streamline Payment Processing: With Payment-Razorpay, you can unleash the full potential of Razorpay's features, ensuring seamless and secure payments for your customers.

🌐 Global Reach: Engage with customers worldwide, as Razorpay supports various currencies and payment methods, catering to a diverse audience.

🎉 Elevate Your Medusa Store: By sponsoring this provider, you empower the entire Medusa community, driving innovation and success across the platform.

## Installation Made Simple

No hassle, no fuss! Install Payment-Razorpay effortlessly with npm:



[RAZORPAY](https://razorpay.com) an immensely popular payment gateway with a host of features. 
This provider enables the razorpay payment interface on [medusa](https://medusajs.com) commerce stack

## Installation

Use the package manager npm to install Payment-Razorpay.

```bash
npm install @tsc_tech/medusa-plugin-razorpay-payment
yarn add @tsc_tech/medusa-plugin-razorpay-payment
```

Additionally, install the Razorpay package:

```bash
npm install razorpay
yarn add razorpay
```


## Configuration

Step 1: Register on Razorpay
Create an account on Razorpay and generate API keys from the Razorpay dashboard.

Step 2: Set Up Environment Variables
In your .env file, define the following variables:
```
RAZORPAY_ID=<your api key>
RAZORPAY_SECRET=<your api key secret>
RAZORPAY_ACCOUNT=<your razorpay account number/merchant id>
RAZORPAY_WEBHOOK_SECRET=<your web hook secret as defined in the webhook settings in the razorpay dashboard >
```

Step 3: Update Medusa Configuration
Modify your medusa-config.ts to include the Razorpay provider:

```
module.exports = defineConfig({
modules: [
  ...
    {      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          ...
          {
            resolve: "@tsc_tech/medusa-plugin-razorpay-payment/providers/razorpay",
            id: "razorpay",
            options: {
              key_id:
                  process?.env?.RAZORPAY_TEST_KEY_ID ??
                  process?.env?.RAZORPAY_ID,
              key_secret:
                  process?.env?.RAZORPAY_TEST_KEY_SECRET ??
                  process?.env?.RAZORPAY_SECRET,
              razorpay_account:
                  process?.env?.RAZORPAY_TEST_ACCOUNT ??
                  process?.env?.RAZORPAY_ACCOUNT,
              automatic_expiry_period: 30 /* any value between 12minuts and 30 days expressed in minutes*/,
              manual_expiry_period: 20,
              refund_speed: "normal",
              webhook_secret:
                  process?.env?.RAZORPAY_TEST_WEBHOOK_SECRET ??
                  process?.env?.RAZORPAY_WEBHOOK_SECRET
          }
          },
          ....
        ],
     } },
  ...]
})
```


## Client-Side Configuration (Next.js)


For Next.js projects, install the Razorpay package:
 

1. Install package to your next starter. This just makes it easier, importing all the scripts implicitly
```
yarn add react-razorpay

```
2. Create a button for Razorpay <next-starter>/src/modules/checkout/components/payment-button/razorpay-payment-button.tsx

like below


````
import { Button } from "@medusajs/ui"
import Spinner from "@modules/common/icons/spinner"
import React, { useCallback, useEffect, useState } from "react"
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay"
import { HttpTypes } from "@medusajs/types"
import { placeOrder } from "@lib/data/cart"
import { CurrencyCode } from "react-razorpay/dist/constants/currency"
export const RazorpayPaymentButton = ({
  session,
  notReady,
  cart,
}: {
  session: HttpTypes.StorePaymentSession
  notReady: boolean
  cart: HttpTypes.StoreCart
}) => {
  const [disabled, setDisabled] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  )
  const { Razorpay } = useRazorpay()

  const [orderData, setOrderData] = useState({ id: "" })


  console.log(`session_data: ` + JSON.stringify(session))
  const onPaymentCompleted = async () => {
    await placeOrder().catch(() => {
      setErrorMessage("An error occurred, please try again.")
      setSubmitting(false)
    })
  }
  useEffect(() => {
    setOrderData(session.data as { id: string })
  }, [session.data])

  const handlePayment = useCallback(async () => {
    // const onPaymentCancelled = async () => {
    //   await cancelOrder(session.provider_id).catch(() => {
    //     setErrorMessage("PaymentCancelled")
    //     setSubmitting(false)
    //   })
    // }
    const options: RazorpayOrderOptions = {
      callback_url: `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/razorpay/hooks`,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY ?? "",
      amount: session.amount * 100 * 100,
      order_id: orderData.id,
      currency: cart.currency_code.toUpperCase() as CurrencyCode,
      name: process.env.COMPANY_NAME ?? "your company name ",
      description: `Order number ${orderData.id}`,
      remember_customer: true,

      image: "https://example.com/your_logo",
      modal: {
        backdropclose: true,
        escape: true,
        handleback: true,
        confirm_close: true,
        ondismiss: async () => {
          setSubmitting(false)
          setErrorMessage(`payment cancelled`)
          // await onPaymentCancelled()
        },
        animation: true,
      },

      handler: async () => {
        onPaymentCompleted()
      },
      prefill: {
        name:
          cart.billing_address?.first_name +
          " " +
          cart?.billing_address?.last_name,
        email: cart?.email,
        contact: cart?.shipping_address?.phone ?? undefined,
      },
    }
    console.log(JSON.stringify(options.amount))
    //await waitForPaymentCompletion();

    const razorpay = new Razorpay(options)
    if (orderData.id) razorpay.open()
    razorpay.on("payment.failed", function (response: any) {
      setErrorMessage(JSON.stringify(response.error))
    })
    razorpay.on("payment.authorized" as any, function (response: any) {
      const authorizedCart = placeOrder().then((authorizedCart) => {
        JSON.stringify(`authorized:` + authorizedCart)
      })
    })
    // razorpay.on("payment.captured", function (response: any) {

    // }
    // )
  }, [
    Razorpay,
    cart.billing_address?.first_name,
    cart.billing_address?.last_name,
    cart.currency_code,
    cart?.email,
    cart?.shipping_address?.phone,
    orderData.id,
    session.amount,
    session.provider_id,
  ])
  console.log("orderData" + JSON.stringify(orderData))

  return (
    <>
      <Button
        disabled={
          submitting || notReady || !orderData?.id || orderData.id == ""
        }
        onClick={() => {
          console.log(`processing order id: ${orderData.id}`)
          handlePayment()
        }}
      >
        {submitting ? <Spinner /> : "Checkout"}
      </Button>
      {errorMessage && (
        <div className="text-red-500 text-small-regular mt-2">
          {errorMessage}
        </div>
      )}
    </>
  )
}

`````

Step 3. 

nextjs-starter-medusa/src/lib/constants.tsx
add

```
export const isRazorpay = (providerId?: string) => {
  return providerId?.startsWith("pp_razorpay_razorpay")
}

// and the following to the list
export const paymentInfoMap: Record<
  string,
  { title: string; icon: React.JSX.Element }
> = {...
   pp_razorpay_razorpay: {
    title: "Razorpay",
    icon: <CreditCard />,
  },
  ...}

````
step 4.add into the payment element <next-starter>/src/modules/checkout/components/payment-button/index.tsx

first 
```
import {RazorpayPaymentButton} from "./razorpay-payment-button"
```
then
```
case isRazorpay(paymentSession?.provider_id):
         return <RazorpayPaymentButton session={paymentSession} notReady={notReady} cart={cart} />
```


Step 4. modify initiatePaymentSession in the client storefront/src/modules/checkout/components/payment/index.tsx
```

.....
 try {
      const shouldInputCard =
        isStripeFunc(selectedPaymentMethod) && !activeSession

      const checkActiveSession =
        activeSession?.provider_id === selectedPaymentMethod

      if (!checkActiveSession) {
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
          data: {
            cart,
          },
        })
      }
 }
 ....
```

Step 5. Add environment variables in the client

  NEXT_PUBLIC_RAZORPAY_KEY:<your razorpay key>
  NEXT_PUBLIC_SHOP_NAME:<your razorpay shop name>
  NEXT_PUBLIC_SHOP_DESCRIPTION: <your razorpayshop description>
#### watch out
Step 6. Caveat 
the default starter template has an option which says use the same shipping and billing address
please ensure you deselect this and enter the phone number manually in the billing section.

Step 7.

In razorpay create a webhook with the following url 

<your host>/hooks/payment/razorpay_razorpay

## Contributing


Contributions are welcome! For significant changes, please open an issue first to discuss your proposed modifications.

Kindly ensure that tests are updated as needed.

## License
[MIT](https://choosealicense.com/licenses/mit/)

## Untested features

These features exists, but without implementing the client it isn't possible to tests these outright

1. Capture Payment
2. Refund


## Disclaimer
The code has been tested in a limited number of scenarios, so unforeseen bugs may arise. Please report any issues you encounter or submit a pull request if you'd like to contribute fixes.


## Support the Razorpay-Payment Provider - Strengthen Our Medusa Community!
