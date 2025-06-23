<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { notes } from "$lib/client";
  import { Save } from "@lucide/svelte";
  import axios, { isAxiosError } from "axios";
  import { onMount } from "svelte";
  import { generateHtmlFromNodes, getEditor } from "svelte-lexical";
  import { toast } from "svelte-sonner";
  const editor = getEditor();
  let noteId = $derived(page.params?.noteId);
  let handleKeydown: (e: KeyboardEvent) => void;
  let isUserLoggedIn = $derived(!!page.data.user);
  onMount(() => {
    handleKeydown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  });

  function handleSave() {
    editor.read(async () => {
      const html = generateHtmlFromNodes(editor);
      const id = isUserLoggedIn ? noteId || crypto.randomUUID() : "local";
      try {
        await notes.put({
          content: html,
          id,
        });
        const response = await axios.post("/", { html, noteId: id });
        if (isUserLoggedIn && id !== "local") {
          await notes.delete("local");
        }
        toast.success("Saved successfully");
        goto(`/notes/${response.data.id}`);
      } catch (err) {
        if (isAxiosError(err)) {
          if (err.response?.status === 401)
            toast.warning(err.response?.data.message);
          else {
            toast.error(err.response?.data.message);
          }
        }
      }
    });
  }
</script>

<button
  class="cursor-pointer shrink-0 border-r h-full border-gray-200"
  onclick={handleSave}
>
  <Save
    strokeWidth={1.5}
    class="hover:bg-neutral-300 h-6 w-6 rounded-md p-0.5 mr-1"
  />
</button>
