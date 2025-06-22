import Dexie from "dexie";

interface Note {
  id?: string;
  content: string;
}
export const localDB = new Dexie("noticed");

localDB.version(1).stores({
  notes: "id, content",
});

export const notes = localDB.table<Note>("notes");
