import Link from "next/link";
import {
  Check,
  Truck,
  Package,
  MapPin,
  Download,
  RotateCcw,
} from "lucide-react";

import { fmt, MOCK_ORDERS, PRODUCTS } from "@/lib/store-data";

export default async function OrderDetailPage({ params }) {
  const { id } = await params;

  const order = MOCK_ORDERS.find((o) => o.id === id) ?? {
    id,
    date: "2026-06-09",
    status: "Processing",
    items: [],
  };
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/account/orders" className="text-sm text-primary">
        ← Back to orders
      </Link>

      <div className="mt-6 flex justify-between items-center">
        <div>
          <h1 className="font-display text-3xl font-bold">Order {order.id}</h1>

          <p className="text-muted-foreground">Placed on {order.date}</p>
        </div>

        <div className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
          {order.status}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-3xl border p-6">
          <h2 className="font-bold text-xl mb-4">Items</h2>

          {Array.isArray(order.items) &&
            order.items.map((item) => (
              <div key={item.id} className="flex gap-4 border-b py-4">
                <img
                  src={item.img}
                  className="h-20 w-20 rounded-xl object-cover"
                />

                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>

                  <p className="text-sm text-muted-foreground">
                    Qty: {item.qty}
                  </p>
                </div>

                <p className="font-bold">{fmt(item.price * item.qty)}</p>
              </div>
            ))}
        </div>

        <div className="rounded-3xl border p-6">
          <h2 className="font-bold text-lg">Delivery</h2>

          <div className="mt-4 flex gap-3">
            <Truck />

            <div>
              <p className="font-semibold">Standard Delivery</p>

              <p className="text-sm text-muted-foreground">2-3 days</p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <MapPin />

            <div>
              <p className="font-semibold">Shipping address</p>

              <p className="text-sm text-muted-foreground">
                12 Marina Boulevard
                <br />
                Lagos, Nigeria
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button className="flex items-center gap-2 rounded-full border px-6 py-3">
          <Download className="h-4 w-4" />
          Invoice
        </button>

        <button className="flex items-center gap-2 rounded-full border px-6 py-3">
          <RotateCcw className="h-4 w-4" />
          Return
        </button>
      </div>
    </div>
  );
}
