"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div>
        <h1>Your Cart</h1>
        <div className="state-message" data-testid="empty-cart">
          Your cart is empty.{" "}
          <Link href="/" className="back-link">
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Your Cart</h1>
      <div className="cart-list" data-testid="cart-list">
        {items.map((item) => (
          <div className="cart-row" key={item.productId} data-testid="cart-row">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.thumbnail} alt={item.title} />
            <div className="cart-row__info">
              <div>{item.title}</div>
              <div>${item.price.toFixed(2)}</div>
            </div>
            <input
              type="number"
              min={1}
              value={item.quantity}
              aria-label={`Quantity for ${item.title}`}
              onChange={(e) =>
                updateQuantity(item.productId, Number(e.target.value))
              }
              style={{ width: 56 }}
            />
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => removeFromCart(item.productId)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <span>Total: ${totalPrice.toFixed(2)}</span>
        <button type="button" className="btn btn-outline" onClick={clearCart}>
          Clear cart
        </button>
      </div>
    </div>
  );
}
