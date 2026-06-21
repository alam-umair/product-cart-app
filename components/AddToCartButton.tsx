"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Product } from "@/lib/types";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  function handleClick() {
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <button
      type="button"
      className="btn btn-primary"
      onClick={handleClick}
      data-testid="add-to-cart"
    >
      {justAdded ? "Added!" : "Add to Cart"}
    </button>
  );
}
