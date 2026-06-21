import { Product, ProductListResponse } from "./types";

export const API_BASE_URL = "https://dummyjson.com";

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, init);
  } catch (err) {
    throw new ApiError(
      "Unable to reach the product service. Please check your connection and try again.",
    );
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new ApiError("The requested product could not be found.", 404);
    }
    throw new ApiError(
      `Product service returned an unexpected error (status ${response.status}).`,
      response.status,
    );
  }

  try {
    return (await response.json()) as T;
  } catch (err) {
    throw new ApiError(
      "Received an invalid response from the product service.",
    );
  }
}

export async function getProducts(limit = 100): Promise<ProductListResponse> {
  return request<ProductListResponse>(`/products?limit=${limit}`);
}

export async function getProductById(id: string | number): Promise<Product> {
  return request<Product>(`/products/${id}`);
}
