import {
  checkDuplicateUser,
  createSession,
  createUser,
  generateSessionToken,
  getUserFromAuthId,
  setSessionTokenCookie,
} from "$lib/server/auth";
import { githubAuth } from "$lib/server/db";
import { error, redirect, type RequestEvent } from "@sveltejs/kit";
import type { OAuth2Tokens } from "arctic";

export async function GET(event: RequestEvent): Promise<Response> {
  const code = event.url.searchParams.get("code");
  const state = event.url.searchParams.get("state");
  const storedState = event.cookies.get("github_oauth_state") ?? null;
  if (code === null || state === null || storedState === null) {
    return new Response(null, {
      status: 400,
    });
  }
  if (state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  let tokens: OAuth2Tokens;
  try {
    tokens = await githubAuth.validateAuthorizationCode(code);
  } catch (e) {
    // Invalid code or client credentials
    return new Response(null, {
      status: 400,
    });
  }
  const githubUserResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokens.accessToken()}`,
    },
  });
  const res = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${tokens.accessToken()}`,
      Accept: "application/vnd.github+json",
    },
  });
  const emails = await res.json();
  const githubUser = await githubUserResponse.json();
  const githubUserId = githubUser.id;

  const isDuplicateUser = await checkDuplicateUser(emails[0].email, "google");
  if (isDuplicateUser) {
    redirect(
      302,
      "/login?message=User already exists with Google. Please Login with Google",
    );
  }

  const existingUser = await getUserFromAuthId(String(githubUserId), "github");

  if (existingUser) {
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, existingUser.id);
    setSessionTokenCookie(event, sessionToken, session.expiresAt);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  }

  const newUser = await createUser({
    authProviderId: String(githubUserId),
    authProviderType: "github",
    email: emails[0].email,
    name: githubUser.name,
    picture: githubUser.avatar_url,
  });

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, newUser.id);
  setSessionTokenCookie(event, sessionToken, session.expiresAt);

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
    },
  });
}
