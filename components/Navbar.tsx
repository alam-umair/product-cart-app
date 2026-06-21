"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { itemCount } = useCart();

  return (
    <header className="navbar">
      <Link href="/" className="navbar__brand">
        Product Catalog
      </Link>
      <Link href="/cart" className="navbar__cart" aria-label="View cart">
        <span>Cart</span>
        <span className="navbar__cart-count" data-testid="cart-count">
          {itemCount}
        </span>
      </Link>
    </header>
  );
}
