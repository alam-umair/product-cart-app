import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, screen, fireEvent, waitFor } from "@testing-library/react";
import AddToCartButton from "@/components/AddToCartButton";
import { useCart } from "@/context/CartContext";
import { renderWithCart } from "./test-utils";
import type { Product } from "@/lib/types";

const sampleProduct: Product = {
  id: 3,
  title: "Sample Mouse",
  description: "A wireless mouse.",
  category: "electronics",
  price: 19.99,
  discountPercentage: 0,
  rating: 4.0,
  stock: 20,
  thumbnail: "https://example.com/mouse.jpg",
  images: [],
};

function CartItemCountProbe() {
  const { itemCount } = useCart();
  return <span data-testid="cart-count-probe">{itemCount}</span>;
}

describe("AddToCartButton", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("adds the product to the cart when clicked", async () => {
    renderWithCart(
      <>
        <AddToCartButton product={sampleProduct} />
        <CartItemCountProbe />
      </>,
    );

    expect(screen.getByTestId("cart-count-probe")).toHaveTextContent("0");

    fireEvent.click(screen.getByTestId("add-to-cart"));

    await waitFor(() => {
      expect(screen.getByTestId("cart-count-probe")).toHaveTextContent("1");
    });
  });

  it("shows 'Added!' feedback after clicking, then reverts to 'Add to Cart'", async () => {
    vi.useFakeTimers();

    renderWithCart(<AddToCartButton product={sampleProduct} />);

    const button = screen.getByTestId("add-to-cart");
    expect(button).toHaveTextContent("Add to Cart");

    fireEvent.click(button);
    expect(button).toHaveTextContent("Added!");

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(button).toHaveTextContent("Add to Cart");
  });

  it("clicking twice in a row results in a quantity of 2, not two separate line items", async () => {
    renderWithCart(
      <>
        <AddToCartButton product={sampleProduct} />
        <CartItemCountProbe />
      </>,
    );

    const button = screen.getByTestId("add-to-cart");
    fireEvent.click(button);
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId("cart-count-probe")).toHaveTextContent("2");
    });
  });
});
