import { generateState } from "arctic";
import type { RequestEvent } from "@sveltejs/kit";
import { githubAuth } from "$lib/server/db";

export async function GET(event: RequestEvent): Promise<Response> {
  const state = generateState();
  const url = githubAuth.createAuthorizationURL(state, ["user:email"]);

  event.cookies.set("github_oauth_state", state, {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
    },
  });
}
