import { ReactElement } from "react";
import { render, RenderResult } from "@testing-library/react";
import { CartProvider } from "@/context/CartContext";

export function renderWithCart(ui: ReactElement): RenderResult {
  return render(<CartProvider>{ui}</CartProvider>);
}
