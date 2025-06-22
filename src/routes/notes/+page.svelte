<script>
  import NoteCard from "$lib/components/custom/notes/note-card.svelte";

  let { data } = $props();
</script>

{#if data.notes}
  <div class="flex py-6 gap-y-4 flex-col justify-center items-center w-full">
    {#each data.notes as note}
      <NoteCard {note} />
    {/each}
  </div>
{/if}
