import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { CartProvider, useCart } from "@/context/CartContext";
import { Product } from "@/lib/types";

const product: Product = {
  id: 1,
  title: "Test Product",
  description: "A product used in tests",
  category: "test",
  price: 9.99,
  discountPercentage: 0,
  rating: 4.5,
  stock: 10,
  thumbnail: "https://example.com/thumb.jpg",
  images: [],
};

const otherProduct: Product = {
  ...product,
  id: 2,
  title: "Other Product",
  price: 4.5,
};

function renderCart() {
  return renderHook(() => useCart(), {
    wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
  });
}

describe("CartContext", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("starts empty", async () => {
    const { result } = renderCart();
    await waitFor(() => expect(result.current.itemCount).toBe(0));
    expect(result.current.items).toEqual([]);
  });

  it("adds a product to the cart", async () => {
    const { result } = renderCart();
    await waitFor(() => expect(result.current.items).toEqual([]));

    act(() => {
      result.current.addToCart(product);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toMatchObject({
      productId: 1,
      quantity: 1,
    });
    expect(result.current.itemCount).toBe(1);
  });

  it("increments quantity when the same product is added again", async () => {
    const { result } = renderCart();
    await waitFor(() => expect(result.current.items).toEqual([]));

    act(() => {
      result.current.addToCart(product);
      result.current.addToCart(product);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.itemCount).toBe(2);
  });

  it("computes total price across multiple distinct items", async () => {
    const { result } = renderCart();
    await waitFor(() => expect(result.current.items).toEqual([]));

    act(() => {
      result.current.addToCart(product); // 9.99
      result.current.addToCart(otherProduct, 2); // 4.50 * 2 = 9.00
    });

    expect(result.current.totalPrice).toBeCloseTo(18.99, 2);
  });

  it("removes a product from the cart", async () => {
    const { result } = renderCart();
    await waitFor(() => expect(result.current.items).toEqual([]));

    act(() => {
      result.current.addToCart(product);
    });
    expect(result.current.items).toHaveLength(1);

    act(() => {
      result.current.removeFromCart(product.id);
    });
    expect(result.current.items).toHaveLength(0);
  });

  it("removes the item when quantity is updated to zero or below", async () => {
    const { result } = renderCart();
    await waitFor(() => expect(result.current.items).toEqual([]));

    act(() => {
      result.current.addToCart(product);
      result.current.updateQuantity(product.id, 0);
    });

    expect(result.current.items).toHaveLength(0);
  });

  it("clears the entire cart", async () => {
    const { result } = renderCart();
    await waitFor(() => expect(result.current.items).toEqual([]));

    act(() => {
      result.current.addToCart(product);
      result.current.addToCart(otherProduct);
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.itemCount).toBe(0);
  });

  it("persists the cart to localStorage and restores it for a new mount", async () => {
    const { result, unmount } = renderCart();
    await waitFor(() => expect(result.current.items).toEqual([]));

    act(() => {
      result.current.addToCart(product, 3);
    });

    await waitFor(() => {
      const raw = window.localStorage.getItem("product-catalog-cart");
      expect(raw).not.toBeNull();
      expect(JSON.parse(raw as string)).toHaveLength(1);
    });

    unmount();

    const { result: result2 } = renderCart();
    await waitFor(() => expect(result2.current.items).toHaveLength(1));
    expect(result2.current.items[0]).toMatchObject({
      productId: 1,
      quantity: 3,
    });
  });
});
