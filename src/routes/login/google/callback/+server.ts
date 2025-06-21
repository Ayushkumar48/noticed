import { decodeIdToken } from "arctic";

import { redirect, type RequestEvent } from "@sveltejs/kit";
import type { OAuth2Tokens } from "arctic";
import { googleAuth } from "$lib/server/db";
import {
  checkDuplicateUser,
  createSession,
  createUser,
  generateSessionToken,
  getUserFromAuthId,
  setSessionTokenCookie,
} from "$lib/server/auth";

type GoogleClaims = {
  email: string;
  sub: string;
  name: string;
  picture: string;
};
export async function GET(event: RequestEvent): Promise<Response> {
  const code = event.url.searchParams.get("code");
  const state = event.url.searchParams.get("state");
  const storedState = event.cookies.get("google_oauth_state") ?? null;
  const codeVerifier = event.cookies.get("google_code_verifier") ?? null;
  if (
    code === null ||
    state === null ||
    storedState === null ||
    codeVerifier === null
  ) {
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
    tokens = await googleAuth.validateAuthorizationCode(code, codeVerifier);
  } catch (e) {
    return new Response(null, {
      status: 400,
    });
  }
  const claims = decodeIdToken(tokens.idToken()) as GoogleClaims;
  const googleUserId = claims.sub;

  const isDuplicateUser = await checkDuplicateUser(claims.email, "github");
  if (isDuplicateUser) {
    redirect(
      302,
      "/login?message=User already exists with GitHub. Please Login with GitHub",
    );
  }
  const existingUser = await getUserFromAuthId(googleUserId, "google");

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
    authProviderId: googleUserId,
    authProviderType: "google",
    email: claims.email,
    name: claims.name,
    picture: claims.picture,
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
