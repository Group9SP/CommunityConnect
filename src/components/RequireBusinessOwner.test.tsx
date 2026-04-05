import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RequireBusinessOwner } from "./RequireBusinessOwner";

vi.mock("@/features/auth/hooks/useSession", () => ({
  useSession: () => ({
    // Minimal session shape for route guards; full Session is not required by RequireRole.
    session: { user: { id: "user-1" } },
    loading: false,
  }),
}));

vi.mock("@/features/auth/hooks/useUserRoles", () => ({
  useHasRole: () => ({
    hasRole: false,
    isLoading: false,
    isError: false,
  }),
  useUserRoles: () => ({}),
}));

describe("RequireBusinessOwner (F4.1.8 unauthorized access)", () => {
  it("blocks non–business-owner sessions with an explicit message", () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <QueryClientProvider client={qc}>
        <MemoryRouter>
          <RequireBusinessOwner>
            <div>Owner-only content</div>
          </RequireBusinessOwner>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText("Access restricted")).toBeInTheDocument();
    expect(
      screen.getByText(/This area is for business owners only/i)
    ).toBeInTheDocument();
    expect(screen.queryByText("Owner-only content")).not.toBeInTheDocument();
  });
});
