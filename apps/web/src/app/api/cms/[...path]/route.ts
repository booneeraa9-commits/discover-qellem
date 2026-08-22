import type { NextRequest } from "next/server";

// Proxy /api/cms/* to the CMS backend (NEXT_PUBLIC_CMS_URL + /api/v2/*).
// The staff session flow calls /api/cms/auth/login/, /auth/csrf/, /auth/logout/
// and /auth/session/ through this handler so cookies flow same-origin and the
// browser never hits the CMS cross-origin (no CORS).
//
// Cookies are forwarded in both directions: request cookies -> CMS, and every
// Set-Cookie the CMS returns is replayed to the browser (credentials:include).

function cmsBase(): string {
  const host = process.env.NEXT_PUBLIC_CMS_URL ?? "http://localhost:8000";
  return host.replace(/\/+$/, "");
}

async function proxy(req: NextRequest, pathSegments: string[]) {
  const target = new URL(`${cmsBase()}/api/v2/${pathSegments.join("/")}`);
  target.search = req.nextUrl.search;

  const headers = new Headers();
  // Forward auth/CSRF cookies.
  const cookie = req.headers.get("cookie");
  if (cookie) headers.set("cookie", cookie);
  if (req.headers.get("content-type")) {
    headers.set("content-type", req.headers.get("content-type")!);
  }
  if (req.headers.get("x-csrftoken")) {
    headers.set("x-csrftoken", req.headers.get("x-csrftoken")!);
  }
  headers.set("accept", "application/json");

  const init: RequestInit = {
    method: req.method,
    headers,
    credentials: "include",
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = await req.arrayBuffer();
  }

  let upstream: Response;
  try {
    upstream = await fetch(target.toString(), init);
  } catch {
    return new Response(
      JSON.stringify({ detail: "CMS is unreachable." }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    );
  }

  const outHeaders = new Headers();
  // Replay upstream cookies back to the browser.
  const setCookie = upstream.headers.get("set-cookie");
  if (setCookie) outHeaders.set("set-cookie", setCookie);
  const contentType = upstream.headers.get("content-type");
  if (contentType) outHeaders.set("content-type", contentType);

  return new Response(upstream.body, {
    status: upstream.status,
    headers: outHeaders,
  });
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxy(req, path);
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxy(req, path);
}
