import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById, ApiError } from "@/lib/api";
import AddToCartButton from "@/components/AddToCartButton";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let product;

  try {
    product = await getProductById(params.id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }

    const message =
      err instanceof ApiError
        ? err.message
        : "Something went wrong while loading this product. Please try again later.";

    return (
      <div>
        <Link href="/" className="back-link">
          &larr; Back to products
        </Link>
        <div className="state-message state-message--error" data-testid="error-state">
          {message}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link href="/" className="back-link">
        &larr; Back to products
      </Link>
      <div className="product-detail" data-testid="product-detail">
        <div className="product-detail__image-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.thumbnail} alt={product.title} />
        </div>
        <div>
          <h1 className="product-detail__title">{product.title}</h1>
          <p className="product-detail__price">${product.price.toFixed(2)}</p>
          <p className="product-detail__description">{product.description}</p>
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
