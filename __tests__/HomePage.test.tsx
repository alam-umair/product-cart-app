import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";
import { getProducts, ApiError } from "@/lib/api";
import type { Product } from "@/lib/types";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api")>();
  return {
    ...actual,
    getProducts: vi.fn(),
  };
});

const sampleProduct: Product = {
  id: 1,
  title: "Sample Backpack",
  description: "A nice backpack.",
  category: "accessories",
  price: 49.99,
  discountPercentage: 0,
  rating: 4.2,
  stock: 12,
  thumbnail: "https://example.com/backpack.jpg",
  images: [],
};

describe("HomePage (product listing)", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("renders a product card for every product returned by the API", async () => {
    vi.mocked(getProducts).mockResolvedValueOnce({
      products: [sampleProduct],
      total: 1,
      skip: 0,
      limit: 100,
    });

    const ui = await HomePage();
    render(ui);

    expect(screen.getByText("All Products")).toBeInTheDocument();
    expect(screen.getByTestId("product-grid")).toBeInTheDocument();
    expect(screen.getByText("Sample Backpack")).toBeInTheDocument();
    expect(screen.getByText("$49.99")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Sample Backpack/i }),
    ).toHaveAttribute("href", "/products/1");
  });

  it("shows an empty state when there are no products", async () => {
    vi.mocked(getProducts).mockResolvedValueOnce({
      products: [],
      total: 0,
      skip: 0,
      limit: 100,
    });

    const ui = await HomePage();
    render(ui);

    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    expect(screen.queryByTestId("product-grid")).not.toBeInTheDocument();
  });

  it("shows the API's error message when the request fails", async () => {
    vi.mocked(getProducts).mockRejectedValueOnce(
      new ApiError(
        "Product service returned an unexpected error (status 500).",
        500,
      ),
    );

    const ui = await HomePage();
    render(ui);

    expect(screen.getByTestId("error-state")).toHaveTextContent(
      "Product service returned an unexpected error (status 500).",
    );
  });

  it("shows a generic message for a non-ApiError failure", async () => {
    vi.mocked(getProducts).mockRejectedValueOnce(new Error("boom"));

    const ui = await HomePage();
    render(ui);

    expect(screen.getByTestId("error-state")).toHaveTextContent(
      "Something went wrong while loading products.",
    );
  });
});
