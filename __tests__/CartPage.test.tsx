import { describe, it, expect, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import CartPage from "@/app/cart/page";
import { renderWithCart } from "./test-utils";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const STORAGE_KEY = "product-catalog-cart";

describe("CartPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows an empty state when the cart has no items", async () => {
    renderWithCart(<CartPage />);

    await waitFor(() => {
      expect(screen.getByTestId("empty-cart")).toBeInTheDocument();
    });
    expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
  });

  it("lists items already in the cart and shows the correct total", async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          productId: 1,
          title: "Sample Backpack",
          price: 49.99,
          thumbnail: "https://example.com/backpack.jpg",
          quantity: 2,
        },
      ])
    );

    renderWithCart(<CartPage />);

    await waitFor(() => {
      expect(screen.getByTestId("cart-list")).toBeInTheDocument();
    });
    expect(screen.getByText("Sample Backpack")).toBeInTheDocument();
    expect(screen.getByText("Total: $99.98")).toBeInTheDocument();
  });

  it("removing an item updates the cart and shows the empty state again", async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          productId: 1,
          title: "Sample Backpack",
          price: 49.99,
          thumbnail: "https://example.com/backpack.jpg",
          quantity: 1,
        },
      ])
    );

    renderWithCart(<CartPage />);

    await waitFor(() => {
      expect(screen.getByTestId("cart-list")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Remove" }));

    await waitFor(() => {
      expect(screen.getByTestId("empty-cart")).toBeInTheDocument();
    });
  });

  it("clearing the cart removes all items", async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          productId: 1,
          title: "Sample Backpack",
          price: 49.99,
          thumbnail: "https://example.com/backpack.jpg",
          quantity: 1,
        },
        {
          productId: 2,
          title: "Sample Bike Light",
          price: 9.99,
          thumbnail: "https://example.com/light.jpg",
          quantity: 1,
        },
      ])
    );

    renderWithCart(<CartPage />);

    await waitFor(() => {
      expect(screen.getByTestId("cart-list")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Clear cart" }));

    await waitFor(() => {
      expect(screen.getByTestId("empty-cart")).toBeInTheDocument();
    });
  });
});
