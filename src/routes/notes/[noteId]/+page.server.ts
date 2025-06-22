import { db } from "$lib/server/db/index.js";
import { note, user } from "$lib/server/db/schema";
import { error } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";

export async function load({ params, locals }) {
  if (!locals.user || !locals.session) {
    error(404, "Not found");
  }
  const [noteRes] = await db
    .select({ note })
    .from(note)
    .leftJoin(user, eq(user.id, note.userId))
    .where(and(eq(note.id, params.noteId), eq(user.id, locals.user.id)));
  return { note: noteRes.note };
}
