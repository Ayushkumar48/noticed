<script>
  import { notes } from "$lib/client";
  import MyEditor from "$lib/components/custom/home/my-editor.svelte";
  import { liveQuery } from "dexie";
  let allNotes = liveQuery(() => notes.get("local"));
  let content = $derived($allNotes?.content || "");
</script>

<MyEditor bind:content />
