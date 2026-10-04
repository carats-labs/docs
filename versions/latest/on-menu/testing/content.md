# %d%.testing_title

%d%.testing_intro

## %d%.testing_setup_title

%d%.testing_desc

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      reporter: [
        "text",
        "html",
        "lcov"
      ],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/client/entrypoint.ts',
        'src/server/entrypoint.ts',
        'src/client/facets.cara.ts',
        'src/infra/**/*',
        'src/dto/**/*',
        '**/*.d.ts',
      ],
    },
  },
});
```

## %d%.testing_component_title

%d%.testing_component_desc

```tsx
// src/client/__tests__/profile-page.test.tsx
import { expect, test } from "vitest";
import { init, transpile } from "jjsx";
import Profile from "../pages/profile";

init();

test("Render profile page", () => {
    const mockUser = {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        username: "johndoe",
        phone: "123-456-7890",
        website: "johndoe.com",
    };

    const page = transpile(<Profile {...mockUser} />);

    expect(page).toContain('app-header');
    expect(page).toContain("John Doe");
    expect(page).toContain("john@example.com");
    expect(page).toContain("Vault Member");
});
```

%d%.testing_burnish_desc

`init()` installs the JJSX transpiler and must run before the first `transpile` call. Because the result is a plain HTML string, there is no DOM to set up and no rendering library to configure.

## %d%.testing_culet_title

%d%.testing_culet_desc

```typescript
// src/server/__tests__/trade-api.test.ts
import { describe, expect, test } from "vitest";
import getTradeData from "../culets/trade";

describe("Trade API", () => {
    test("GET /trade/btc", async () => {
        const mockRequest = {
            params: { symbol: "btc" },
            url: "/trade/btc",
            query: {},
            headers: {},
            cookies: {},
            method: "GET",
        };
        const result = await getTradeData(mockRequest);
        expect(result.symbol).toBe("BTC");
        expect(result.price).toBeDefined();
        expect(result.orderBook.bids.length).toBeGreaterThan(0);
    });
});
```

`@fetch-mock/vitest` is available for a culet that calls a remote API, which keeps the test offline and deterministic.

## %d%.testing_coverage_title

A component that reads `window` or `document` directly in its body cannot be transpiled in a test, because the test environment has no document. That is a useful signal rather than an obstacle: it means the side effect belongs in an `afterMount` or `beforeMount` callback, where the framework already keeps it out of the server render.
