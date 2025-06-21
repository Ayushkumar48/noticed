<script lang="ts">
  import { Save } from "@lucide/svelte";
  import { generateHtmlFromNodes, getEditor } from "svelte-lexical";
  const editor = getEditor();
  function handleSave() {
    editor.read(() => {
      const html = generateHtmlFromNodes(editor);
      // save to db
      console.log(html);
    });
  }
</script>

<button class="cursor-pointer" onclick={handleSave}>
  <Save
    strokeWidth={1.5}
    class="hover:bg-gray-300 h-full w-full rounded-md p-1"
    color="#000"
  />
</button>
