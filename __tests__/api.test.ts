import { describe, it, expect, vi, afterEach } from "vitest";
import { getProducts, getProductById, ApiError } from "@/lib/api";

function mockFetchOnce(response: Partial<Response>) {
  global.fetch = vi.fn().mockResolvedValueOnce(response as Response);
}

describe("lib/api", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("getProducts", () => {
    it("returns the parsed product list on success", async () => {
      const payload = {
        products: [{ id: 1, title: "Phone" }],
        total: 1,
        skip: 0,
        limit: 100,
      };
      mockFetchOnce({
        ok: true,
        status: 200,
        json: async () => payload,
      });

      const result = await getProducts();

      expect(result).toEqual(payload);
      expect(global.fetch).toHaveBeenCalledWith(
        "https://dummyjson.com/products?limit=100",
        undefined
      );
    });

    it("throws an ApiError when the response is not ok", async () => {
      mockFetchOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      });

      await expect(getProducts()).rejects.toThrow(ApiError);
    });

    it("throws an ApiError when fetch rejects (network failure)", async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error("network down"));

      await expect(getProducts()).rejects.toThrow(
        "Unable to reach the product service"
      );
    });
  });

  describe("getProductById", () => {
    it("returns the parsed product on success", async () => {
      const product = { id: 5, title: "Laptop" };
      mockFetchOnce({
        ok: true,
        status: 200,
        json: async () => product,
      });

      const result = await getProductById(5);

      expect(result).toEqual(product);
      expect(global.fetch).toHaveBeenCalledWith(
        "https://dummyjson.com/products/5",
        undefined
      );
    });

    it("throws a 404 ApiError when the product does not exist", async () => {
      mockFetchOnce({
        ok: false,
        status: 404,
        json: async () => ({}),
      });

      await expect(getProductById(999)).rejects.toMatchObject({
        status: 404,
      });
    });
  });
});
