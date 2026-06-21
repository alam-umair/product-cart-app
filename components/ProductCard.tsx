import Link from "next/link";
import { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="product-card"
      data-testid="product-card"
    >
      <div className="product-card__image-wrap">
        <img src={product.thumbnail} alt={product.title} loading="lazy" />
      </div>
      <div className="product-card__title">{product.title}</div>
      <div className="product-card__price">${product.price.toFixed(2)}</div>
    </Link>
  );
}
