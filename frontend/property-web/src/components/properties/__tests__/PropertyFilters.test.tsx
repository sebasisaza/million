import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { PropertyFilters } from "../PropertyFilters";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
  useSearchParams: vi.fn(),
}));

describe("PropertyFilters", () => {
  const replaceMock = vi.fn();

  beforeEach(() => {
    (useRouter as unknown as vi.Mock).mockReturnValue({ replace: replaceMock });
    (usePathname as unknown as vi.Mock).mockReturnValue("/properties");
    (useSearchParams as unknown as vi.Mock).mockReturnValue(new URLSearchParams());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("submits filters and updates the URL", async () => {
    render(
      <PropertyFilters
        initialFilters={{
          name: "",
          address: "",
        }}
      />,
    );

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Loft" } });
    fireEvent.change(screen.getByLabelText(/min price/i), { target: { value: "100000" } });

    fireEvent.click(screen.getByRole("button", { name: /apply filters/i }));

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/properties?name=Loft&minPrice=100000", {
        scroll: false,
      });
    });
  });

  it("resets filters and clears the URL parameters", async () => {
    render(
      <PropertyFilters
        initialFilters={{
          name: "Loft",
          address: "Main",
          minPrice: 100,
          maxPrice: 500,
        }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /reset/i }));

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/properties", {
        scroll: false,
      });
    });
  });
});

