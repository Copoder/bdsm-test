import { describe, expect, it, vi } from "vitest";
import { handleRequest } from "../../worker/index";

function createEnv() {
  return {
    ASSETS: {
      fetch: vi.fn(async () => new Response("asset", { status: 200 }))
    }
  };
}

describe("canonical host redirects", () => {
  it.each([
    ["http://bdsmtest.top/roles/brat/?ref=test", "https://bdsmtest.top/roles/brat/?ref=test"],
    ["http://www.bdsmtest.top/about/?ref=test", "https://bdsmtest.top/about/?ref=test"],
    ["https://www.bdsmtest.top/methodology/", "https://bdsmtest.top/methodology/"]
  ])("redirects %s in one hop", async (source, target) => {
    const env = createEnv();
    const response = await handleRequest(new Request(source), env);

    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toBe(target);
    expect(env.ASSETS.fetch).not.toHaveBeenCalled();
  });

  it.each(["https://bdsmtest.top/", "https://bdsm-test.workers.dev/"])(
    "serves assets directly for %s",
    async (source) => {
      const env = createEnv();
      const request = new Request(source);
      const response = await handleRequest(request, env);

      expect(response.status).toBe(200);
      expect(env.ASSETS.fetch).toHaveBeenCalledWith(request);
    }
  );
});
