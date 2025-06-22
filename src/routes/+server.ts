import { db } from "$lib/server/db/index.js";
import { note } from "$lib/server/db/schema.js";
import { error, json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export async function POST({ request, locals }) {
  if (!locals.session || !locals.user) {
    return error(401, "Saved to local. Please login to save to Database.");
  }

  const data = await request.json();
  if (!data?.noteId) {
    return error(403, "Please provide a noteId");
  }
  const existingNote = await db
    .select()
    .from(note)
    .where(eq(note.id, data.noteId))
    .limit(1);
  let result;
  if (existingNote.length > 0) {
    [result] = await db
      .update(note)
      .set({
        content: data.html,
      })
      .where(eq(note.id, data.noteId))
      .returning();
  } else {
    [result] = await db
      .insert(note)
      .values({
        id: data.noteId,
        content: data.html,
        userId: locals.user.id,
      })
      .returning();
  }
  return json(result);
}
