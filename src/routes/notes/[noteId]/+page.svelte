<script>
  import MyEditor from "$lib/components/custom/home/my-editor.svelte";
  let { data } = $props();
</script>

<MyEditor content={data.note.content} />
