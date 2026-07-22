interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
}

const canonicalHost = "bdsmtest.top";

export async function handleRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const isCanonicalHost = url.hostname === canonicalHost;
  const isWwwHost = url.hostname === `www.${canonicalHost}`;

  if (isWwwHost || (isCanonicalHost && url.protocol !== "https:")) {
    url.protocol = "https:";
    url.hostname = canonicalHost;
    url.port = "";
    return Response.redirect(url.toString(), 301);
  }

  return env.ASSETS.fetch(request);
}

export default {
  fetch: handleRequest
};
