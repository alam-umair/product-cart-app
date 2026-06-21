import { getProducts, ApiError } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  try {
    const { products } = await getProducts();

    if (products.length === 0) {
      return (
        <div className="state-message" data-testid="empty-state">
          No products are available right now. Please check back later.
        </div>
      );
    }

    return (
      <div>
        <h1>All Products</h1>
        <div className="product-grid" data-testid="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    );
  } catch (err) {
    const message =
      err instanceof ApiError
        ? err.message
        : "Something went wrong while loading products. Please try again later.";

    return (
      <div
        className="state-message state-message--error"
        data-testid="error-state"
      >
        {message}
      </div>
    );
  }
}
