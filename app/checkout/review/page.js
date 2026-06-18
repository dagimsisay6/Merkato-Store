"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/store-context";
import { fmt } from "@/lib/store-data";

export default function ReviewPage() {
  const cart = useCart();

  const router = useRouter();

  function placeOrder() {
    cart.clear();

    router.push("/order-success");
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Review & place order</h2>

      <div>
        <h3 className="font-bold">Items ({cart.count})</h3>

        {cart.detailed.map(({ product, qty }) => (
          <div key={product.id} className="flex gap-3 border-b py-3">
            <img src={product.img} className="h-14 w-14 rounded-lg" />

            <p className="flex-1">{product.name}</p>

            <p>{fmt(product.price * qty)}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-5">
        <Link
          href="/checkout/payment"
          className="border rounded-full px-6 py-3"
        >
          Back
        </Link>

        <button
          onClick={placeOrder}
          className="rounded-full bg-accent px-10 py-3"
        >
          Place order
        </button>
      </div>
    </div>
  );
}
