<script lang="ts">
  import { notes } from "$lib/client";
  import NoteCard from "$lib/components/custom/notes/note-card.svelte";
  import { onMount } from "svelte";
  import { type Note } from "$lib/client";
  import { page } from "$app/state";

  let { data } = $props();
  onMount(async () => {
    localNotes = await notes.toArray();
  });
  let localNotes = $state<Note[] | null>();
  $inspect(localNotes);
</script>

{#if data.notes && data.notes.length > 0}
  <h3 class="text-center text-2xl py-6">Your Notes</h3>
  <div class="flex gap-y-4 flex-col justify-center items-center w-full">
    {#each data.notes as note (note.id)}
      <NoteCard {note} />
    {/each}
  </div>
{:else if localNotes && localNotes.length > 0}
  <h3 class="text-center text-2xl py-6">Your Local Notes</h3>
  <div class="flex gap-y-4 flex-col justify-center items-center w-full">
    {#each localNotes as note (note.id || new Date().toISOString())}
      {@const currentNote = {
        ...note,
        id: note.id || new Date().toISOString(),
        createdAt: new Date(),
        userId: page.data.user.id,
      }}
      <NoteCard note={currentNote} />
    {/each}
  </div>
{:else}
  <h3 class="text-center text-2xl py-6">Your Notes</h3>
  <p class="text-center">
    No notes found.
    <a href="/" class="underline">Create</a>
    a new note
  </p>
{/if}
