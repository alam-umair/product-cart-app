import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div>
      <Link href="/" className="back-link">
        &larr; Back to products
      </Link>
      <div className="state-message" data-testid="not-found-state">
        We couldn&apos;t find that product. It may have been removed.
      </div>
    </div>
  );
}
